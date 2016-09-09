package com.zzheads.recipesite.service;//

import com.zzheads.recipesite.dao.RecipeDao;
import com.zzheads.recipesite.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// recipesite
// com.zzheads.recipesite.service created by zzheads on 27.08.2016.
//
@Service
public class IngredientServiceImpl implements IngredientService {
    private final RecipeDao recipeDao;

    @Autowired
    public IngredientServiceImpl(RecipeDao recipeDao) {
        this.recipeDao = recipeDao;
    }

    @Override
    public List<String> findAll() {
        List<Recipe> recipes = recipeDao.findAll();
        Set<String> ingredients = new HashSet<>();
        for (Recipe r : recipes) {
            if (r.getIngredients() != null) {
                for (String s : r.getIngredients()) {
                    ingredients.add(s);
                }
            }
        }
        return ingredients.stream().collect(Collectors.toList());
    }
}
