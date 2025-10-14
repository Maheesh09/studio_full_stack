package com.studio.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class OrderListId implements Serializable {
    private Integer orderId;
    private Integer productId;

    // Default constructor
    public OrderListId() {}

    // Constructor
    public OrderListId(Integer orderId, Integer productId) {
        this.orderId = orderId;
        this.productId = productId;
    }

    // Getters and Setters
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderListId that = (OrderListId) o;
        return Objects.equals(orderId, that.orderId) && Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, productId);
    }
}
