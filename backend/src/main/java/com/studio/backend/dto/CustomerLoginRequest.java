package com.studio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;


public record CustomerLoginRequest(
        @Email @NotBlank @Size(max = 45) String email,
        @NotBlank @Size(max = 45) String password
) {}