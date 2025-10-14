package com.studio.backend.model;

import java.io.Serializable;
import java.util.Objects;

public class OrderListId implements Serializable {

    private Integer order;
    private Integer product;

    // Constructors
    public OrderListId() {}

    public OrderListId(Integer order, Integer product) {
        this.order = order;
        this.product = product;
    }

    // Getters and Setters
    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Integer getProduct() {
        return product;
    }

    public void setProduct(Integer product) {
        this.product = product;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderListId that = (OrderListId) o;
        return Objects.equals(order, that.order) && Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(order, product);
    }
}
