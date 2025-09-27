package com.studio.backend.controller;

import com.studio.backend.Service.SupplierAdminService;
import com.studio.backend.dto.SupplierCreateRequest;
import com.studio.backend.dto.SupplierResponse;
import com.studio.backend.dto.SupplierUpdateRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/suppliers")
public class AdminSupplierController {

	private final SupplierAdminService service;

	public AdminSupplierController(SupplierAdminService service) { this.service = service; }

	private boolean isAdmin(HttpSession session) { return session.getAttribute("ADMIN_ID") != null; }

	@PostMapping
	public ResponseEntity<IdResponse> create(@Valid @RequestBody SupplierCreateRequest req, HttpSession session) {
		if (!isAdmin(session)) return ResponseEntity.status(401).build();
		Integer id = service.create(req);
		return ResponseEntity.ok(new IdResponse(id));
	}

	@GetMapping
	public ResponseEntity<List<SupplierResponse>> list(HttpSession session) {
		if (!isAdmin(session)) return ResponseEntity.status(401).build();
		return ResponseEntity.ok(service.list());
	}

	@GetMapping("/{id}")
	public ResponseEntity<SupplierResponse> get(@PathVariable Integer id, HttpSession session) {
		if (!isAdmin(session)) return ResponseEntity.status(401).build();
		return ResponseEntity.ok(service.get(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Void> update(@PathVariable Integer id, @Valid @RequestBody SupplierUpdateRequest req, HttpSession session) {
		if (!isAdmin(session)) return ResponseEntity.status(401).build();
		service.update(id, req);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Integer id, HttpSession session) {
		if (!isAdmin(session)) return ResponseEntity.status(401).build();
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	public record IdResponse(Integer supplierId) {}
}


