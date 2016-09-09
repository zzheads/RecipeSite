package com.zzheads.recipesite.web.api;

import com.zzheads.recipesite.model.Category;
import com.zzheads.recipesite.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by alexeypapin on 04.09.16.
 */
@Controller
public class CategoryApi {
    @SuppressWarnings({"SpringAutowiredFieldsWarningInspection", "SpringJavaAutowiredMembersInspection"})
    @Autowired
    private CategoryService categoryService;

    @RequestMapping(value = "/category", method = RequestMethod.POST, produces = {"application/json"})
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody
    String addCategory(@RequestBody String jsonString) {
        Category category = Category.fromJson(jsonString);
        categoryService.save(category);
        return category.toJson();
    }

    @RequestMapping(value = "/category", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String getAllCategories() {
        List<Category> categories = categoryService.findAll();
        return Category.toJson(categories);
    }

    @RequestMapping(value = "/category/{id}", method = RequestMethod.PUT, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String updateCategory(@RequestBody String jsonString, @PathVariable Long id) {
        Category updatingCategory = Category.fromJson(jsonString);
        Category category = categoryService.findById(id);
        category.setProperties(updatingCategory);
        categoryService.save(category);
        return category.toJson();
    }

    @RequestMapping(value = "/category/{id}", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseStatus (HttpStatus.OK)
    public @ResponseBody String getCategoryById(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return category.toJson();
    }

    @RequestMapping(value = "/category/{id}", method = RequestMethod.DELETE, produces = {"application/json"})
    @ResponseStatus (HttpStatus.NO_CONTENT)
    public void deleteCategoryById(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        categoryService.delete(category);
    }

}
