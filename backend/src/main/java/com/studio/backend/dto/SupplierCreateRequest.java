package com.studio.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SupplierCreateRequest(
		@NotBlank(message = "name is required") String name,
		@Email(message = "invalid email") String email,
		String phone,
		String address
) {}


