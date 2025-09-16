package com.studio.backend.controller;

import com.studio.backend.model.Customer;
import com.studio.backend.repository.CustomerRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.awt.print.Pageable;

@RestController
@RequestMapping("/api/admin/customers")
public class CustomerAdminController {
    private final CustomerRepository repo;
    public CustomerAdminController(CustomerRepository repo) {this.repo = repo;}

    @GetMapping
    public Page<Customer> list(Pageable pageable, HttpSession session){
        if(session.getAttribute("ADMIN_ID") == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return repo.findAll((org.springframework.data.domain.Pageable) pageable);
    }
}
