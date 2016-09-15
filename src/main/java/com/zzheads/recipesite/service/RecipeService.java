package com.zzheads.recipesite.service;//

import com.zzheads.recipesite.model.Category;
import com.zzheads.recipesite.model.Recipe;
import com.zzheads.recipesite.model.User;

import java.util.List;

// RecipeSite
// com.zzheads.RecipeSite.service created by zzheads on 26.08.2016.
//
public interface RecipeService {
    List<Recipe> findAll();
    Recipe findById(Long recipeId);
    void delete(Long id);
    void delete(Recipe recipe);
    Long save(Recipe recipe);
    List<Recipe> findAll(User currentUser);
    void addToCategory (Recipe recipe, Category category);
    List<Recipe> findByCategory(Category category);
    List<Boolean> getRecipesFavorites(List<Recipe> recipes, User loggedUser);
    List<Recipe> findByPattern(String pattern, String method);
}
