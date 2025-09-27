package com.studio.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ProductDtos {

	public record Create(
		@NotBlank @Size(max = 45) String product_name,
		@NotNull @DecimalMin(value = "0.0") BigDecimal product_price,
		Integer pc_id,
		String product_description,
		@Pattern(regexp = "in_stock|out_of_stock|preorder|discontinued") String availability
	) {}

	public record Update(
		@Size(max = 45) String product_name,
		@DecimalMin(value = "0.0") BigDecimal product_price,
		Integer pc_id,
		String product_description,
		@Pattern(regexp = "in_stock|out_of_stock|preorder|discontinued") String availability
	) {}

	public record View(
		Integer id,
		String name,
		String description,
		BigDecimal price,
		String availability,
		Category category
	) {
		public record Category(Integer id, String name) {}
	}
}


