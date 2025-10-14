package com.studio.backend.controller;

import com.studio.backend.Service.OrderService;
import com.studio.backend.dto.OrderDtos;
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
public class OrderAdminController {

    private final OrderService orderService;

    public OrderAdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    private void requireAdmin(HttpSession session) {
        if (session.getAttribute("ADMIN_ID") == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping
    public Page<OrderDtos.OrderView> list(Pageable pageable, HttpSession session) {
        requireAdmin(session);
        return orderService.list(pageable);
    }

    @GetMapping("/{id}")
    public OrderDtos.OrderView getById(@PathVariable Integer id, HttpSession session) {
        requireAdmin(session);
        return orderService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDtos.OrderView create(@Valid @RequestBody OrderDtos.OrderCreate req, HttpSession session) {
        requireAdmin(session);
        return orderService.create(req);
    }

    @PutMapping("/{id}")
    public OrderDtos.OrderView update(@PathVariable Integer id, 
                                    @Valid @RequestBody OrderDtos.OrderUpdate req, 
                                    HttpSession session) {
        requireAdmin(session);
        return orderService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpSession session) {
        requireAdmin(session);
        orderService.delete(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<OrderDtos.OrderView> getByCustomerId(@PathVariable Integer customerId, HttpSession session) {
        requireAdmin(session);
        return orderService.getByCustomerId(customerId);
    }

    @GetMapping("/customer/{customerId}/page")
    public Page<OrderDtos.OrderView> getByCustomerIdPage(@PathVariable Integer customerId, 
                                                        Pageable pageable, 
                                                        HttpSession session) {
        requireAdmin(session);
        return orderService.getByCustomerId(customerId, pageable);
    }
}
