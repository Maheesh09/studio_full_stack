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
    
    // Find orders by customer ID
    @Query("SELECT o FROM Order o WHERE o.customer.customer_id = :customerId")
    List<Order> findByCustomerId(@Param("customerId") Integer customerId);
    
    // Find orders by customer ID with pagination
    @Query("SELECT o FROM Order o WHERE o.customer.customer_id = :customerId")
    Page<Order> findByCustomerId(@Param("customerId") Integer customerId, Pageable pageable);
    
    // Find orders by status
    List<Order> findByOrderStatus(Order.OrderStatus orderStatus);
    
    // Find orders by status with pagination
    Page<Order> findByOrderStatus(Order.OrderStatus orderStatus, Pageable pageable);
    
    // Find orders by advance payment status
    List<Order> findByAdvancePaymentStatus(Order.PaymentStatus advancePaymentStatus);
    
    // Find orders by balance payment status
    List<Order> findByBalancePaymentStatus(Order.PaymentStatus balancePaymentStatus);
    
    // Find orders by date range
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate);
    
    // Find orders by date range with pagination
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Page<Order> findByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                      @Param("endDate") LocalDateTime endDate, 
                                      Pageable pageable);
    
    // Find orders by customer name (case insensitive)
    @Query("SELECT o FROM Order o WHERE LOWER(o.customer.customer_name) LIKE LOWER(CONCAT('%', :customerName, '%'))")
    List<Order> findByCustomerNameContainingIgnoreCase(@Param("customerName") String customerName);
    
    // Find orders by customer name with pagination
    @Query("SELECT o FROM Order o WHERE LOWER(o.customer.customer_name) LIKE LOWER(CONCAT('%', :customerName, '%'))")
    Page<Order> findByCustomerNameContainingIgnoreCase(@Param("customerName") String customerName, Pageable pageable);
    
    // Find all orders with pagination
    Page<Order> findAll(Pageable pageable);
    
    // Count orders by status
    long countByOrderStatus(Order.OrderStatus orderStatus);
    
    // Count orders by customer
    @Query("SELECT COUNT(o) FROM Order o WHERE o.customer.customer_id = :customerId")
    long countByCustomerId(@Param("customerId") Integer customerId);
}
