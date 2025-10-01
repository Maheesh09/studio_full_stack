package com.studio.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.time.LocalDateTime;

public class SupplierDtos {
    public record Create(
        @NotBlank String supplier_name,
        String supplier_phone,
        @Email String supplier_email,
        String supplier_address
    ) {}
    
    public record Update(
        @NotBlank String supplier_name,
        String supplier_phone,
        @Email String supplier_email,
        String supplier_address
    ) {}
    
    public record View(
        Integer supplier_id,
        String supplier_name,
        String supplier_phone,
        String supplier_email,
        String supplier_address,
        LocalDateTime created_at
    ) {}
}
