package com.studio.backend.dto;

public record AdminLoginResponse(
        String status, Integer adminId, String adminNic, String adminName
) {}
