package com.studio.backend.repository;

import com.studio.backend.model.StudioService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<StudioService, Integer> {
    boolean existsByNameIgnoreCase(String name);
}


