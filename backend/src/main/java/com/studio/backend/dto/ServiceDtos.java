package com.studio.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ServiceDtos {

	public record Create(
		@NotBlank @Size(max = 45) String service_name,
		@DecimalMin(value = "0.0") BigDecimal service_price,
		String service_description
	) {}

	public record Update(
		@Size(max = 45) String service_name,
		@DecimalMin(value = "0.0") BigDecimal service_price,
		String service_description
	) {}

	public record View(
		Integer service_id,
		String service_name,
		String service_description,
		BigDecimal service_price,
		String created_at
	) {}
}


