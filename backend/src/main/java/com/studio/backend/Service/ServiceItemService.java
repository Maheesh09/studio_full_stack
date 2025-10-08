package com.studio.backend.Service;

import com.studio.backend.dto.ServiceDtos;
import com.studio.backend.exception.DuplicateNameException;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.ServiceItem;
import com.studio.backend.repository.ServiceItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceItemService {

	private final ServiceItemRepository repo;

	public ServiceItemService(ServiceItemRepository repo) { this.repo = repo; }

	public Page<ServiceDtos.View> list(Pageable pageable) {
		return repo.findAll(pageable).map(this::toView);
	}

	@Transactional
	public ServiceDtos.View create(ServiceDtos.Create req) {
		String name = req.service_name().trim();
		if (repo.existsByNameIgnoreCase(name)) {
			throw new DuplicateNameException("Service name already exists");
		}
		ServiceItem s = new ServiceItem();
		s.setName(name);
		s.setPrice(req.service_price());
		s.setDescription(req.service_description());
		s = repo.save(s);
		return toView(s);
	}

	@Transactional
	public ServiceDtos.View update(Integer id, ServiceDtos.Update req) {
		ServiceItem s = repo.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Service not found"));
		if (req.service_name() != null) {
			String name = req.service_name().trim();
			if (!name.equalsIgnoreCase(s.getName()) && repo.existsByNameIgnoreCase(name)) {
				throw new DuplicateNameException("Service name already exists");
			}
			s.setName(name);
		}
		if (req.service_price() != null) s.setPrice(req.service_price());
		if (req.service_description() != null) s.setDescription(req.service_description());
		s = repo.save(s);
		return toView(s);
	}

	@Transactional
	public void delete(Integer id) {
		if (!repo.existsById(id)) throw new ResourceNotFoundException("Service not found");
		repo.deleteById(id);
	}

	private ServiceDtos.View toView(ServiceItem s) {
		return new ServiceDtos.View(
			s.getId(),
			s.getName(),
			s.getDescription(),
			s.getPrice(),
			s.getCreatedAt() == null ? null : s.getCreatedAt().toString()
		);
	}
}


