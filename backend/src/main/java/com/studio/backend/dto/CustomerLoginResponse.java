package com.studio.backend.dto;

public record CustomerLoginResponse(

        String status,
        Integer customerId,
        String name,
        String email
) {}