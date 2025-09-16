package com.studio.backend.Service;

import com.studio.backend.model.Admin;
import com.studio.backend.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final AdminRepository repo;
    private final PasswordEncoder encoder;
    public AdminAuthService(AdminRepository repo, PasswordEncoder encoder) {this.repo = repo;this.encoder = encoder;}

    public Admin validateLogin(String adminNic, String rawPassword){

        var admin = repo.findByAdminNic(adminNic).orElseThrow(() -> new RuntimeException("Invalid Credentials"));
        if(!encoder.matches(rawPassword, admin.getAdmin_password())) throw  new RuntimeException("Invalid Credentials");
        return admin;
    }
}
