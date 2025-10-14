package com.studio.backend.Service;

import com.studio.backend.dto.OrderDtos;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.*;
import com.studio.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderListRepository orderListRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, 
                       OrderListRepository orderListRepository,
                       CustomerRepository customerRepository,
                       ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderListRepository = orderListRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public Page<OrderDtos.OrderView> list(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::toView);
    }

    @Transactional
    public OrderDtos.OrderView create(OrderDtos.OrderCreate req) {
        try {
            // Validate customer exists
            Customer customer = customerRepository.findById(req.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

            // Create order
            Order order = new Order();
            order.setCustomer(customer);
            order.setOrderDate(req.orderDate() != null ? req.orderDate() : LocalDateTime.now());
            order.setDeliveryDate(req.deliveryDate());
            order.setTotalPrice(req.totalPrice());
            order.setAdvancePayment(req.advancePayment());
            order.setBalancePayment(req.balancePayment());
            
            if (req.advancePaymentStatus() != null) {
                order.setAdvancePaymentStatus(Order.PaymentStatus.valueOf(req.advancePaymentStatus()));
            }
            if (req.balancePaymentStatus() != null) {
                order.setBalancePaymentStatus(Order.PaymentStatus.valueOf(req.balancePaymentStatus()));
            }
            if (req.orderStatus() != null) {
                order.setOrderStatus(Order.OrderStatus.valueOf(req.orderStatus()));
            }

            // Save order first to get the ID
            order = orderRepository.save(order);
            System.out.println("Order created with ID: " + order.getId());

            // Create order items after order is saved
            List<OrderList> orderItems = List.of();
            if (req.orderItems() != null && !req.orderItems().isEmpty()) {
                System.out.println("Creating " + req.orderItems().size() + " order items");
                Order finalOrder = order;
                orderItems = req.orderItems().stream()
                    .map(item -> {
                        // Validate product exists
                        Product product = productRepository.findById(item.productId())
                            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.productId()));
                        
                        OrderList orderItem = new OrderList();
                        orderItem.setOrderId(finalOrder.getId());
                        orderItem.setProductId(item.productId());
                        orderItem.setQuantity(item.quantity());
                        orderItem.setPriceEach(item.priceEach());
                        orderItem.setProduct(product);
                        return orderItem;
                    })
                    .collect(Collectors.toList());
                
                // Save order items
                orderListRepository.saveAll(orderItems);
                
                // Set the order items on the order entity for the response
                order.setOrderItems(orderItems);
                System.out.println("Order items created successfully");
            }

            return toView(order);
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public OrderDtos.OrderView update(Integer id, OrderDtos.OrderUpdate req) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (req.orderDate() != null) order.setOrderDate(req.orderDate());
        if (req.deliveryDate() != null) order.setDeliveryDate(req.deliveryDate());
        if (req.totalPrice() != null) order.setTotalPrice(req.totalPrice());
        if (req.advancePayment() != null) order.setAdvancePayment(req.advancePayment());
        if (req.balancePayment() != null) order.setBalancePayment(req.balancePayment());
        
        if (req.advancePaymentStatus() != null) {
            order.setAdvancePaymentStatus(Order.PaymentStatus.valueOf(req.advancePaymentStatus()));
        }
        if (req.balancePaymentStatus() != null) {
            order.setBalancePaymentStatus(Order.PaymentStatus.valueOf(req.balancePaymentStatus()));
        }
        if (req.orderStatus() != null) {
            order.setOrderStatus(Order.OrderStatus.valueOf(req.orderStatus()));
        }

        // Update order items if provided
        if (req.orderItems() != null) {
            // Delete existing order items
            orderListRepository.deleteByOrderId(order.getId());
            
            // Create new order items
            Order finalOrder = order;
            List<OrderList> orderItems = req.orderItems().stream()
                .map(item -> {
                    Product product = productRepository.findById(item.productId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.productId()));
                    
                    OrderList orderItem = new OrderList();
                    orderItem.setOrderId(finalOrder.getId());
                    orderItem.setProductId(item.productId());
                    orderItem.setQuantity(item.quantity());
                    orderItem.setPriceEach(item.priceEach());
                    orderItem.setProduct(product);
                    return orderItem;
                })
                .collect(Collectors.toList());
            
            orderListRepository.saveAll(orderItems);
            order.setOrderItems(orderItems);
        }

        order = orderRepository.save(order);
        return toView(order);
    }

    @Transactional
    public void delete(Integer id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        // Delete order items first
        orderListRepository.deleteByOrderId(id);
        
        // Delete order
        orderRepository.delete(order);
    }

    public OrderDtos.OrderView getById(Integer id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toView(order);
    }

    public List<OrderDtos.OrderView> getByCustomerId(Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return orders.stream().map(this::toView).collect(Collectors.toList());
    }

    public Page<OrderDtos.OrderView> getByCustomerId(Integer customerId, Pageable pageable) {
        return orderRepository.findByCustomerId(customerId, pageable).map(this::toView);
    }

    private OrderDtos.OrderView toView(Order order) {
        List<OrderDtos.OrderItemView> orderItems = List.of();
        if (order.getOrderItems() != null) {
            orderItems = order.getOrderItems().stream()
                .map(item -> new OrderDtos.OrderItemView(
                    item.getProductId(),
                    item.getProduct() != null ? item.getProduct().getName() : "Unknown Product",
                    item.getQuantity(),
                    item.getPriceEach(),
                    item.getPriceEach().multiply(BigDecimal.valueOf(item.getQuantity()))
                ))
                .collect(Collectors.toList());
        }

        OrderDtos.OrderView.CustomerInfo customerInfo = null;
        if (order.getCustomer() != null) {
            customerInfo = new OrderDtos.OrderView.CustomerInfo(
                order.getCustomer().getCustomer_id(),
                order.getCustomer().getCustomer_name(),
                order.getCustomer().getCustomer_email(),
                order.getCustomer().getCustomer_phone()
            );
        }

        return new OrderDtos.OrderView(
            order.getId(),
            order.getOrderDate(),
            order.getDeliveryDate(),
            order.getTotalPrice(),
            order.getAdvancePayment(),
            order.getAdvancePaymentStatus() != null ? order.getAdvancePaymentStatus().name() : null,
            order.getBalancePayment(),
            order.getBalancePaymentStatus() != null ? order.getBalancePaymentStatus().name() : null,
            order.getOrderStatus() != null ? order.getOrderStatus().name() : null,
            customerInfo,
            orderItems,
            order.getCreatedAt()
        );
    }
}
