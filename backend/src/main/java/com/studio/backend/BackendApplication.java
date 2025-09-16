package com.studio.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("admin123"));

		SpringApplication.run(BackendApplication.class, args);
	}

}
