package com.studio.backend.dto;

import com.studio.backend.model.Booking;
import com.studio.backend.model.Order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CustomerProfileDtos {

    public record CustomerProfileResponse(
        CustomerInfo customer,
        List<OrderSummary> orders,
        List<BookingSummary> bookings,
        PaymentSummary payments
    ) {}

    public record CustomerInfo(
        Integer id,
        String name,
        String email,
        String phone,
        LocalDateTime createdAt
    ) {}

    public record OrderSummary(
        Integer id,
        LocalDateTime orderDate,
        LocalDateTime deliveryDate,
        BigDecimal totalPrice,
        BigDecimal advancePayment,
        BigDecimal balancePayment,
        String advancePaymentStatus,
        String balancePaymentStatus,
        String orderStatus,
        List<OrderItemSummary> orderItems,
        LocalDateTime createdAt
    ) {}

    public record OrderItemSummary(
        Integer productId,
        String productName,
        Integer quantity,
        BigDecimal priceEach,
        BigDecimal totalPrice
    ) {}

    public record BookingSummary(
        Integer id,
        String customerName,
        String bookingDescription,
        String serviceName,
        String bookingStatus,
        LocalDateTime bookingDate,
        LocalDateTime createdAt
    ) {}

    public record PaymentSummary(
        BigDecimal totalPaid,
        BigDecimal totalPending,
        BigDecimal totalAdvance,
        BigDecimal totalBalance,
        int totalOrders,
        int paidOrders,
        int pendingOrders
    ) {}
}
