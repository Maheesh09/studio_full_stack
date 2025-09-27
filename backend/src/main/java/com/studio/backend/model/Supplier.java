package com.studio.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
public class Supplier {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "supplier_id")
	private Integer supplierId;

	@Column(name = "supplier_name", nullable = false)
	private String supplierName;

	@Column(name = "supplier_phone")
	private String supplierPhone;

	@Column(name = "supplier_email", unique = true)
	private String supplierEmail;

	@Column(name = "supplier_address")
	private String supplierAddress;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	public Integer getSupplierId() { return supplierId; }
	public void setSupplierId(Integer supplierId) { this.supplierId = supplierId; }

	public String getSupplierName() { return supplierName; }
	public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

	public String getSupplierPhone() { return supplierPhone; }
	public void setSupplierPhone(String supplierPhone) { this.supplierPhone = supplierPhone; }

	public String getSupplierEmail() { return supplierEmail; }
	public void setSupplierEmail(String supplierEmail) { this.supplierEmail = supplierEmail; }

	public String getSupplierAddress() { return supplierAddress; }
	public void setSupplierAddress(String supplierAddress) { this.supplierAddress = supplierAddress; }

	public LocalDateTime getCreatedAt() { return createdAt; }
}


