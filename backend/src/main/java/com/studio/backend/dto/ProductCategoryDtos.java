package com.studio.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ProductCategoryDtos {
	public record Create(@NotBlank String pc_name, String pc_description) {}
	public record Update(@NotBlank String pc_name, String pc_description) {}
	public record View(Integer id, String name, String description) {}
}


