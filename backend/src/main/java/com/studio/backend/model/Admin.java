package com.studio.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer admin_id;

    @Column(name = "admin_nic")
    private String adminNic;

    @Column(name = "admin_name")
    private String admin_name;

    @Column(name = "admin_password")
    private String admin_password;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false)
    private LocalDateTime created_at;

    public Integer getAdmin_id() {
        return admin_id;
    }

    public void setAdmin_id(Integer admin_id) {
        this.admin_id = admin_id;
    }

    public String getAdmin_nic() {
        return adminNic;
    }

    public void setAdmin_nic(String admin_nic) {
        this.adminNic = admin_nic;
    }

    public String getAdmin_name() {
        return admin_name;
    }

    public void setAdmin_name(String admin_name) {
        this.admin_name = admin_name;
    }

    public String getAdmin_password() {
        return admin_password;
    }

    public void setAdmin_password(String admin_password) {
        this.admin_password = admin_password;
    }
}