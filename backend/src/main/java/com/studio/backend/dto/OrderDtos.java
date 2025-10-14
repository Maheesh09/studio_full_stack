package com.studio.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    public record OrderItemCreate(
        @NotNull(message = "Product ID is required")
        Integer productId,
        
        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        Integer quantity,
        
        @NotNull(message = "Price each is required")
        @DecimalMin(value = "0.0", message = "Price each must be non-negative")
        BigDecimal priceEach
    ) {}

    public record OrderCreate(
        @NotNull(message = "Customer ID is required")
        Integer customerId,
        
        LocalDateTime orderDate,
        LocalDateTime deliveryDate,
        
        @DecimalMin(value = "0.0", message = "Total price must be non-negative")
        BigDecimal totalPrice,
        
        @DecimalMin(value = "0.0", message = "Advance payment must be non-negative")
        BigDecimal advancePayment,
        
        @DecimalMin(value = "0.0", message = "Balance payment must be non-negative")
        BigDecimal balancePayment,
        
        @Pattern(regexp = "unpaid|pending|verified|failed", message = "Invalid advance payment status")
        String advancePaymentStatus,
        
        @Pattern(regexp = "unpaid|pending|verified|failed", message = "Invalid balance payment status")
        String balancePaymentStatus,
        
        @Pattern(regexp = "pending|processing|completed|cancelled|refunded|shipped|delivered", message = "Invalid order status")
        String orderStatus,
        
        @NotEmpty(message = "Order items are required")
        List<OrderItemCreate> orderItems
    ) {}

    public record OrderUpdate(
        LocalDateTime orderDate,
        LocalDateTime deliveryDate,
        
        @DecimalMin(value = "0.0", message = "Total price must be non-negative")
        BigDecimal totalPrice,
        
        @DecimalMin(value = "0.0", message = "Advance payment must be non-negative")
        BigDecimal advancePayment,
        
        @DecimalMin(value = "0.0", message = "Balance payment must be non-negative")
        BigDecimal balancePayment,
        
        @Pattern(regexp = "unpaid|pending|verified|failed", message = "Invalid advance payment status")
        String advancePaymentStatus,
        
        @Pattern(regexp = "unpaid|pending|verified|failed", message = "Invalid balance payment status")
        String balancePaymentStatus,
        
        @Pattern(regexp = "pending|processing|completed|cancelled|refunded|shipped|delivered", message = "Invalid order status")
        String orderStatus,
        
        List<OrderItemCreate> orderItems
    ) {}

    public record OrderItemView(
        Integer productId,
        String productName,
        Integer quantity,
        BigDecimal priceEach,
        BigDecimal totalPrice
    ) {}

    public record OrderView(
        Integer id,
        LocalDateTime orderDate,
        LocalDateTime deliveryDate,
        BigDecimal totalPrice,
        BigDecimal advancePayment,
        String advancePaymentStatus,
        BigDecimal balancePayment,
        String balancePaymentStatus,
        String orderStatus,
        CustomerInfo customer,
        List<OrderItemView> orderItems,
        LocalDateTime createdAt
    ) {
        public record CustomerInfo(
            Integer id,
            String name,
            String email,
            String phone
        ) {}
    }

    public record OrderListResponse(
        List<OrderView> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int size
    ) {}
}
