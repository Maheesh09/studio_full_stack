package com.studio.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ServiceDtos {

    public record Create(
        @NotBlank @Size(max = 45) String service_name,
        String service_description,
        @DecimalMin(value = "0.0") BigDecimal service_price
    ) {}

    public record Update(
        @Size(max = 45) String service_name,
        String service_description,
        @DecimalMin(value = "0.0") BigDecimal service_price
    ) {}

    public record View(
        Integer id,
        String name,
        String description,
        BigDecimal price
    ) {}
}


