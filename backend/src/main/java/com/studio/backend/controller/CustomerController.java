package com.studio.backend.controller;

import com.studio.backend.model.Customer;
import com.studio.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CustomerController {

    @Autowired
    private CustomerRepository userRepository;

    @PostMapping("/customer")
    Customer newCustomer(@RequestBody Customer newCustomer){

        return userRepository.save(newCustomer);
    }

    @GetMapping("/customers")
    List<Customer> getAllCustomers(){

        return userRepository.findAll();
    }
}
