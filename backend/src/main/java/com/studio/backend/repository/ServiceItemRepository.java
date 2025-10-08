package com.studio.backend.repository;

import com.studio.backend.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Integer> {
    boolean existsByNameIgnoreCase(String name);
}


