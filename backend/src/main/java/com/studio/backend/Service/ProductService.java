package com.studio.backend.Service;

import com.studio.backend.dto.ProductDtos;
import com.studio.backend.exception.DuplicateNameException;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.Product;
import com.studio.backend.model.ProductCategory;
import com.studio.backend.repository.ProductRepository;
import com.studio.backend.repository.ProductCategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final ProductCategoryRepository pcRepo;

    public ProductService(ProductRepository repo, ProductCategoryRepository pcRepo) {
        this.repo = repo;
        this.pcRepo = pcRepo;
    }

    public Page<ProductDtos.View> list(Pageable pageable) {
        return repo.findAll(pageable).map(this::toView);
    }

    @Transactional
    public ProductDtos.View create(ProductDtos.Create req) {
        String name = req.product_name().trim();
        if (repo.existsByNameIgnoreCase(name)) {
            throw new DuplicateNameException("Product name already exists");
        }
        Product p = new Product();
        p.setName(name);
        p.setPrice(req.product_price());
        p.setDescription(req.product_description());
        if (req.availability() != null) {
            p.setAvailability(Product.Availability.valueOf(req.availability()));
        }
        if (req.pc_id() != null) {
            ProductCategory pc = pcRepo.findById(req.pc_id())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            p.setCategory(pc);
        }
        p = repo.save(p);
        return toView(p);
    }

    @Transactional
    public ProductDtos.View update(Integer id, ProductDtos.Update req) {
        Product p = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (req.product_name() != null) {
            String name = req.product_name().trim();
            if (!name.equalsIgnoreCase(p.getName()) && repo.existsByNameIgnoreCase(name)) {
                throw new DuplicateNameException("Product name already exists");
            }
            p.setName(name);
        }
        if (req.product_price() != null) p.setPrice(req.product_price());
        if (req.product_description() != null) p.setDescription(req.product_description());
        if (req.availability() != null) p.setAvailability(Product.Availability.valueOf(req.availability()));
        if (req.pc_id() != null) {
            ProductCategory pc = pcRepo.findById(req.pc_id())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            p.setCategory(pc);
        }
        p = repo.save(p);
        return toView(p);
    }

    @Transactional
    public void delete(Integer id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        repo.deleteById(id);
    }

    private ProductDtos.View toView(Product p) {
        ProductDtos.View.Category cat = null;
        if (p.getCategory() != null) {
            cat = new ProductDtos.View.Category(p.getCategory().getId(), p.getCategory().getName());
        }
        return new ProductDtos.View(
            p.getId(),
            p.getName(),
            p.getDescription(),
            p.getPrice(),
            p.getAvailability().name(),
            cat
        );
    }
}


