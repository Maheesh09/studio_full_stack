package com.studio.backend.repository;

import com.studio.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Find orders by customer
    @Query("SELECT o FROM Order o WHERE o.customer.customer_id = :customerId")
    Page<Order> findByCustomerCustomer_id(@Param("customerId") Integer customerId, Pageable pageable);
    
    // Find orders by status
    Page<Order> findByOrderStatus(Order.OrderStatus status, Pageable pageable);
    
    // Find orders by payment status
    Page<Order> findByAdvancePaymentStatusOrBalancePaymentStatus(
            Order.PaymentStatus advanceStatus, 
            Order.PaymentStatus balanceStatus, 
            Pageable pageable);
    
    // Find orders within date range
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Page<Order> findOrdersByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate, 
                                     Pageable pageable);
    
    // Find orders by customer and status
    @Query("SELECT o FROM Order o WHERE o.customer.customer_id = :customerId AND o.orderStatus = :status")
    Page<Order> findByCustomerCustomer_idAndOrderStatus(@Param("customerId") Integer customerId, 
                                                      @Param("status") Order.OrderStatus status, 
                                                      Pageable pageable);
    
    // Count orders by status
    long countByOrderStatus(Order.OrderStatus status);
    
    // Find orders with pending payments
    @Query("SELECT o FROM Order o WHERE o.advancePaymentStatus = 'pending' OR o.balancePaymentStatus = 'pending'")
    List<Order> findOrdersWithPendingPayments();
    
    // Find orders for delivery today
    @Query("SELECT o FROM Order o WHERE DATE(o.deliveryDate) = CURRENT_DATE")
    List<Order> findOrdersForDeliveryToday();
    
    // Get order statistics
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :startDate")
    long countOrdersSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.orderDate >= :startDate AND o.orderStatus = 'completed'")
    Double getTotalRevenueSince(@Param("startDate") LocalDateTime startDate);
}
