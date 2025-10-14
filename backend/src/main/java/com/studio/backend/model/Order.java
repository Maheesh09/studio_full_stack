package com.studio.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    public enum OrderStatus {
        pending, processing, completed, cancelled, refunded, shipped, delivered
    }

    public enum PaymentStatus {
        unpaid, pending, verified, failed
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer id;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "advance_payment", precision = 10, scale = 2)
    private BigDecimal advancePayment;

    @Enumerated(EnumType.STRING)
    @Column(name = "advance_payment_status", length = 20)
    private PaymentStatus advancePaymentStatus = PaymentStatus.unpaid;

    @Column(name = "balance_payment", precision = 10, scale = 2)
    private BigDecimal balancePayment;

    @Enumerated(EnumType.STRING)
    @Column(name = "balance_payment_status", length = 20)
    private PaymentStatus balancePaymentStatus = PaymentStatus.unpaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", length = 20)
    private OrderStatus orderStatus = OrderStatus.pending;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", foreignKey = @ForeignKey(name = "orders_customer_id_fk"))
    private Customer customer;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private List<OrderList> orderItems;

    // Constructors
    public Order() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public BigDecimal getAdvancePayment() { return advancePayment; }
    public void setAdvancePayment(BigDecimal advancePayment) { this.advancePayment = advancePayment; }

    public PaymentStatus getAdvancePaymentStatus() { return advancePaymentStatus; }
    public void setAdvancePaymentStatus(PaymentStatus advancePaymentStatus) { this.advancePaymentStatus = advancePaymentStatus; }

    public BigDecimal getBalancePayment() { return balancePayment; }
    public void setBalancePayment(BigDecimal balancePayment) { this.balancePayment = balancePayment; }

    public PaymentStatus getBalancePaymentStatus() { return balancePaymentStatus; }
    public void setBalancePaymentStatus(PaymentStatus balancePaymentStatus) { this.balancePaymentStatus = balancePaymentStatus; }

    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderList> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderList> orderItems) { this.orderItems = orderItems; }
}
