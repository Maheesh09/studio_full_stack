package com.studio.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_categories", uniqueConstraints = {
		@UniqueConstraint(name = "uk_pc_name", columnNames = "pc_name")
})
public class ProductCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pc_id")
	private Integer id;

	@Column(name = "pc_name", nullable = false, length = 120)
	private String name;

	@Column(name = "pc_description", length = 500)
	private String description;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	public Integer getId() { return id; }
	public void setId(Integer id) { this.id = id; }

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }

	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }

	public LocalDateTime getCreatedAt() { return createdAt; }
}


