package com.studio.backend.dto;

public record SupplierResponse(
		Integer supplierId,
		String name,
		String email,
		String phone,
		String address
) {}


