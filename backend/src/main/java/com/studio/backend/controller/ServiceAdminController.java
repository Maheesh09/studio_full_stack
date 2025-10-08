package com.studio.backend.controller;

import com.studio.backend.Service.ServiceService;
import com.studio.backend.dto.ServiceDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/services")
public class ServiceAdminController {

    private final ServiceService service;

    public ServiceAdminController(ServiceService service) { this.service = service; }

    @GetMapping
    public Page<ServiceDtos.View> list(Pageable pageable) { return service.list(pageable); }

    @PostMapping
    public ServiceDtos.View create(@Valid @RequestBody ServiceDtos.Create req) { return service.create(req); }

    @PutMapping("/{id}")
    public ServiceDtos.View update(@PathVariable Integer id, @Valid @RequestBody ServiceDtos.Update req) { return service.update(id, req); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) { service.delete(id); }
}


