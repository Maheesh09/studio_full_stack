package com.studio.backend.controller;

import com.studio.backend.Service.ServiceItemService;
import com.studio.backend.dto.ServiceDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceItemService service;

    public ServiceController(ServiceItemService service) { 
        this.service = service; 
    }

    @GetMapping
    public Page<ServiceDtos.View> list(Pageable pageable) {
        return service.list(pageable);
    }
}
