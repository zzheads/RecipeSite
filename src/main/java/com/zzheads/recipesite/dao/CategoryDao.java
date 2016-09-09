package com.zzheads.recipesite.dao;//

import com.zzheads.recipesite.model.Category;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

// recipesite
// com.zzheads.recipesite.dao created by zzheads on 27.08.2016.
//
public interface CategoryDao extends CrudRepository<Category, Long> {
    List<Category> findAll();
    Category findByName(String name);
}
