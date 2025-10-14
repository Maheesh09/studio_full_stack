package com.studio.backend.repository;

import com.studio.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
	boolean existsByNameIgnoreCase(String name);
	Page<Product> findByAvailabilityIn(List<Product.Availability> availabilities, Pageable pageable);
}


