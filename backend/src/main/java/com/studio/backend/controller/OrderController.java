package com.studio.backend.controller;

import com.studio.backend.Service.OrderService;
import com.studio.backend.Service.ProductService;
import com.studio.backend.dto.OrderDtos;
import com.studio.backend.dto.ProductDtos;
import com.studio.backend.model.Order;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderController {

    private final OrderService orderService;
    private final ProductService productService;

    public OrderController(OrderService orderService, ProductService productService) {
        this.orderService = orderService;
        this.productService = productService;
    }

    // Get all orders (admin only)
    @GetMapping
    public Page<OrderDtos.Summary> list(Pageable pageable, HttpSession session) {
        requireAdmin(session);
        return orderService.listSummaries(pageable);
    }

    // Get order details by ID
    @GetMapping("/{id}")
    public OrderDtos.View getById(@PathVariable Integer id, HttpSession session) {
        // Check if user is admin or the order belongs to the customer
        if (session.getAttribute("ADMIN_ID") == null) {
            Integer customerId = (Integer) session.getAttribute("customerId");
            if (customerId == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
            }
            // Additional check: verify the order belongs to this customer
            // This would require a method in service to check ownership
        }
        return orderService.findById(id);
    }

    // Create new order (admin only)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDtos.View create(@Valid @RequestBody OrderDtos.Create req, HttpSession session) {
        System.out.println("Order creation request received");
        System.out.println("Session ID: " + session.getId());
        System.out.println("ADMIN_ID in session: " + session.getAttribute("ADMIN_ID"));
        System.out.println("All session attributes: " + java.util.Collections.list(session.getAttributeNames()));
        
        requireAdmin(session);
        // Admin can create orders for any customer using the customer ID from the request
        return orderService.create(req);
    }

    // Update order (admin only)
    @PutMapping("/{id}")
    public OrderDtos.View update(@PathVariable Integer id, 
                                @Valid @RequestBody OrderDtos.Update req, 
                                HttpSession session) {
        requireAdmin(session);
        return orderService.update(id, req);
    }

    // Update payment status
    @PatchMapping("/{id}/payment")
    public OrderDtos.View updatePayment(@PathVariable Integer id, 
                                       @Valid @RequestBody OrderDtos.PaymentUpdate req, 
                                       HttpSession session) {
        requireAdmin(session);
        return orderService.updatePayment(id, req);
    }

    // Delete order (admin only)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpSession session) {
        requireAdmin(session);
        orderService.delete(id);
    }

    // Get orders by customer
    @GetMapping("/customer/{customerId}")
    public Page<OrderDtos.View> getByCustomer(@PathVariable Integer customerId, 
                                             Pageable pageable, 
                                             HttpSession session) {
        requireAdmin(session);
        return orderService.findByCustomer(customerId, pageable);
    }

    // Get orders by status
    @GetMapping("/status/{status}")
    public Page<OrderDtos.View> getByStatus(@PathVariable Order.OrderStatus status, 
                                           Pageable pageable, 
                                           HttpSession session) {
        requireAdmin(session);
        return orderService.findByStatus(status, pageable);
    }

    // Get customer's own orders
    @GetMapping("/my-orders")
    public Page<OrderDtos.View> getMyOrders(Pageable pageable, HttpSession session) {
        Integer customerId = (Integer) session.getAttribute("customerId");
        if (customerId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Customer authentication required");
        }
        return orderService.findByCustomer(customerId, pageable);
    }

    // Get orders for delivery today (admin only)
    @GetMapping("/delivery/today")
    public List<Order> getOrdersForDeliveryToday(HttpSession session) {
        requireAdmin(session);
        return orderService.getOrdersForDeliveryToday();
    }

    // Get orders with pending payments (admin only)
    @GetMapping("/pending-payments")
    public List<Order> getOrdersWithPendingPayments(HttpSession session) {
        requireAdmin(session);
        return orderService.getOrdersWithPendingPayments();
    }

    // Get available products for order creation
    @GetMapping("/available-products")
    public Page<ProductDtos.View> getAvailableProducts(Pageable pageable, HttpSession session) {
        // Allow both admin and customers to see available products
        return productService.getAvailableProducts(pageable);
    }

    // Helper method to require admin authentication
    private void requireAdmin(HttpSession session) {
        System.out.println("Checking admin authentication...");
        System.out.println("Session ID: " + session.getId());
        System.out.println("ADMIN_ID: " + session.getAttribute("ADMIN_ID"));
        
        if (session.getAttribute("ADMIN_ID") == null) {
            System.out.println("Admin authentication failed - no ADMIN_ID in session");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin authentication required");
        }
        System.out.println("Admin authentication successful");
    }
}
