package com.zzheads.recipesite.service;//

import com.zzheads.recipesite.dao.CategoryDao;
import com.zzheads.recipesite.dao.RecipeDao;
import com.zzheads.recipesite.dao.UserDao;
import com.zzheads.recipesite.model.Category;
import com.zzheads.recipesite.model.Recipe;
import com.zzheads.recipesite.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

// RecipeSite
// com.zzheads.RecipeSite.service created by zzheads on 26.08.2016.
//
@Service
public class RecipeServiceImpl implements RecipeService {
    private final RecipeDao recipeDao;
    private final CategoryDao categoryDao;
    private final UserDao userDao;

    @Autowired
    public RecipeServiceImpl(CategoryDao categoryDao, RecipeDao recipeDao, UserDao userDao) {
        this.categoryDao = categoryDao;
        this.recipeDao = recipeDao;
        this.userDao = userDao;
    }

    @Override
    public List<Recipe> findAll() {
        return recipeDao.findAll();
    }

    @Override
    public Recipe findById(Long recipeId) {
        return recipeDao.findById(recipeId);
    }

    @Override
    public void delete(Long id) {
        delete(recipeDao.findById(id));
    }

    @Override
    public void delete(Recipe recipe) {
        recipeDao.delete(recipe);
    }

    @Override
    public void save(Recipe recipe) {
        recipeDao.save(recipe);
    }

    @Override
    public List<Recipe> findAll(User currentUser) {
        List<Recipe> result = new ArrayList<>();
        for (Recipe recipe : findAll()) {
            if (recipe.getUser()!=null && recipe.getUser().equals(currentUser))
                result.add(recipe);
        }
        return result;
        //return findAll().stream().filter(recipe -> Objects.equals(recipe.getUser().getId(), currentUser.getId())).collect(Collectors.toList());
    }

    @Override
    public List<Recipe> findByCategory(Category category) {
        return findAll().stream().filter(recipe -> recipe.getCategory() != null && Objects.equals(recipe.getCategory().getId(), category.getId())).collect(Collectors.toList());
    }

    @Override
    public void addToCategory(Recipe recipe, Category category) {
        if (recipe.getCategory() != null && recipe.getCategory().getRecipes().contains(recipe)) {
            recipe.getCategory().removeRecipe(recipe);
            categoryDao.save(recipe.getCategory());
        }
        recipe.setCategory(category);
        if (!category.getRecipes().contains(recipe)) {
            category.addRecipe(recipe);
            categoryDao.save(category);
        }
        recipeDao.save(recipe);
    }

    @Override
    public List<Recipe> findByPattern(String pattern, String method) {
        String finalPattern = pattern.toLowerCase();
        if (method.toLowerCase().contains("description")) {
            List<Recipe> recipes = findAll();
            List<Recipe> result = new ArrayList<>();
            for (Recipe recipe : recipes) {
                if (recipe.getDescription()!=null && recipe.getDescription().toLowerCase().contains(finalPattern)) {
                    result.add(recipe);
                 }
            }
            return result;
        }

        if (method.toLowerCase().contains("ingredient")) {
            List<Recipe> recipes = findAll();
            List<Recipe> result = new ArrayList<>();
            for (Recipe recipe : recipes) {
                for (String ingredient : recipe.getIngredients()) {
                    if (ingredient!=null && ingredient.toLowerCase().contains(finalPattern)) {
                        result.add(recipe);
                        break;
                    }
                }
            }
            return result;
        }
        return null;
    }

    @Override
    public List<Boolean> getRecipesFavorites(List<Recipe> recipes, User loggedUser) {
        if (recipes == null) return null;
        List<Boolean> result = new ArrayList<>();
        for (Recipe recipe : recipes) {
            result.add(recipe.isFavorite(loggedUser));
        }
        return result;
    }
}
