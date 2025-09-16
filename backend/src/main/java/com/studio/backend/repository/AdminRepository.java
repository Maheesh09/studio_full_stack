package com.studio.backend.repository;

import com.studio.backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository <Admin,Integer> {
    Optional<Admin> findByAdminNic(String adminNic);
}