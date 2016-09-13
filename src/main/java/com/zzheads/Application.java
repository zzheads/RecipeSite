package com.zzheads;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

// DONE:		Create model classes, DAO interfaces, services, and add unit tests to components. Determine test coverage using a code coverage tool and ensure your tests cover of at least 60% of your code.
// DONE:		Using the supplied files, create the template for the recipe list page. Use the following requirements list to ensure all functionality is included in the recipe list page.
// DONE:		Recipes
// DONE:		Displays a list of recipes by name and indicates with a heart icon whether a user has favorited the recipe
// DONE:		Allows the user to filter the list by the selected category
// DONE:		Allows the user to add a new recipe
// DONE:		A user must have an account
// DONE:		Allows the user to edit or delete a recipe
// DONE:		A user must own the recipe
// DONE:		Using the supplied files, create the template for the recipe detail page. Use the following requirements list to ensure all functionality is included in the recipe detail page.
// DONE:		Recipe Detail
// DONE:		Allows a user to add a recipe, or edit the recipe if they are the owner
// DONE:		Allows a user to provide a recipe name, description, category (from a list of values), prep time, and cook time
// DONE:		Allows a user to provide a list of ingredients
// DONE:		Each ingredient includes an item, condition, and quantity
// DONE:		Allows a user to provide a list of steps
// DONE:		Each step includes a description
// DONE:		Any user can add the recipe to their favorites
// DONE:		The recipe list page should have a search feature. A user can enter a search term and the recipe list will display results that have the search phrase in the description.
// DONE:		Enable user authentication with Spring Security. Use the supplied files to create templates for login page, registration page, and profile page. You must built the registration component, as it does not come with Spring Security. Create necessary controllers, services, and DAO to add a new user. Make sure to include validation so that a user may not use a username that already exists. Check out links in external resources if you get stuck.
// DONE			Create REST endpoints for CRUD operations.
// DONE:		Ensure data is persisted using Hibernate and any database provider of your choice.

// DONE:		Add the ability to search by ingredient. Enable a user to choose to search by ingredient or description by providing a dropdown box next to the search input
// DONE:		Use roles to identify administrators and enable administrators to edit any recipe Enable a user to upload a picture to the recipe detail
// DONE:		Add recipe owner username to the recipe detail page that is linked to the owner's profile page.


@EnableAutoConfiguration
@ComponentScan(basePackages = "com.zzheads.recipesite")
public class Application {
	static {
		System.setProperty("properties.home", "properties/");
	}
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
