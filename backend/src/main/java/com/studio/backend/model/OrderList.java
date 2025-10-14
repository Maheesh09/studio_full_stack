package com.studio.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_List")
@IdClass(OrderListId.class)
public class OrderList {

    @Id
    @Column(name = "order_id")
    private Integer orderId;

    @Id
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price_each", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceEach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", insertable = false, updatable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    @MapsId("productId")
    private Product product;

    // Constructors
    public OrderList() {}

    public OrderList(Integer orderId, Integer productId, Integer quantity, BigDecimal priceEach) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.priceEach = priceEach;
    }

    // Getters and Setters
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPriceEach() { return priceEach; }
    public void setPriceEach(BigDecimal priceEach) { this.priceEach = priceEach; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
