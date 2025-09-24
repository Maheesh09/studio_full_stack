package com.studio.backend.controller;

import com.studio.backend.dto.CustomerCrud;
import com.studio.backend.model.Customer;
import com.studio.backend.repository.CustomerRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Pageable;                  // ✅ right one

@RestController
@RequestMapping("/api/admin/customers")
public class CustomerAdminController {
    private final CustomerRepository repo;
    public CustomerAdminController(CustomerRepository repo) {this.repo = repo;}

    private void reqireAdmin(HttpSession session) {
        if(session.getAttribute("ADMIN_ID") == null){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping
    public Page<Customer> list(Pageable pageable, HttpSession session){
        if(session.getAttribute("ADMIN_ID") == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return repo.findAll(pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer create(@RequestBody CustomerCrud.CustomerCreate req, HttpSession session){
        reqireAdmin(session);
        Customer c = new Customer();
        c.setCustomer_name(req.customer_name());
        c.setCustomer_phone(req.customer_phone());
        c.setCustomer_email(req.customer_email());
        return  repo.save(c);
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Integer id, @RequestBody CustomerCrud.CustomerUpdate req, HttpSession session){
        reqireAdmin(session);
        Customer c = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if(req.customer_name() != null) c.setCustomer_name(req.customer_name());
        if(req.customer_phone() != null) c.setCustomer_phone(req.customer_phone());
        if(req.customer_email() != null) c.setCustomer_email(req.customer_email());
        return  repo.save(c);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpSession session){
        reqireAdmin(session);
        if(!repo.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        repo.deleteById(id);
    }
}
