package com.studio.backend.repository;

import com.studio.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer,Integer> {
    @Query("SELECT COUNT(c) > 0 FROM Customer c WHERE c.customer_email = :email")
    boolean existsByCustomer_email(@Param("email") String email);
    
    @Query("SELECT c FROM Customer c WHERE c.customer_email = :email")
    Optional<Customer> findByCustomer_email(@Param("email") String email);
}