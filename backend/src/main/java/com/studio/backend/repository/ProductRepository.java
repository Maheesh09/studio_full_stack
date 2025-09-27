package com.studio.backend.repository;

import com.studio.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
	boolean existsByNameIgnoreCase(String name);
}


