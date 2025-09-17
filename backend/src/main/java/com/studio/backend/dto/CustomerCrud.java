package com.studio.backend.dto;

public class CustomerCrud {

    public record CustomerCreate(
            String customer_name,
            String customer_email,
            String customer_phone,
            String customer_password // optional here if you want to set/reset
    ) {}

    public record CustomerUpdate(
            String customer_name,
            String customer_email,
            String customer_phone
    ) {}
}
