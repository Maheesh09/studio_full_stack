package com.studio.backend.controller;

import com.studio.backend.Service.CustomerService;
import com.studio.backend.dto.CustomerLoginRequest;
import com.studio.backend.dto.CustomerLoginResponse;
import com.studio.backend.dto.CustomerRegistrationRequest;
import com.studio.backend.dto.CustomerProfileDtos.CustomerProfileResponse;
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
    public ResponseEntity<CustomerLoginResponse> login(@Valid @RequestBody CustomerLoginRequest req,jakarta.servlet.http.HttpSession session) {
        CustomerLoginResponse res = service.login(req);
        session.setAttribute("customerId",res.customerId());
        session.setAttribute("customerName",res.name());
        session.setAttribute("customerEmail",res.email());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/me")
    public ResponseEntity<CustomerLoginResponse> me(jakarta.servlet.http.HttpSession session) {
        Object id = session.getAttribute("customerId");
        if(id == null){
            return ResponseEntity.status(401).build();
        }
        Integer customerId = (Integer)id;
        String name = (String) session.getAttribute("customerName");
        String email = (String) session.getAttribute("customerEmail");
        return ResponseEntity.ok(new CustomerLoginResponse("ok", customerId, name, email));

    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(jakarta.servlet.http.HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile")
    public ResponseEntity<CustomerProfileResponse> getProfile(jakarta.servlet.http.HttpSession session) {
        Object id = session.getAttribute("customerId");
        if(id == null){
            return ResponseEntity.status(401).build();
        }
        Integer customerId = (Integer)id;
        CustomerProfileResponse profile = service.getCustomerProfile(customerId);
        return ResponseEntity.ok(profile);
    }
    
}