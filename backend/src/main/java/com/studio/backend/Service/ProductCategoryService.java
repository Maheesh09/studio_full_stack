package com.studio.backend.Service;

import com.studio.backend.dto.ProductCategoryDtos;
import com.studio.backend.exception.DuplicateNameException;
import com.studio.backend.exception.ResourceNotFoundException;
import com.studio.backend.model.ProductCategory;
import com.studio.backend.repository.ProductCategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductCategoryService {

	private final ProductCategoryRepository repo;

	public ProductCategoryService(ProductCategoryRepository repo) { this.repo = repo; }

	public Page<ProductCategoryDtos.View> list(Pageable pageable){
		return repo.findAll(pageable).map(pc -> new ProductCategoryDtos.View(pc.getId(), pc.getName(), pc.getDescription()));
	}

	@Transactional
	public ProductCategoryDtos.View create(ProductCategoryDtos.Create req){
		String name = req.pc_name().trim();
		if(repo.existsByNameIgnoreCase(name)){
			throw new DuplicateNameException("Category name already exists");
		}
		ProductCategory pc = new ProductCategory();
		pc.setName(name);
		pc.setDescription(req.pc_description() != null ? req.pc_description().trim() : null);
		pc = repo.save(pc);
		return new ProductCategoryDtos.View(pc.getId(), pc.getName(), pc.getDescription());
	}

	@Transactional
	public ProductCategoryDtos.View rename(Integer id, ProductCategoryDtos.Update req){
		ProductCategory pc = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
		String name = req.pc_name().trim();
		if(!name.equalsIgnoreCase(pc.getName()) && repo.existsByNameIgnoreCase(name)){
			throw new DuplicateNameException("Category name already exists");
		}
		pc.setName(name);
		pc.setDescription(req.pc_description() != null ? req.pc_description().trim() : null);
		pc = repo.save(pc);
		return new ProductCategoryDtos.View(pc.getId(), pc.getName(), pc.getDescription());
	}

	@Transactional
	public void delete(Integer id){
		if(!repo.existsById(id)){
			throw new ResourceNotFoundException("Category not found");
		}
		repo.deleteById(id);
	}
}


