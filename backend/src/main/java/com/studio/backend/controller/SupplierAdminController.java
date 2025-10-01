package com.studio.backend.controller;

import com.studio.backend.Service.SupplierService;
import com.studio.backend.dto.SupplierDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/suppliers")
public class SupplierAdminController {

    private final SupplierService service;

    public SupplierAdminController(SupplierService service) { 
        this.service = service; 
    }

    @GetMapping
    public Page<SupplierDtos.View> list(Pageable pageable) {
        return service.list(pageable);
    }

    @PostMapping
    public SupplierDtos.View create(@Valid @RequestBody SupplierDtos.Create req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public SupplierDtos.View update(@PathVariable Integer id, @Valid @RequestBody SupplierDtos.Update req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
