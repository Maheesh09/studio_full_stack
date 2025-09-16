package com.studio.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record AdminLoginRequest(String adminNic, String password) {}