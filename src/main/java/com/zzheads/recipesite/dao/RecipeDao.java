package com.zzheads.recipesite.dao;//

import com.zzheads.recipesite.model.Recipe;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// RecipeSite
// com.zzheads.RecipeSite.dao created by zzheads on 26.08.2016.
//
@Repository
public interface RecipeDao extends CrudRepository<Recipe, Long> {
    Recipe findById(Long recipeId);
    List<Recipe> findAll();
    void delete(Recipe recipe);
    void delete(Long id);
}
