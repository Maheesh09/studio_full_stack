package com.studio.backend.Service;

import com.studio.backend.dto.SupplierDtos;
import com.studio.backend.exception.DuplicateNameException;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.Supplier;
import com.studio.backend.repository.SupplierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SupplierService {

    private final SupplierRepository repo;

    public SupplierService(SupplierRepository repo) { 
        this.repo = repo; 
    }

    public Page<SupplierDtos.View> list(Pageable pageable){
        return repo.findAll(pageable).map(supplier -> 
            new SupplierDtos.View(
                supplier.getSupplier_id(),
                supplier.getSupplier_name(),
                supplier.getSupplier_phone(),
                supplier.getSupplier_email(),
                supplier.getSupplier_address(),
                supplier.getCreated_at()
            )
        );
    }

    @Transactional
    public SupplierDtos.View create(SupplierDtos.Create req){
        String name = req.supplier_name().trim();
        String email = req.supplier_email() != null ? req.supplier_email().trim() : null;
        
        if(repo.existsBySupplierNameIgnoreCase(name)){
            throw new DuplicateNameException("Supplier name already exists");
        }
        
        if(email != null && !email.isEmpty() && repo.existsBySupplierEmailIgnoreCase(email)){
            throw new DuplicateNameException("Supplier email already exists");
        }
        
        Supplier supplier = new Supplier();
        supplier.setSupplier_name(name);
        supplier.setSupplier_phone(req.supplier_phone() != null ? req.supplier_phone().trim() : null);
        supplier.setSupplier_email(email);
        supplier.setSupplier_address(req.supplier_address() != null ? req.supplier_address().trim() : null);
        
        supplier = repo.save(supplier);
        
        return new SupplierDtos.View(
            supplier.getSupplier_id(),
            supplier.getSupplier_name(),
            supplier.getSupplier_phone(),
            supplier.getSupplier_email(),
            supplier.getSupplier_address(),
            supplier.getCreated_at()
        );
    }

    @Transactional
    public SupplierDtos.View update(Integer id, SupplierDtos.Update req){
        Supplier supplier = repo.findById(id).orElseThrow(() -> 
            new ResourceNotFoundException("Supplier not found")
        );
        
        String name = req.supplier_name().trim();
        String email = req.supplier_email() != null ? req.supplier_email().trim() : null;
        
        if(!name.equalsIgnoreCase(supplier.getSupplier_name()) && repo.existsBySupplierNameIgnoreCase(name)){
            throw new DuplicateNameException("Supplier name already exists");
        }
        
        if(email != null && !email.isEmpty() && 
           !email.equalsIgnoreCase(supplier.getSupplier_email()) && 
           repo.existsBySupplierEmailIgnoreCase(email)){
            throw new DuplicateNameException("Supplier email already exists");
        }
        
        supplier.setSupplier_name(name);
        supplier.setSupplier_phone(req.supplier_phone() != null ? req.supplier_phone().trim() : null);
        supplier.setSupplier_email(email);
        supplier.setSupplier_address(req.supplier_address() != null ? req.supplier_address().trim() : null);
        
        supplier = repo.save(supplier);
        
        return new SupplierDtos.View(
            supplier.getSupplier_id(),
            supplier.getSupplier_name(),
            supplier.getSupplier_phone(),
            supplier.getSupplier_email(),
            supplier.getSupplier_address(),
            supplier.getCreated_at()
        );
    }

    @Transactional
    public void delete(Integer id){
        if(!repo.existsById(id)){
            throw new ResourceNotFoundException("Supplier not found");
        }
        repo.deleteById(id);
    }
}