package com.studio.backend.repository;

import com.studio.backend.model.OrderList;
import com.studio.backend.model.OrderListId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderListRepository extends JpaRepository<OrderList, OrderListId> {
    
    // Find order items by order ID
    @Query("SELECT ol FROM OrderList ol WHERE ol.orderId = :orderId")
    List<OrderList> findByOrderId(@Param("orderId") Integer orderId);
    
    // Find order items by product ID
    @Query("SELECT ol FROM OrderList ol WHERE ol.productId = :productId")
    List<OrderList> findByProductId(@Param("productId") Integer productId);
    
    // Delete order items by order ID
    void deleteByOrderId(Integer orderId);
    
    // Find order items with product details
    @Query("SELECT ol FROM OrderList ol JOIN FETCH ol.product WHERE ol.orderId = :orderId")
    List<OrderList> findByOrderIdWithProduct(@Param("orderId") Integer orderId);
    
    // Find order items with order details
    @Query("SELECT ol FROM OrderList ol JOIN FETCH ol.order WHERE ol.productId = :productId")
    List<OrderList> findByProductIdWithOrder(@Param("productId") Integer productId);
}
