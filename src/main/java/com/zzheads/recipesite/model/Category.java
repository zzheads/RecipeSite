package com.zzheads.recipesite.model;//

import com.google.gson.*;
import org.hibernate.annotations.*;
import org.hibernate.annotations.CascadeType;

import javax.persistence.*;
import javax.persistence.Entity;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

// RecipeSite
// com.zzheads.RecipeSite.model created by zzheads on 25.08.2016.
//
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Cascade(CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "category")
    private List<Recipe> recipes = new ArrayList<>();

    public Category() {}

    public Category(String name) {
        this.name = name;
    }

    public Category(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Recipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(List<Recipe> recipes) {
        this.recipes = recipes;
    }

    public void addRecipe (Recipe recipe) {
        if (this.recipes==null) this.recipes = new ArrayList<>();
        this.recipes.add(recipe);
    }

    public void removeRecipe (Recipe recipe) {
        for (int i=0;i<recipes.size();i++) {
            if (Objects.equals(recipes.get(i).getId(), recipe.getId())) {
                recipes.remove(i);
            }
        }
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Category)) return false;
        Category category = (Category) o;
        return getId() != null ? getId().equals(category.getId()) : category.getId() == null && getName().equals(category.getName());
    }

    @Override
    public String toString() {
        return name;
    }

    public void setProperties(Category updatingCategory) {
        this.name = updatingCategory.getName();
        this.recipes = updatingCategory.getRecipes();
    }

    private static class CategorySerializer implements JsonSerializer<Category> {
        @Override
        public JsonElement serialize(Category src, java.lang.reflect.Type typeOfSrc, JsonSerializationContext context) {
            return jsonObject(src);
        }
    }

    private static class ListCategorySerializer implements JsonSerializer<List<Category>> {
        @Override
        public JsonElement serialize(List<Category> src, java.lang.reflect.Type typeOfSrc, JsonSerializationContext context) {
            if (src!=null && src.size()>0) {
                JsonArray result = new JsonArray();
                for (Category category : src) {
                    result.add(jsonObject(category));
                }
                return result;
            }
            return null;
        }
    }

    private static class CategoryDeserializer implements JsonDeserializer<Category> {
        @Override
        public Category deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            JsonObject jsonObject = json.getAsJsonObject();
            Category result;
            String name = jsonObject.get("name").getAsString();
            if (jsonObject.get("id") != null) {
                Long id = jsonObject.get("id").getAsLong();
                result = new Category(id, name);
            } else {
                result = new Category(name);
            }
            if (jsonObject.get("recipes")!=null) {
                JsonArray jsonRecipes = jsonObject.get("recipes").getAsJsonArray();
                for (JsonElement j : jsonRecipes) {
                    Long recipeId = j.getAsJsonObject().get("id").getAsLong();
                    String recipeName = j.getAsJsonObject().get("name").getAsString();
                    Recipe recipe = new Recipe(recipeId, recipeName);
                    result.addRecipe(recipe);
                }
            }
            return result;
        }
    }

    private static JsonObject jsonObject (Category src) {
        JsonObject result = new JsonObject();
        result.addProperty("id", String.valueOf(src.getId()));
        result.addProperty("name", String.valueOf(src.getName()));
        if (src.getRecipes()!=null && src.getRecipes().size()>0) {
            JsonArray jsonRecipes = new JsonArray();
            for (Recipe r : src.getRecipes()) {
                JsonObject jsonRecipe = new JsonObject();
                jsonRecipe.addProperty("id", r.getId());
                jsonRecipe.addProperty("name", r.getName());
                jsonRecipes.add(jsonRecipe);
            }
            result.add("recipes", jsonRecipes);
        }
        return result;
    }

    public String toJson() {
        Gson gson = new GsonBuilder().registerTypeAdapter(Category.class, new CategorySerializer()).setPrettyPrinting().create();
        return gson.toJson(this, Category.class);
    }

    public static Category fromJson(String jsonString) {
        Gson gson = new GsonBuilder().registerTypeAdapter(Category.class, new CategoryDeserializer()).setPrettyPrinting().create();
        return gson.fromJson(jsonString, Category.class);
    }

    public static String toJson(List<Category> categories) {
        Gson gson = new GsonBuilder().registerTypeAdapter(List.class, new ListCategorySerializer()).setPrettyPrinting().create();
        return gson.toJson(categories, List.class);
    }
}
