package com.studio.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_list")
@IdClass(OrderListId.class)
public class OrderList {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", 
                foreignKey = @ForeignKey(name = "order_list_order_id_fk"))
    private Order order;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", 
                foreignKey = @ForeignKey(name = "order_list_product_id_fk"))
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price_each", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceEach;

    // Constructors
    public OrderList() {}

    public OrderList(Order order, Product product, Integer quantity, BigDecimal priceEach) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.priceEach = priceEach;
    }

    // Getters and Setters
    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceEach() {
        return priceEach;
    }

    public void setPriceEach(BigDecimal priceEach) {
        this.priceEach = priceEach;
    }

    // Helper method to calculate line total
    public BigDecimal getLineTotal() {
        if (quantity != null && priceEach != null) {
            return priceEach.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }
}
