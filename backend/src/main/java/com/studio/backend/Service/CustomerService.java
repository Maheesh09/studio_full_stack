package com.studio.backend.Service;
import com.studio.backend.dto.CustomerLoginRequest;
import com.studio.backend.dto.CustomerLoginResponse;
import com.studio.backend.dto.CustomerRegistrationRequest;
import com.studio.backend.dto.CustomerProfileDtos.*;
import com.studio.backend.exception.EmailAlreadyUsedException;
import com.studio.backend.exception.InvalidCredentialException;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.Customer;
import com.studio.backend.model.Order;
import com.studio.backend.model.Booking;
import com.studio.backend.repository.CustomerRepository;
import com.studio.backend.repository.OrderRepository;
import com.studio.backend.repository.BookingRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    private final CustomerRepository repo;
    private final PasswordEncoder encoder;
    private final OrderRepository orderRepository;
    private final BookingRepository bookingRepository;

    public CustomerService(CustomerRepository repo, PasswordEncoder encoder, 
                          OrderRepository orderRepository, BookingRepository bookingRepository) {
        this.repo = repo;
        this.encoder = encoder;
        this.orderRepository = orderRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Integer register(CustomerRegistrationRequest req){
        if(repo.existsByEmail(req.email())){
            throw new EmailAlreadyUsedException();
        }
        Customer c = new Customer();
        c.setCustomer_name(req.name());
        c.setCustomer_phone(req.phone());
        c.setCustomer_email(req.email());
        c.setCustomer_password(encoder.encode(req.password()));
        return  repo.save(c).getCustomer_id();
    }
    public CustomerLoginResponse login(CustomerLoginRequest req){
        Customer c = repo.findByEmail(req.email())
                .orElseThrow(InvalidCredentialException::new);

        if(!encoder.matches(req.password(),c.getCustomer_password())){
            throw new InvalidCredentialException();
        }
        return new CustomerLoginResponse("ok",c.getCustomer_id(),c.getCustomer_name(),c.getCustomer_email());
    }

    @Transactional(readOnly = true)
    public CustomerProfileResponse getCustomerProfile(Integer customerId) {
        Customer customer = repo.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        // Get customer orders
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        List<OrderSummary> orderSummaries = orders.stream()
                .map(this::mapToOrderSummary)
                .collect(Collectors.toList());

        // Get customer bookings
        List<Booking> bookings = bookingRepository.findByCustomerId(customerId);
        List<BookingSummary> bookingSummaries = bookings.stream()
                .map(this::mapToBookingSummary)
                .collect(Collectors.toList());

        // Calculate payment summary
        PaymentSummary paymentSummary = calculatePaymentSummary(orders);

        return new CustomerProfileResponse(
                mapToCustomerInfo(customer),
                orderSummaries,
                bookingSummaries,
                paymentSummary
        );
    }

    private CustomerInfo mapToCustomerInfo(Customer customer) {
        return new CustomerInfo(
                customer.getCustomer_id(),
                customer.getCustomer_name(),
                customer.getCustomer_email(),
                customer.getCustomer_phone(),
                customer.getCreated_at()
        );
    }

    private OrderSummary mapToOrderSummary(Order order) {
        List<OrderItemSummary> orderItems = order.getOrderItems() != null ?
                order.getOrderItems().stream()
                        .map(item -> new OrderItemSummary(
                                item.getProductId(),
                                item.getProduct() != null ? item.getProduct().getName() : "Unknown Product",
                                item.getQuantity(),
                                item.getPriceEach(),
                                item.getPriceEach().multiply(BigDecimal.valueOf(item.getQuantity()))
                        ))
                        .collect(Collectors.toList()) : List.of();

        return new OrderSummary(
                order.getId(),
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getTotalPrice(),
                order.getAdvancePayment(),
                order.getBalancePayment(),
                order.getAdvancePaymentStatus() != null ? order.getAdvancePaymentStatus().name() : null,
                order.getBalancePaymentStatus() != null ? order.getBalancePaymentStatus().name() : null,
                order.getOrderStatus() != null ? order.getOrderStatus().name() : null,
                orderItems,
                order.getCreatedAt()
        );
    }

    private BookingSummary mapToBookingSummary(Booking booking) {
        return new BookingSummary(
                booking.getId(),
                booking.getCustomerName(),
                booking.getBookingDescription(),
                booking.getService() != null ? booking.getService().getName() : "Unknown Service",
                booking.getBookingStatus() != null ? booking.getBookingStatus().name() : null,
                booking.getBookingDate(),
                booking.getCreatedAt()
        );
    }

    private PaymentSummary calculatePaymentSummary(List<Order> orders) {
        BigDecimal totalPaid = BigDecimal.ZERO;
        BigDecimal totalPending = BigDecimal.ZERO;
        BigDecimal totalAdvance = BigDecimal.ZERO;
        BigDecimal totalBalance = BigDecimal.ZERO;
        int totalOrders = orders.size();
        int paidOrders = 0;
        int pendingOrders = 0;

        for (Order order : orders) {
            // Calculate advance payments
            if (order.getAdvancePayment() != null) {
                totalAdvance = totalAdvance.add(order.getAdvancePayment());
                if (order.getAdvancePaymentStatus() == Order.PaymentStatus.verified) {
                    totalPaid = totalPaid.add(order.getAdvancePayment());
                } else {
                    totalPending = totalPending.add(order.getAdvancePayment());
                }
            }

            // Calculate balance payments
            if (order.getBalancePayment() != null) {
                totalBalance = totalBalance.add(order.getBalancePayment());
                if (order.getBalancePaymentStatus() == Order.PaymentStatus.verified) {
                    totalPaid = totalPaid.add(order.getBalancePayment());
                } else {
                    totalPending = totalPending.add(order.getBalancePayment());
                }
            }

            // Count paid/pending orders
            boolean isPaid = (order.getAdvancePaymentStatus() == Order.PaymentStatus.verified) &&
                           (order.getBalancePaymentStatus() == Order.PaymentStatus.verified);
            if (isPaid) {
                paidOrders++;
            } else {
                pendingOrders++;
            }
        }

        return new PaymentSummary(
                totalPaid,
                totalPending,
                totalAdvance,
                totalBalance,
                totalOrders,
                paidOrders,
                pendingOrders
        );
    }
}

