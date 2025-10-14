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

    // Find all order items for a specific order
    List<OrderList> findByOrderOrderId(Integer orderId);
    
    // Find all order items for a specific product
    List<OrderList> findByProductId(Integer productId);
    
    // Find order items by order and product
    OrderList findByOrderOrderIdAndProductId(Integer orderId, Integer productId);
    
    // Get total quantity sold for a product
    @Query("SELECT SUM(ol.quantity) FROM OrderList ol WHERE ol.product.id = :productId")
    Long getTotalQuantitySoldForProduct(@Param("productId") Integer productId);
    
    // Get top selling products
    @Query("SELECT ol.product.id, ol.product.name, SUM(ol.quantity) as totalQuantity " +
           "FROM OrderList ol " +
           "GROUP BY ol.product.id, ol.product.name " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> getTopSellingProducts();
    
    // Delete all order items for a specific order
    void deleteByOrderOrderId(Integer orderId);
}
