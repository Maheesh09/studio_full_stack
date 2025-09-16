package com.studio.backend.controller;

import com.studio.backend.Service.AdminAuthService;
import com.studio.backend.dto.AdminLoginRequest;
import com.studio.backend.dto.AdminLoginResponse;
import com.studio.backend.model.Admin;
import com.studio.backend.repository.AdminRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/admins")
public class AdminAuthController {

    private final AdminAuthService service;

    public AdminAuthController(AdminAuthService service) {this.service = service;}

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest req, HttpSession session) {
        var admin = service.validateLogin(req.adminNic(), req.password());
        session.setAttribute("ADMIN_ID",admin.getAdmin_id());
        session.setAttribute("ADMIN_NIC",admin.getAdmin_nic());
        session.setAttribute("ADMIN_NAME",admin.getAdmin_name());
        return ResponseEntity.ok(new AdminLoginResponse("ok", admin.getAdmin_id(), admin.getAdmin_nic(), admin.getAdmin_name()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String,Object>> me(HttpSession session) {
        var id = session.getAttribute("ADMIN_ID");
        if(id == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Map<String,Object> me = Map.of(
                "adminId",id,
                "adminNic",session.getAttribute("ADMIN_NIC"),
                "adminName",session.getAttribute("ADMIN_NAME")
        );
        return ResponseEntity.ok(me);
    }
}