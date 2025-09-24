package com.studio.backend.controller;

import com.studio.backend.Service.ProductCategoryService;
import com.studio.backend.dto.ProductCategoryDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/categories")
public class ProductCategoryAdminController {

	private final ProductCategoryService service;

	public ProductCategoryAdminController(ProductCategoryService service) { this.service = service; }

	@GetMapping
	public Page<ProductCategoryDtos.View> list(Pageable pageable){
		return service.list(pageable);
	}

	@PostMapping
	public ProductCategoryDtos.View create(@Valid @RequestBody ProductCategoryDtos.Create req){
		return service.create(req);
	}

	@PutMapping("/{id}")
	public ProductCategoryDtos.View rename(@PathVariable Integer id, @Valid @RequestBody ProductCategoryDtos.Update req){
		return service.rename(id, req);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Integer id){
		service.delete(id);
	}
}


