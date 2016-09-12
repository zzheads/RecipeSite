package com.zzheads.recipesite.web.controller;

import com.zzheads.recipesite.model.Recipe;
import com.zzheads.recipesite.model.User;
import com.zzheads.recipesite.service.RecipeService;
import com.zzheads.recipesite.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

import static com.zzheads.recipesite.web.controller.RecipeController.getLoggedUser;

@Controller
public class LoginController {
    private final RecipeService recipeService;
    private final UserService userService;

    @Autowired
    public LoginController(RecipeService recipeService, UserService userService) {
        this.recipeService = recipeService;
        this.userService = userService;
    }

    @RequestMapping(path = "/admin", method = RequestMethod.GET)
    public String adminPanel(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("user", getLoggedUser());
        model.addAttribute("users", users);
        return "admin";
    }

    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public String loginForm(Model model, HttpServletRequest request) {
        model.addAttribute("user", new User());
        try {
            Object flash = request.getSession().getAttribute("flash");
            model.addAttribute("flash", flash);

            request.getSession().removeAttribute("flash");
        } catch (Exception ex) {
            // "flash" session attribute must not exist...do nothing and proceed normally
        }
        return "login";
    }

    @RequestMapping(value="/logout", method = RequestMethod.GET)
    public String logoutPage (HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "redirect:/login"; //You can redirect wherever you want, but generally it's a good practice to show login screen again.
    }

    @RequestMapping(value="/profile", method = RequestMethod.GET)
    public String profileUser (Model model, RedirectAttributes attributes) {
        List<Recipe> recipes = recipeService.findAll();
        model.addAttribute("recipes", recipes);
        model.addAttribute("recipesFavorites", recipeService.getRecipesFavorites(recipes, getLoggedUser()));
        model.addAttribute("user", getLoggedUser());
        return "profile";
    }

    @RequestMapping(value="/signup", method = RequestMethod.GET)
    public String signupUser (Model model) {
        User user = new User();
        model.addAttribute("user", user);
        model.addAttribute("allUsers", userService.findAll());
        return "signup";
    }

    @RequestMapping("/access_denied")
    public String accessDenied() {
        return "access_denied";
    }
}
