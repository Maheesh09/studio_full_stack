package com.studio.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products", uniqueConstraints = {
	@UniqueConstraint(name = "uk_product_name", columnNames = "product_name")
})
public class Product {

	public enum Availability {
		in_stock, out_of_stock, preorder, discontinued
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "product_id")
	private Integer id;

	@Column(name = "product_name", nullable = false, length = 45)
	private String name;

	@Column(name = "product_description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "product_price", nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	@Enumerated(EnumType.STRING)
	@Column(name = "availability", nullable = false, length = 20)
	private Availability availability = Availability.in_stock;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pc_id", foreignKey = @ForeignKey(name = "products_pc_id_fk"))
	private ProductCategory category;

	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	public Integer getId() { return id; }
	public void setId(Integer id) { this.id = id; }

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }

	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }

	public BigDecimal getPrice() { return price; }
	public void setPrice(BigDecimal price) { this.price = price; }

	public Availability getAvailability() { return availability; }
	public void setAvailability(Availability availability) { this.availability = availability; }

	public ProductCategory getCategory() { return category; }
	public void setCategory(ProductCategory category) { this.category = category; }

	public LocalDateTime getCreatedAt() { return createdAt; }
}


