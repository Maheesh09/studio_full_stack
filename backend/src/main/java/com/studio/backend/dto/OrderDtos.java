package com.studio.backend.dto;

import com.studio.backend.model.Order;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDtos {

    // Create Order Request DTO
    public record Create(
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
            
            @NotNull(message = "Order items are required")
            @NotEmpty(message = "Order must contain at least one item")
            List<OrderItemCreate> orderItems
    ) {}

    // Order Item for Create Request
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

    // Update Order Request DTO
    public record Update(
            LocalDateTime orderDate,
            LocalDateTime deliveryDate,
            
            @DecimalMin(value = "0.0", message = "Total price must be non-negative")
            BigDecimal totalPrice,
            
            @DecimalMin(value = "0.0", message = "Advance payment must be non-negative")
            BigDecimal advancePayment,
            
            Order.PaymentStatus advancePaymentStatus,
            
            @DecimalMin(value = "0.0", message = "Balance payment must be non-negative")
            BigDecimal balancePayment,
            
            Order.PaymentStatus balancePaymentStatus,
            Order.OrderStatus orderStatus
    ) {}

    // View Order Response DTO
    public record View(
            Integer orderId,
            LocalDateTime orderDate,
            LocalDateTime deliveryDate,
            BigDecimal totalPrice,
            BigDecimal advancePayment,
            Order.PaymentStatus advancePaymentStatus,
            BigDecimal balancePayment,
            Order.PaymentStatus balancePaymentStatus,
            Order.OrderStatus orderStatus,
            Integer customerId,
            String customerName,
            String customerEmail,
            LocalDateTime createdAt,
            List<OrderItemView> orderItems
    ) {}

    // Order Item View DTO
    public record OrderItemView(
            Integer productId,
            String productName,
            Integer quantity,
            BigDecimal priceEach,
            BigDecimal lineTotal
    ) {}

    // Order Summary DTO (for lists)
    public record Summary(
            Integer orderId,
            LocalDateTime orderDate,
            LocalDateTime deliveryDate,
            BigDecimal totalPrice,
            Order.PaymentStatus advancePaymentStatus,
            Order.PaymentStatus balancePaymentStatus,
            Order.OrderStatus orderStatus,
            Integer customerId,
            String customerName,
            LocalDateTime createdAt
    ) {}

    // Payment Update DTO
    public record PaymentUpdate(
            @NotNull(message = "Payment type is required")
            PaymentType paymentType,
            
            @NotNull(message = "Payment status is required")
            Order.PaymentStatus paymentStatus,
            
            @DecimalMin(value = "0.0", message = "Amount must be non-negative")
            BigDecimal amount
    ) {}

    public enum PaymentType {
        ADVANCE, BALANCE
    }
}
