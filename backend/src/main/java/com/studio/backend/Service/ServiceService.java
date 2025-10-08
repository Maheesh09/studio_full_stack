package com.studio.backend.Service;

import com.studio.backend.dto.ServiceDtos;
import com.studio.backend.exception.DuplicateNameException;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.StudioService;
import com.studio.backend.repository.ServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServiceService {

    private final ServiceRepository repo;

    public ServiceService(ServiceRepository repo) { this.repo = repo; }

    public Page<ServiceDtos.View> list(Pageable pageable) {
        return repo.findAll(pageable).map(s -> new ServiceDtos.View(
            s.getId(), s.getName(), s.getDescription(), s.getPrice()
        ));
    }

    @Transactional
    public ServiceDtos.View create(ServiceDtos.Create req) {
        String name = req.service_name().trim();
        if (repo.existsByNameIgnoreCase(name)) {
            throw new DuplicateNameException("Service name already exists");
        }
        StudioService s = new StudioService();
        s.setName(name);
        s.setDescription(req.service_description());
        s.setPrice(req.service_price());
        s = repo.save(s);
        return new ServiceDtos.View(s.getId(), s.getName(), s.getDescription(), s.getPrice());
    }

    @Transactional
    public ServiceDtos.View update(Integer id, ServiceDtos.Update req) {
        StudioService s = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (req.service_name() != null) {
            String name = req.service_name().trim();
            if (!name.equalsIgnoreCase(s.getName()) && repo.existsByNameIgnoreCase(name)) {
                throw new DuplicateNameException("Service name already exists");
            }
            s.setName(name);
        }
        if (req.service_description() != null) {
            s.setDescription(req.service_description());
        }
        if (req.service_price() != null) {
            s.setPrice(req.service_price());
        }
        s = repo.save(s);
        return new ServiceDtos.View(s.getId(), s.getName(), s.getDescription(), s.getPrice());
    }

    @Transactional
    public void delete(Integer id) {
        if (!repo.existsById(id)) throw new ResourceNotFoundException("Service not found");
        repo.deleteById(id);
    }
}


