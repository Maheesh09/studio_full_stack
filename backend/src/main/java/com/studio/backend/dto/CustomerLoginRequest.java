package com.studio.backend.dto;

import jakarta.validation.constraints.*;


public record CustomerLoginRequest(
        @Email @NotBlank @Size(max = 45) String email,
        @NotBlank @Size(max = 45) String password
) {}