package com.studio.backend.repository;

import com.studio.backend.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
	boolean existsBySupplierEmail(String supplierEmail);
}


