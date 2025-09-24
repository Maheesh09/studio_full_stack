package com.studio.backend.repository;

import com.studio.backend.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {
	boolean existsByNameIgnoreCase(String name);
}


