package com.zzheads.recipesite.web.controller;//

import com.zzheads.recipesite.model.*;
import com.zzheads.recipesite.service.*;
import com.zzheads.recipesite.service.CategoryService;
import com.zzheads.recipesite.service.IngredientService;
import com.zzheads.recipesite.service.RecipeService;
import com.zzheads.recipesite.service.UserService;
import com.zzheads.recipesite.web.FlashMessage;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;


// RecipeSite
// com.zzheads.RecipeSite.web.controller created by zzheads on 26.08.2016.
//
@Controller
public class RecipeController {
    private final RecipeService recipeService;
    private final CategoryService categoryService;
    private final IngredientService ingredientService;
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public RecipeController(CategoryService categoryService, IngredientService ingredientService, RecipeService recipeService, UserService userService, RoleService roleService) {
        this.categoryService = categoryService;
        this.ingredientService = ingredientService;
        this.recipeService = recipeService;
        this.userService = userService;
        this.roleService = roleService;
    }

    // Add logged in user in model for each controller method
    @ModelAttribute("user")
    public static User getLoggedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
    @ModelAttribute("allCategories")
    public List<Category> getAllCategories() {
        if (categoryService.findAll().size() == 0) {
            Category category = new Category("Unassigned");
            categoryService.save(category);
        }
        return categoryService.findAll();
    }
    @ModelAttribute("allIngredients")
    public List<String> getAllIngredients() {
        return ingredientService.findAll();
    }

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public String listAllRecipes(Model model) {
        List<Recipe> recipes = recipeService.findAll();
        if (!model.containsAttribute("recipes")) model.addAttribute("recipes", recipes);
        if (!model.containsAttribute("recipesFavorites")) model.addAttribute("recipesFavorites", recipeService.getRecipesFavorites(recipes, getLoggedUser()));
        if (!model.containsAttribute("pattern")) model.addAttribute("pattern", "");
        if (!model.containsAttribute("method")) model.addAttribute("method", "in Description");
        if (!model.containsAttribute("selectedCategory")) model.addAttribute("selectedCategory", categoryService.findByName("Unassigned"));
        return "index";
    }

    @RequestMapping(path = "/detail/{id}", method = RequestMethod.GET)
    public String detailsOfRecipe(Model model, @PathVariable Long id, HttpServletRequest request) {
        Recipe recipe = recipeService.findById(id);
        String urlFrom = request.getHeader("referer");
        if (urlFrom.contains("profile")) model.addAttribute("userDetails", true);
        model.addAttribute("recipe", recipe);
        model.addAttribute("recipeFavorite", recipe.isFavorite(getLoggedUser()));
        return "detail";
    }

    @RequestMapping(path = "/delete/{id}", method = RequestMethod.GET)
    public String deleteRecipe(@PathVariable Long id, RedirectAttributes attributes) {
        Recipe recipe = recipeService.findById(id);
        if (!getLoggedUser().getAuthorities().contains("ROLE_ADMIN") && !recipe.getUser().equals(getLoggedUser())) {
            attributes.addFlashAttribute("flash", new FlashMessage(String.format("You can not delete this recipe, only owner (%s) can do it. Access denied.", recipe.getUser().getUsername()), FlashMessage.Status.FAILURE));
        } else {
            if (recipe.getCategory()!=null) {
                recipe.getCategory().removeRecipe(recipe);
                categoryService.save(recipe.getCategory());
            }
            recipeService.delete(id);
            attributes.addFlashAttribute("flash", new FlashMessage("Recipe deleted.", FlashMessage.Status.SUCCESS));
        }
        return "redirect:/";
    }

    @RequestMapping(path = "/add", method = RequestMethod.GET)
    public String addNewRecipe(Model model) {
        Recipe recipe = new Recipe();
        recipe.setUser(getLoggedUser());
        recipeService.save(recipe);
        recipeService.addToCategory(recipe, categoryService.findByName("Unassigned"));
        model.addAttribute("recipe", recipe);
        model.addAttribute("recipeFavorite", false);
        return "edit";
    }

    @RequestMapping(path = "/edit/{id}", method = RequestMethod.GET)
    public String editRecipe(Model model, @PathVariable Long id, RedirectAttributes attributes) {
        Recipe recipe = recipeService.findById(id);
        if (!getLoggedUser().getAuthorities().contains("ROLE_ADMIN") && !recipe.getUser().equals(getLoggedUser())) {
            attributes.addFlashAttribute("flash", new FlashMessage(String.format("You can not edit this recipe, only owner (%s) can do it. Access denied.", recipe.getUser().getUsername()), FlashMessage.Status.FAILURE));
            return "redirect:/";
        }

        if (!model.containsAttribute("recipe")) {
            recipe = recipeService.findById(id);
            if (recipe.getCategory() == null)
                recipe.setCategory(categoryService.findByName("Unassigned"));
            model.addAttribute("recipe", recipe);
            model.addAttribute("recipeFavorite", recipe.isFavorite(getLoggedUser()));
        }
        return "edit";
    }

    @RequestMapping(path = "/save/{id}", method = RequestMethod.POST)
    public String saveRecipe(@ModelAttribute @Valid Recipe recipe, BindingResult result, @PathVariable Long id, RedirectAttributes attributes) {

        recipe.setUser(getLoggedUser());
        if (recipe.getCategory() != null)
            recipe.setCategory(categoryService.findById(recipe.getCategory().getId()));
        recipe.setFavoriteUsers(recipeService.findById(recipe.getId()).getFavoriteUsers());
        recipe.setPhoto(recipeService.findById(recipe.getId()).getPhoto());

        if (result.hasErrors()) {
            for (ObjectError o : result.getAllErrors())
                attributes.addFlashAttribute("flash",new FlashMessage(o.toString(), FlashMessage.Status.FAILURE));
            attributes.addFlashAttribute("recipe", recipe);
            attributes.addFlashAttribute("recipeFavorite", recipe.isFavorite(getLoggedUser()));
            return "redirect:/edit/"+id;
        }

        recipeService.save(recipe);
        attributes.addFlashAttribute("flash", new FlashMessage("Recipe saved.", FlashMessage.Status.SUCCESS));
        return "redirect:/";
    }

}
