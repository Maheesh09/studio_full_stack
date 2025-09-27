package com.studio.backend.dto;

import jakarta.validation.constraints.Email;

public record SupplierUpdateRequest(
		String name,
		@Email String email,
		String phone,
		String address
) {}


