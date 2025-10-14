package com.studio.backend.Service;

import com.studio.backend.dto.OrderDtos;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.Customer;
import com.studio.backend.model.Order;
import com.studio.backend.model.OrderList;
import com.studio.backend.model.Product;
import com.studio.backend.repository.CustomerRepository;
import com.studio.backend.repository.OrderListRepository;
import com.studio.backend.repository.OrderRepository;
import com.studio.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final OrderListRepository orderListRepo;
    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;

    public OrderService(OrderRepository orderRepo, OrderListRepository orderListRepo,
                       CustomerRepository customerRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.orderListRepo = orderListRepo;
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
    }

    @Transactional(readOnly = true)
    public Page<OrderDtos.View> list(Pageable pageable) {
        return orderRepo.findAll(pageable).map(this::toView);
    }

    @Transactional(readOnly = true)
    public Page<OrderDtos.Summary> listSummaries(Pageable pageable) {
        return orderRepo.findAll(pageable).map(this::toSummary);
    }

    @Transactional(readOnly = true)
    public Page<OrderDtos.View> findByCustomer(Integer customerId, Pageable pageable) {
        return orderRepo.findByCustomerCustomer_id(customerId, pageable).map(this::toView);
    }

    @Transactional(readOnly = true)
    public Page<OrderDtos.View> findByStatus(Order.OrderStatus status, Pageable pageable) {
        return orderRepo.findByOrderStatus(status, pageable).map(this::toView);
    }

    @Transactional(readOnly = true)
    public OrderDtos.View findById(Integer orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toView(order);
    }

    @Transactional
    public OrderDtos.View create(OrderDtos.Create req) {
        // Validate customer exists
        Customer customer = customerRepo.findById(req.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(req.orderDate() != null ? req.orderDate() : LocalDateTime.now());
        order.setDeliveryDate(req.deliveryDate());
        order.setTotalPrice(req.totalPrice());
        order.setAdvancePayment(req.advancePayment());
        order.setBalancePayment(req.balancePayment());

        // Calculate total from order items if not provided
        if (req.totalPrice() == null) {
            BigDecimal calculatedTotal = calculateOrderTotal(req.orderItems());
            order.setTotalPrice(calculatedTotal);
        }

        // Save order first
        order = orderRepo.save(order);

        // Create order items
        List<OrderList> orderItems = new ArrayList<>();
        for (OrderDtos.OrderItemCreate itemReq : req.orderItems()) {
            Product product = productRepo.findById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.productId()));

            OrderList orderItem = new OrderList();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.quantity());
            orderItem.setPriceEach(itemReq.priceEach());

            orderItems.add(orderItem);
        }

        // Save order items
        orderListRepo.saveAll(orderItems);
        order.setOrderItems(orderItems);

        return toView(order);
    }

    @Transactional
    public OrderDtos.View update(Integer orderId, OrderDtos.Update req) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (req.orderDate() != null) {
            order.setOrderDate(req.orderDate());
        }
        if (req.deliveryDate() != null) {
            order.setDeliveryDate(req.deliveryDate());
        }
        if (req.totalPrice() != null) {
            order.setTotalPrice(req.totalPrice());
        }
        if (req.advancePayment() != null) {
            order.setAdvancePayment(req.advancePayment());
        }
        if (req.advancePaymentStatus() != null) {
            order.setAdvancePaymentStatus(req.advancePaymentStatus());
        }
        if (req.balancePayment() != null) {
            order.setBalancePayment(req.balancePayment());
        }
        if (req.balancePaymentStatus() != null) {
            order.setBalancePaymentStatus(req.balancePaymentStatus());
        }
        if (req.orderStatus() != null) {
            order.setOrderStatus(req.orderStatus());
        }

        order = orderRepo.save(order);
        return toView(order);
    }

    @Transactional
    public OrderDtos.View updatePayment(Integer orderId, OrderDtos.PaymentUpdate req) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (req.paymentType() == OrderDtos.PaymentType.ADVANCE) {
            order.setAdvancePaymentStatus(req.paymentStatus());
            if (req.amount() != null) {
                order.setAdvancePayment(req.amount());
            }
        } else if (req.paymentType() == OrderDtos.PaymentType.BALANCE) {
            order.setBalancePaymentStatus(req.paymentStatus());
            if (req.amount() != null) {
                order.setBalancePayment(req.amount());
            }
        }

        order = orderRepo.save(order);
        return toView(order);
    }

    @Transactional
    public void delete(Integer orderId) {
        if (!orderRepo.existsById(orderId)) {
            throw new ResourceNotFoundException("Order not found");
        }
        orderListRepo.deleteByOrderOrderId(orderId);
        orderRepo.deleteById(orderId);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersForDeliveryToday() {
        return orderRepo.findOrdersForDeliveryToday();
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersWithPendingPayments() {
        return orderRepo.findOrdersWithPendingPayments();
    }

    // Helper methods
    private BigDecimal calculateOrderTotal(List<OrderDtos.OrderItemCreate> orderItems) {
        return orderItems.stream()
                .map(item -> item.priceEach().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private OrderDtos.View toView(Order order) {
        List<OrderDtos.OrderItemView> orderItemViews = new ArrayList<>();
        if (order.getOrderItems() != null) {
            for (OrderList item : order.getOrderItems()) {
                orderItemViews.add(new OrderDtos.OrderItemView(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceEach(),
                        item.getLineTotal()
                ));
            }
        }

        return new OrderDtos.View(
                order.getOrderId(),
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getTotalPrice(),
                order.getAdvancePayment(),
                order.getAdvancePaymentStatus(),
                order.getBalancePayment(),
                order.getBalancePaymentStatus(),
                order.getOrderStatus(),
                order.getCustomer().getCustomer_id(),
                order.getCustomer().getCustomer_name(),
                order.getCustomer().getCustomer_email(),
                order.getCreatedAt(),
                orderItemViews
        );
    }

    private OrderDtos.Summary toSummary(Order order) {
        return new OrderDtos.Summary(
                order.getOrderId(),
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getTotalPrice(),
                order.getAdvancePaymentStatus(),
                order.getBalancePaymentStatus(),
                order.getOrderStatus(),
                order.getCustomer().getCustomer_id(),
                order.getCustomer().getCustomer_name(),
                order.getCreatedAt()
        );
    }
}
