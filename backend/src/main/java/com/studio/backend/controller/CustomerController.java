package com.studio.backend.controller;

import com.studio.backend.Service.CustomerService;
import com.studio.backend.dto.CustomerLoginRequest;
import com.studio.backend.dto.CustomerLoginResponse;
import com.studio.backend.dto.CustomerRegistrationRequest;
import com.studio.backend.model.Customer;
import com.studio.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;



@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService service;

    public CustomerController(CustomerService service) { this.service = service; }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody CustomerRegistrationRequest req) {
        Integer id = service.register(req);
        return ResponseEntity.ok(new RegistrationResponse("registered", id));
    }

    public record RegistrationResponse(String status, Integer customerId) {}

    @PostMapping("/login")
    public ResponseEntity<CustomerLoginResponse> login(@Valid @RequestBody CustomerLoginRequest req) {
        return ResponseEntity.ok(service.login(req));
    }
}