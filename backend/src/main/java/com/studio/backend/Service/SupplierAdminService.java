package com.studio.backend.Service;

import com.studio.backend.dto.SupplierCreateRequest;
import com.studio.backend.dto.SupplierResponse;
import com.studio.backend.dto.SupplierUpdateRequest;
import com.studio.backend.exception.EmailAlreadyUsedException;
import com.studio.backend.model.Supplier;
import com.studio.backend.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierAdminService {

	private final SupplierRepository repo;

	public SupplierAdminService(SupplierRepository repo) { this.repo = repo; }

	@Transactional
	public Integer create(SupplierCreateRequest req) {
		if (req.email() != null && repo.existsBySupplierEmail(req.email())) {
			throw new EmailAlreadyUsedException();
		}
		Supplier s = new Supplier();
		s.setSupplierName(req.name());
		s.setSupplierEmail(req.email());
		s.setSupplierPhone(req.phone());
		s.setSupplierAddress(req.address());
		return repo.save(s).getSupplierId();
	}

	@Transactional(readOnly = true)
	public SupplierResponse get(Integer id) {
		Supplier s = repo.findById(id).orElseThrow();
		return toDto(s);
	}

	@Transactional(readOnly = true)
	public List<SupplierResponse> list() {
		return repo.findAll().stream().map(this::toDto).toList();
	}

	@Transactional
	public void update(Integer id, SupplierUpdateRequest req) {
		Supplier s = repo.findById(id).orElseThrow();
		if (req.name() != null && !req.name().isBlank()) s.setSupplierName(req.name());
		if (req.phone() != null) s.setSupplierPhone(req.phone());
		if (req.address() != null) s.setSupplierAddress(req.address());
		if (req.email() != null && !req.email().isBlank()) {
			if (!req.email().equalsIgnoreCase(s.getSupplierEmail())
					&& repo.existsBySupplierEmail(req.email())) {
				throw new EmailAlreadyUsedException();
			}
			s.setSupplierEmail(req.email());
		}
		repo.save(s);
	}

	@Transactional
	public void delete(Integer id) {
		repo.deleteById(id);
	}

	private SupplierResponse toDto(Supplier s) {
		return new SupplierResponse(
				s.getSupplierId(),
				s.getSupplierName(),
				s.getSupplierEmail(),
				s.getSupplierPhone(),
				s.getSupplierAddress()
		);
	}
}


