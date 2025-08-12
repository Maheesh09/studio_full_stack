package com.studio.backend.repository;

import com.studio.backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository <Admin,Integer> {
}
