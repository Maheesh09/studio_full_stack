package com.studio.backend.repository;

import com.studio.backend.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    @Query("SELECT COUNT(s) > 0 FROM Supplier s WHERE LOWER(s.supplier_email) = LOWER(:email)")
    boolean existsBySupplierEmailIgnoreCase(@Param("email") String email);
    
    @Query("SELECT COUNT(s) > 0 FROM Supplier s WHERE LOWER(s.supplier_name) = LOWER(:name)")
    boolean existsBySupplierNameIgnoreCase(@Param("name") String name);
}