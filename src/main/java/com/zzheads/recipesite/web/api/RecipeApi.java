package com.zzheads.recipesite.web.api;

import com.zzheads.recipesite.model.Recipe;
import com.zzheads.recipesite.model.User;
import com.zzheads.recipesite.service.CategoryService;
import com.zzheads.recipesite.service.RecipeService;
import com.zzheads.recipesite.service.UserService;
import com.zzheads.recipesite.utils.HexEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;


/**
 * Created by alexeypapin on 04.09.16.
 */

@Controller
public class RecipeApi {
    private final RecipeService recipeService;
    private final CategoryService categoryService;
    private final UserService userService;

    @Autowired
    public RecipeApi(RecipeService recipeService, CategoryService categoryService, UserService userService) {
        this.recipeService = recipeService;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    public User getLoggedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public String getCurrentUsername () {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return username;
    }

    @RequestMapping(value = "/recipe", method = RequestMethod.POST, produces = {"application/json"})
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody
    String addRecipe(@RequestBody String jsonString) {
        Recipe recipe = Recipe.fromJson(jsonString);
        recipe.setUser(getLoggedUser());
        if (recipe.getCategory() != null)
            recipe.setCategory(categoryService.findByName(recipe.getCategory().getName()));
        recipe.setFavoriteUsers(recipeService.findById(recipe.getId()).getFavoriteUsers());
        recipe.setPhoto(recipeService.findById(recipe.getId()).getPhoto());

        recipeService.save(recipe);
        return recipe.toJson();
    }

    @RequestMapping(value = "/recipe", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String getAllRecipes() {
        List<Recipe> recipes = recipeService.findAll();
        return Recipe.toJson(recipes);
    }

    @RequestMapping(value = "/recipe_bycategory/{id}", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String getRecipesByCategory(@PathVariable Long id) {
        List<Recipe> recipes;
        if (categoryService.findById(id).getName().equals("Unassigned"))
            recipes = recipeService.findAll();
        else
            recipes = recipeService.findByCategory(categoryService.findById(id));
        return Recipe.toJson(recipes);
    }

    @RequestMapping(value = "/recipe_bypattern/{pattern}.{method}", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String getRecipesByFirstLettersInSearch(@PathVariable String pattern, @PathVariable String method) {
        List<Recipe> recipes = recipeService.findByPattern(pattern, method);
        return Recipe.toJson(recipes);
    }

    @RequestMapping(value = "/recipe/{id}", method = RequestMethod.PUT, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String updateRecipe(@RequestBody String jsonString, @PathVariable Long id) {
        Recipe updatingRecipe = Recipe.fromJson(jsonString);
        Recipe recipe = recipeService.findById(id);
        recipe.setProperties(updatingRecipe);
        recipeService.save(recipe);
        return recipe.toJson();
    }

    @RequestMapping(value = "/recipe_addingredient/{id}", method = RequestMethod.POST, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String addIngredientToRecipe(@RequestBody String jsonString, @PathVariable Long id) {
        HexEncoder encoded = new HexEncoder(jsonString);
        Recipe updatingRecipe = Recipe.fromJson(encoded.getDecoded());
        updatingRecipe.setCategory(categoryService.findByName(updatingRecipe.getCategory().getName()));
        Recipe recipe = recipeService.findById(id);
        recipe.setProperties(updatingRecipe);
        recipe.addIngredient("", "", 0);
        recipeService.save(recipe);
        return recipe.toJson();
    }

    @RequestMapping(value = "/recipe_addstep/{id}", method = RequestMethod.POST, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String addStepToRecipe(@RequestBody String jsonString, @PathVariable Long id) {
        HexEncoder encoded = new HexEncoder(jsonString);
        Recipe updatingRecipe = Recipe.fromJson(encoded.getDecoded());
        updatingRecipe.setCategory(categoryService.findByName(updatingRecipe.getCategory().getName()));
        Recipe recipe = recipeService.findById(id);
        recipe.setProperties(updatingRecipe);
        recipe.addStep("");
        recipeService.save(recipe);
        return recipe.toJson();
    }

    @RequestMapping(value = "/recipe/{id}", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String getRecipeById(@PathVariable Long id) {
        Recipe recipe = recipeService.findById(id);
        return recipe.toJson();
    }

    @RequestMapping(value = "/recipe/{id}", method = RequestMethod.DELETE, produces = {"application/json"})
    @ResponseStatus (HttpStatus.NO_CONTENT)
    public void deleteRecipeById(@PathVariable Long id, RedirectAttributes attributes) {
        Recipe recipe = recipeService.findById(id);

        if (recipe.getCategory() != null) {
            recipe.getCategory().removeRecipe(recipe);
            categoryService.save(recipe.getCategory());
        }
        recipeService.delete(recipe);
    }

    @RequestMapping(value = "/togglefavorite/{id}", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String toggleFavorite(@PathVariable Long id) {
        Recipe recipe = recipeService.findById(id);
        if (recipe.isFavorite(getLoggedUser())) {
            getLoggedUser().removeFavorite(recipe);
            recipe.removeFavorite(getLoggedUser());
        } else {
            getLoggedUser().addFavorite(recipe);
            recipe.addFavorite(getLoggedUser());
        }
        recipeService.save(recipe);
        userService.save(getLoggedUser());
        return recipe.toJson();
    }


}
