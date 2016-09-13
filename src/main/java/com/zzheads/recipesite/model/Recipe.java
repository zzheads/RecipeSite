package com.zzheads.recipesite.model;//

import com.google.gson.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.lang.reflect.Type;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

// RecipeSite
// com.zzheads.RecipeSite.model created by zzheads on 25.08.2016.
//
@Entity
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] photo;

    //@Size (min=3, max=100, message = "size of field Name must be between 3 and 100")
    private String name;

    private String description;

    @ManyToOne
    private Category category;

    @Temporal(TemporalType.TIME)
    @DateTimeFormat(pattern = "HH:mm:ss")
    private Date prepTime;

    @Temporal(TemporalType.TIME)
    @DateTimeFormat(pattern = "HH:mm:ss")
    private Date cookTime;

    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(CascadeType.ALL)
    private List<String> ingredients = new ArrayList<>();

    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(CascadeType.ALL)
    private List<String> conditions = new ArrayList<>();

    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(CascadeType.ALL)
    private List<Integer> quantities = new ArrayList<>();

    @ElementCollection
    @LazyCollection(LazyCollectionOption.FALSE)
    @Cascade(CascadeType.ALL)
    private List<String> steps = new ArrayList<>();

    @LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany
    private List<User> favoriteUsers;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Recipe() {}

    public Recipe(String name) {
        this.name = name;
    }

    public Recipe(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Recipe(String name, String description, Category category, Date prepTime, Date cookTime, List<String> ingredients, List<String> conditions, List<Integer> quantities) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.ingredients = ingredients;
        this.conditions = conditions;
        this.quantities = quantities;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Date getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(Date prepTime) {
        this.prepTime = prepTime;
    }

    public void setPrepTime(Long dateAsLong) {
        this.prepTime = new Date(dateAsLong);
    }

    public Date getCookTime() {
        return cookTime;
    }

    public void setCookTime(Date cookTime) {
        this.cookTime = cookTime;
    }

    public void setCookTime(Long dateAsLong) {
        this.cookTime = new Date(dateAsLong);
    }

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

    public List<String> getConditions() {
        return conditions;
    }

    public void setConditions(List<String> conditions) {
        this.conditions = conditions;
    }

    public List<Integer> getQuantities() {
        return quantities;
    }

    public void setQuantities(List<Integer> quantities) {
        this.quantities = quantities;
    }

    public List<String> getSteps() {
        return steps;
    }

    public void setSteps(List<String> steps) {
        this.steps = steps;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<User> getFavoriteUsers() {
        return favoriteUsers;
    }

    public void setFavoriteUsers(List<User> favoriteUsers) {
        this.favoriteUsers = favoriteUsers;
    }

    public void addFavorite (User user) {
        if (favoriteUsers == null)
            favoriteUsers = new ArrayList<>();
        if (!favoriteUsers.contains(user))
            favoriteUsers.add(user);
    }

    public void removeFavorite (User user) {
        if (favoriteUsers != null && favoriteUsers.contains(user)) favoriteUsers.remove(user);
    }

    public boolean isFavorite (User user) {
        if (favoriteUsers == null) return false;
        return (favoriteUsers.contains(user));
    }

    public void addIngredient (String ingredient, String condition, Integer quantity) {
        if (ingredients==null) ingredients = new ArrayList<>();
        if (conditions==null) conditions = new ArrayList<>();
        if (quantities==null) quantities = new ArrayList<>();
        ingredients.add(ingredient);
        conditions.add(condition);
        quantities.add(quantity);
    }

    public boolean removeIngredient (String ingredient) {
        if (ingredients!=null && ingredients.contains(ingredient)) {
            int index = ingredients.indexOf(ingredient);
            ingredients.remove(index);
            conditions.remove(index);
            quantities.remove(index);
            return true;
        }
        return false;
    }

    public void addStep (String step) {
        if (steps==null) steps = new ArrayList<>();
        steps.add(step);
    }

    public boolean removeStep (String step) {
        if (steps!=null && steps.contains(step)) {
            steps.remove(steps.indexOf(step));
            return true;
        }
        return false;
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Recipe)) return false;
        Recipe recipe = (Recipe) o;
        return getId() != null ?
            getId().equals(recipe.getId()) :
            recipe.getId() == null && getName().equals(recipe.getName()) && (
                getDescription() != null ?
                    getDescription().equals(recipe.getDescription()) :
                    recipe.getDescription() == null && (getCategory() != null ?
                        getCategory().equals(recipe.getCategory()) :
                        recipe.getCategory() == null && (getPrepTime() != null ?
                            getPrepTime().equals(recipe.getPrepTime()) :
                            recipe.getPrepTime() == null && (getCookTime() != null ?
                                getCookTime().equals(recipe.getCookTime()) :
                                recipe.getCookTime() == null && (getIngredients() != null ?
                                    getIngredients().equals(recipe.getIngredients()) :
                                    recipe.getIngredients() == null && (getSteps() != null ?
                                        getSteps().equals(recipe.getSteps()) :
                                        recipe.getSteps() == null))))));

   }

   public static String dateToString(Date date) {
       DateFormat df = new SimpleDateFormat("HH:mm:ss");
       return df.format(date);
   }

   public static Date stringToDate (String string) throws ParseException {
       DateFormat format = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
       return format.parse(string);
   }

    public void setProperties(Recipe updatingRecipe) {
        this.name = updatingRecipe.getName();
        this.description = updatingRecipe.getDescription();
        this.photo = updatingRecipe.getPhoto();
        this.category = updatingRecipe.getCategory();
        this.favoriteUsers = updatingRecipe.getFavoriteUsers();
        this.ingredients = updatingRecipe.getIngredients();
        this.conditions = updatingRecipe.getConditions();
        this.quantities = updatingRecipe.getQuantities();
        this.steps = updatingRecipe.getSteps();
        this.prepTime = updatingRecipe.getPrepTime();
        this.cookTime = updatingRecipe.getCookTime();
    }

    private static class RecipeSerializer implements JsonSerializer<Recipe> {
        @Override
        public JsonElement serialize(Recipe src, java.lang.reflect.Type typeOfSrc, JsonSerializationContext context) {
            JsonObject result = new JsonObject();
            result.addProperty("id", src.getId());
            result.addProperty("photo", Arrays.toString(src.getPhoto()));
            result.addProperty("name", src.getName());
            result.addProperty("description", src.getDescription());
            if (src.getFavoriteUsers()!=null && src.getFavoriteUsers().size()>0) {
                JsonArray jsonFavUsers = new JsonArray();
                for (int i=0;i<src.getFavoriteUsers().size();i++) {
                    if (src.getFavoriteUsers().get(i) != null) {
                        JsonObject jsonFavUser = new JsonObject();
                        jsonFavUser.addProperty("id", src.getFavoriteUsers().get(i).getId());
                        jsonFavUser.addProperty("username", src.getFavoriteUsers().get(i).getUsername());
                        jsonFavUsers.add(jsonFavUser);
                    }
                }
                result.add("favoriteUsers", jsonFavUsers);
            }
            if (src.getCategory()!=null) {
                JsonObject jsonCategory = new JsonObject();
                jsonCategory.addProperty("id", src.getCategory().getId());
                jsonCategory.addProperty("name", src.getCategory().getName());
                result.add("category", jsonCategory);
            }
            if (src.getPrepTime()!=null) result.addProperty("prepTime", dateToString(src.getPrepTime()));
            if (src.getCookTime()!=null) result.addProperty("cookTime", dateToString(src.getCookTime()));
            if (src.getUser()!=null) {
                JsonObject jsonUser = new JsonObject();
                jsonUser.addProperty("id", src.getUser().getId());
                jsonUser.addProperty("username", src.getUser().getUsername());
                result.add("user", jsonUser);
            }
            if (src.getIngredients()!=null && src.getIngredients().size()>0) {
                JsonArray jsonIngredients = new JsonArray();
                for (int i=0; i<src.getIngredients().size(); i++) {
                    JsonObject jsonIngredient = new JsonObject();
                    jsonIngredient.addProperty("ingredient", src.getIngredients().get(i));
                    jsonIngredient.addProperty("condition", src.getConditions().get(i));
                    jsonIngredient.addProperty("quantity", src.getQuantities().get(i));
                    jsonIngredients.add(jsonIngredient);
                }
                result.add("ingredients", jsonIngredients);
            }
            if (src.getSteps()!=null && src.getSteps().size()>0) {
                JsonArray jsonSteps = new JsonArray();
                for (String s : src.getSteps()) {
                    JsonPrimitive jsonStep = new JsonPrimitive(s);
                    jsonSteps.add(jsonStep);
                }
                result.add("steps", jsonSteps);
            }
            return result;
        }
    }

    private static class ListRecipeSerializer implements JsonSerializer<List<Recipe>> {
        @Override
        public JsonElement serialize(List<Recipe> src, Type typeOfSrc, JsonSerializationContext context) {
            RecipeSerializer recipeSerializer = new RecipeSerializer();
            if (src!=null && src.size()>0) {
                JsonArray result = new JsonArray();
                for (Recipe recipe : src) {
                    result.add(recipeSerializer.serialize(recipe, Recipe.class, context));
                }
                return result;
            }
            return null;
        }
    }

    private static class RecipeDeserializer implements JsonDeserializer<Recipe> {
        @Override
        public Recipe deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
            JsonObject object = json.getAsJsonObject();
            Recipe result = new Recipe();
            if (object.get("id") != null) result.setId(object.get("id").getAsLong());
            if (object.get("photo") != null) result.setPhoto(object.get("photo").getAsString().getBytes());
            if (object.get("name") != null) result.setName(object.get("name").getAsString());
            if (object.get("description") != null) result.setDescription(object.get("description").getAsString());
            if (object.get("favoriteUsers") != null) {
                JsonArray jsonFavUsers = object.get("favoriteUsers").getAsJsonArray();
                for (JsonElement je : jsonFavUsers) {
                    result.addFavorite(new User(je.getAsJsonObject().get("username").getAsString()));
                }
            }
            if (object.get("category") != null) {
                JsonObject jc = object.get("category").getAsJsonObject();
                result.setCategory(new Category(jc.get("id").getAsLong(), jc.get("name").getAsString()));
            }
            try {
                result.setPrepTime(stringToDate(object.get("prepTime").getAsString()));
                result.setCookTime(stringToDate(object.get("cookTime").getAsString()));
            } catch (Exception ignored) {

            }
            if (object.get("user") != null) {
                JsonObject ju = object.get("user").getAsJsonObject();
                result.setUser(new User(ju.get("username").getAsString()));
            }

            if (object.get("ingredients")!=null) {
                JsonArray ingredients = object.get("ingredients").getAsJsonArray();
                for (int i=0; i<ingredients.size(); i++) {
                    String ingredient = ingredients.get(i).getAsJsonObject().get("ingredient").getAsString();
                    String condition = ingredients.get(i).getAsJsonObject().get("condition").getAsString();
                    int quantity = ingredients.get(i).getAsJsonObject().get("quantity").getAsInt();
                    result.addIngredient(ingredient, condition, quantity);
                }
            }

            if (object.get("steps")!=null) {
                JsonArray steps = object.get("steps").getAsJsonArray();
                for (int i=0; i<steps.size(); i++) {
                    String step = steps.get(i).getAsJsonPrimitive().getAsString();
                    result.addStep(step);
                }
            }

            return result;
        }
    }

    public static Recipe fromJson (String jsonString) {
        Gson gson = new GsonBuilder().registerTypeAdapter(Recipe.class, new RecipeDeserializer()).setPrettyPrinting().create();
        return gson.fromJson(jsonString, Recipe.class);
    }

    public String toJson () {
        Gson gson = new GsonBuilder().registerTypeAdapter(Recipe.class, new RecipeSerializer()).setPrettyPrinting().create();
        return gson.toJson(this, Recipe.class);
    }

    public static String toJson(List<Recipe> recipes) {
        Gson gson = new GsonBuilder().registerTypeAdapter(List.class, new ListRecipeSerializer()).setPrettyPrinting().create();
        return gson.toJson(recipes, List.class);
    }

}
