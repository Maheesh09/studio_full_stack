package com.studio.backend.controller;

import com.studio.backend.Service.ProductService;
import com.studio.backend.dto.ProductDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/products")
public class ProductAdminController {

	private final ProductService service;

	public ProductAdminController(ProductService service) { this.service = service; }

	@GetMapping
	public Page<ProductDtos.View> list(Pageable pageable) {
		return service.list(pageable);
	}

	@PostMapping
	public ProductDtos.View create(@Valid @RequestBody ProductDtos.Create req) {
		return service.create(req);
	}

	@PutMapping("/{id}")
	public ProductDtos.View update(@PathVariable Integer id, @Valid @RequestBody ProductDtos.Update req) {
		return service.update(id, req);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Integer id) {
		service.delete(id);
	}
}


