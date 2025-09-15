package com.studio.backend.dto;


import jakarta.validation.constraints.*;
public record CustomerRegistrationRequest(
    @NotBlank @Size(max = 20) String name,
    @Pattern(regexp = "^[0-9+\\-()\\s]{0,45}$",message = "Invalid phone") String phone,
    @Email @NotBlank @Size (max = 45) String email,
    @NotBlank @Size (min = 8, max = 72) String password
){}




