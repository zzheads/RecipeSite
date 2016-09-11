function linkToSelectedCategory () {
    var selectedCategory = document.getElementById("selectCategory").value;
    console.log("Select category changed, starting searching recipes by category with id: " + selectedCategory);
    // Unassigned category means any recipe so redirect to index then
    $.ajax({
        url: "/recipe_bycategory/"+selectedCategory,
        type: "GET",
        dataType: "json",
        success: function (data) {
            printRecipes (data);
            if (getCategoryName(selectedCategory) != "Unassigned") {
                clearFlash();
                printFlashMessage("Listed all recipes of category \"" + getCategoryName(selectedCategory) + "\".", "info");
            } else {
                clearFlash();
                printFlashMessage("Listed all recipes, because you've selected \"Unassign\" category.", "info");
            }
        },
        error: getErrorMsg
    });
}

function linkToPattern () {
    var pattern = document.getElementById("searchRecipe").value;
    var method = document.getElementById("searchMethod").value;
    console.log("Search changed, starting searching recipes by pattern: \"" + pattern + "\"");
    // Empty pattern means any recipe so redirect to index then
    if (pattern != "") {
        $.ajax({
            url: "/recipe_bypattern/" + pattern + "." + method,
            type: "GET",
            dataType: "json",
            success: function (data) {
                printRecipes (data);
                clearFlash();
                printFlashMessage("Listed all recipes contains (" + pattern + ") which searched " + method.toLowerCase() + ".", "info");
            }
        });
    } else {
        $.ajax({
            url: "/recipe",
            type: "GET",
            dataType: "json",
            success: function (data) {
                printRecipes (data);
                clearFlash();
                printFlashMessage("Listed all recipes, because search pattern is empty.", "info");
            }
        });
    }
}

function contain (array, searchFor) {
    if (array == null)
        return false;
    for (i=0;i<array.length;i++) {
        if (array[i] == searchFor)
            return true;
    }
    return false;
}

function printRecipes (data) {
    var htmlString;
    $("#recipesList").children().remove();
    if (data != null) {
        for (i = 0; i < data.length; i++) {
            $("#recipesList").append(printRecipe(data[i]));
        }
    }
}

function printRecipe (recipe) {
    recipe.user = document.getElementById("loggedUser").innerText;
    var
        htmlString = "<div class=\"grid-100 row addHover\">";
    htmlString += "<a href=\"/detail/" + recipe.id +"\">";
    htmlString += "<div class=\"grid-70\">";
    htmlString += "<p>";
    if (contain(recipe.favoriteUsers, recipe.user))
        htmlString += "<span><img src=\"../assets/images/favorited.svg\" height=\"12px\"/></span>";
    else
        htmlString += "<span><img src=\"../assets/images/favorite.svg\" height=\"12px\"/></span>";
    htmlString += " ";
    htmlString += recipe.name;
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</a>";
    htmlString += "<div class=\"hoverBlock\">";
    htmlString += "<div class=\"grid-30\">";
    htmlString += "<div class=\"flush-right\">";
    htmlString += "<p>";
    htmlString += "<a href=\"/edit/" + recipe.id + "\" class=\"button\"><img src=\"../assets/images/edit.svg\" height=\"12px\"/>Edit</a>";
    htmlString += "<a href=\"/delete/" + recipe.id + "\" class=\"button\"><img src=\"../assets/images/delete.svg\" height=\"12px\"/>Delete</a>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</div>";
    htmlString += "</div>";
    htmlString += "</div> <div class=\"clear\">";
    htmlString += "</div>";

    return htmlString;
}

function getCategoryName (categoryId) {
    return document.getElementById("getCategoryNameById"+categoryId).innerText;
}

function deleteRecipe (buttonId) {
    var id = buttonId.split('#').pop();
    console.log("Deleting recipe id="+id);
    var loggedUser = {};
    loggedUser.username = document.getElementById("loggedUser").innerText;
    loggedUser.role = document.getElementById("loggedUserRole").innerText;
    var recipeUser = document.getElementById("recipeUser#"+id).innerText;

    if (loggedUser.role != "ROLE_ADMIN" && loggedUser.username != recipeUser) {
        clearFlash();
        printFlashMessage("You can not delete this recipe, only owner ("+ recipeUser +") can do it. Access denied.","failure");
        return;
    }

    $.ajax({
        url: "/recipe/"+id,
        type: "DELETE",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function () {
            document.getElementById("recipe#"+id).remove();
            clearFlash();
            printFlashMessage("Recipe (id=" + id + ") deleted.", "success");
        },
        error: getErrorMsg
    });
}

function editRecipe (buttonId) {
    var id = buttonId.split('#').pop();
    console.log("Deleting recipe id=" + id);
    var loggedUser = {};
    loggedUser.username = document.getElementById("loggedUser").innerText;
    loggedUser.role = document.getElementById("loggedUserRole").innerText;
    var recipeUser = document.getElementById("recipeUser#" + id).innerText;

    if (loggedUser.role != "ROLE_ADMIN" && loggedUser.username != recipeUser) {
        clearFlash();
        printFlashMessage("You can not edit this recipe, only owner (" + recipeUser + ") can do it. Access denied.", "failure");
        return;
    }

    $.ajax({
        url: "/category/",
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function (data) {
            var allCategories = data;
            $.ajax({
                url: "/recipe/"+id,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
                success: function (data) {
                    $("#root").children().hide();
                    $("#root").append(getEditHtmlString(data, allCategories));
                },
                error: getErrorMsg
            });
        }
    });
}

function getEditHtmlString(recipe, allCategories) {
    var i;
    var htmlString =
        "<div class='recipes'>" +
        "<input type='hidden' id='recipeIdInput' field='" + recipe.id + "' value='" + recipe.id + "'/>";


    for (i = 0; i < recipe.favoriteUsers.length; i++) {
        htmlString += "<div hidden=\"hidden\">";
        htmlString += "<input hidden=\"hidden\" id=\"favUser\"" + i + "\" value=\"" + recipe.favoriteUsers[i].username + "\"/>";
        htmlString += "</div>";
    }

    htmlString += "<p hidden=\"hidden\" id=\"recipeId\" text=\"" + recipe.id + "\"/>";
    htmlString += "<p hidden=\"hidden\" id=\"recipeUserName\" text=\"" + recipe.user.username + "\"/>";
    htmlString += "<div class=\"grid-100 row controls\">";
    htmlString += "<div class=\"grid-50\">";
    htmlString += "<h2> Recipe Editor </h2>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-50\">";
    htmlString += "<div class=\"flush-right\">";
    htmlString += "<button type=\"button\" onclick=\"saveRecipe()\">Save Recipe</button> ";
    htmlString += "<a href=\"/\"><button type=\"button\" class=\"secondary\">Cancel</button></a>";
    htmlString += "</div>";
    htmlString += "</div>";
    htmlString += "</div><div class=\"clear\"></div>";

    htmlString += "<div class=\"grid-100 row\">";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Name </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-40\">";
    htmlString += "<p>";
    htmlString += "<input id=\"recipeName\" type=\"text\" placeholder=\"" + recipe.name + "\" value=\"" + recipe.name + "\"/>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-40\">";
    htmlString += "<h2 id=\"picHere\" class=\"flush-right\">";
    if (isFavorite(recipe, loggedUser)) {
        htmlString += "<img id=\"favoritedSvg\" src=\"../assets/images/favorited.svg\" height=\"16px\" onclick=\"toggleFavorite()\"/>";
    } else {
        htmlString += "<img id=\"favoriteSvg\" src=\"../assets/images/favorite.svg\" height=\"16px\" onclick=\"toggleFavorite()\"/>";
    }
    htmlString += "</h2>";
    htmlString += "</div>";
    htmlString += "</div><div class=\"clear\"></div>";

    htmlString += "<div class=\"grid-100 row\">";

    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Photo </label>";
    htmlString += "</p>";
    htmlString += "</div>";

    htmlString += "<div class=\"grid-30\">"
    htmlString += "<p id=\"imgAppendHere\">";
    htmlString += "<img id=\"img\" src=\"/photos/" + recipe.id + "\" height=\"60px\" onclick=\"openImageWindow(this.src)\"/>";
    htmlString += "</p>";
    htmlString += "</div>";

    htmlString += "<div class=\"prefix-20 grid-30\">";
    htmlString += "<div class=\"flash-right\">";
    htmlString += "<p>";
    htmlString += "<input type=\"file\" id=\"file\" name=\"file\"/>";
    htmlString += "</p>";
    htmlString += "<p>";
    htmlString += "<button type=\"button\" onclick=\"uploadPhoto()\" class=\"secondary\">Upload</button>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</div>";

    htmlString += "</div><div class=\"clear\"></div>";

    htmlString += "<div class=\"grid-100 row\">";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Description </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-40\">";
    htmlString += "<p>";
    htmlString += "<textarea id=\"recipeDescription\" text=\""+recipe.description+"\" value=\"" + recipe.description + "\"/>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</div><div class=\"clear\"></div>";

    htmlString += "<div class=\"grid-100 row\">";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Category </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-30\">";
    htmlString += "<p>";

    var catString = "<select id='recipeCategory' field='" + recipe.category.id + "' value='"+recipe.category.id+"' onchange='changeSelectedCategory()'>";

    for (i = 0; i < allCategories.length; i++) {
        if (recipe.category.id != parseInt(allCategories[i].id)) {
            catString += "<option value=\"" + parseInt(allCategories[i].id) + "\">" + allCategories[i].name + "</option>";
        } else {
            catString += "<option value=\"" + parseInt(allCategories[i].id) + "\" selected='selected'>" + allCategories[i].name + "</option>";
        }
        catString += "<p id=\"getCategoryNameById" + allCategories[i].id + "\" text=\"" + allCategories[i].name + "\" hidden=\"hidden\"></p>";
    }

    catString += "</select>";
    console.log(catString);
    htmlString+=catString;


    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</div><div class='clear'></div>";

    htmlString += "<div class=\"grid-100 row\">";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Prep Time </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p>";
    htmlString += "<input id=\"recipePrepTime\" type=\"time\" placeholder=\"" + recipe.prepTime + "\" value=\"" + recipe.prepTime + "\"/>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</div><div class=\"clear\"></div>";

    htmlString += "<div class=\"grid-100 row\">";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Cook Time </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p>";
    htmlString += "<input id=\"recipeCookTime\" type=\"time\" placeholder=\"" + recipe.cookTime + "\" value=\"" + recipe.cookTime + "\"/>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</div><div class=\"clear\"></div>";

    htmlString += "<div id='ingredientRows' class=\"grid-100 row\">"
    htmlString += ingredientRow(recipe);
    htmlString += "<div class=\"clear\"></div>";
    htmlString += "</div>";


    htmlString += "<div id=\"stepsRows\" class=\"grid-100 row\">";
    htmlString += stepsRow(recipe);
    htmlString += "</div><div class=\"clear\"></div>";


    htmlString += "<div class=\"row\">&nbsp;</div>";

    htmlString += "</div>";

    return htmlString;
}

function ingredientRow (recipe) {
    var
    htmlString = "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Ingredients </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-30\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Item </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-30\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Condition </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Quantity </label>";
    htmlString += "</p>";
    htmlString += "</div>";

    htmlString += "<div class=\"ingredient-row\">";

    htmlString += "<div class=\"prefix-20 grid-30\">";
    if (recipe.ingredients != null) {
        for (i = 0; i < recipe.ingredients.length; i++) {
            htmlString += "<p>";
            htmlString += "<input id=\"recipeIngredient" + i + "\" placeholder=\"" + recipe.ingredients[i].ingredient + "\" value=\"" + recipe.ingredients[i].ingredient + "\"/>";
            htmlString += "</p>";
        }
    }
    htmlString += "</div>";

    htmlString += "<div class=\"grid-30\">";
    if (recipe.ingredients != null) {
        for (i = 0; i < recipe.ingredients.length; i++) {
            htmlString += "<p>";
            htmlString += "<input id=\"recipeCondition" + i + "\" placeholder=\"" + recipe.ingredients[i].condition + "\" value=\"" + recipe.ingredients[i].condition + "\"/>";
            htmlString += "</p>";
        }
    }
    htmlString += "</div>";

    htmlString += "<div class=\"grid-20\">";
    if (recipe.ingredients != null) {
        for (i = 0; i < recipe.ingredients.length; i++) {
            htmlString += "<p>";
            htmlString += "<input id=\"recipeQuantity" + i + "\" placeholder=\"" + recipe.ingredients[i].quantity + "\" value=\"" + recipe.ingredients[i].quantity + "\" style=\"width: 10px\"/>";
            htmlString += "<a href='#' onclick='deleteIngredient("+i+")'> [-]</a>";
            htmlString += "</p>";
        }
    }
    htmlString += "</div>";

    htmlString += "</div>";

    htmlString += "<div class=\"prefix-20 grid-80 add-row\">";
    htmlString += "<p>";
    htmlString += "<button type=\"button\" onclick=\"addIngredient()\" class=\"secondary\">+ Add Another Ingredient</button>";
    htmlString += "</p>";
    htmlString += "</div><div class=\"clear\"></div>";
    return htmlString;
}

function stepsRow (recipe) {
    var htmlString = "<div class=\"grid-20\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Steps </label>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-80\">";
    htmlString += "<p class=\"label-spacing\">";
    htmlString += "<label> Description </label>";
    htmlString += "</p>";
    htmlString += "</div>";

    htmlString += "<div class=\"step-row\">";
    htmlString += "<div class=\"prefix-20 grid-80\">";
    if (recipe.steps != null) {
        for (i = 0; i < recipe.steps.length; i++) {
            htmlString += "<p>";
            htmlString += "<input id=\"recipeStep" + i + "\" placeholder=\"" + recipe.steps[i] + "\" value=\"" + recipe.steps[i] + "\" name=\"" + recipe.steps[i] + "\" style=\"width: 400px\"/>";
            htmlString += "<a href='#' onclick='deleteStep("+i+")'> [-]</a>";
            htmlString += "</p>";
        }
    }
    htmlString += "</div>";
    htmlString += "</div>";
    htmlString += "<div class=\"prefix-20 grid-80 add-row\">";
    htmlString += "<p>";
    htmlString += "<button type=\"button\" onclick=\"addStep()\" class=\"secondary\">+ Add Another Step</button>";
    htmlString += "</p>";
    htmlString += "</div>";
    return htmlString;
}

function isFavorite(recipe, loggedUser) {
    for (i=0;i<recipe.favoriteUsers.length;i++) {
        if (recipe.favoriteUsers[i].id == loggedUser.id)
            return true;
    }
    return false;
}

function addIngredient () {
    var recipe = getRecipe();
    var newIngredient = {
        ingredient: "",
        condition: "",
        quantity: 0
    };
    if (recipe.ingredients == null) {
        recipe.ingredients = [];
    }
    recipe.ingredients.push(newIngredient);
    $("#ingredientRows").children().remove();
    $("#ingredientRows").append(ingredientRow(recipe));
}

function deleteIngredient (row) {
    var recipe = getRecipe();
    recipe.ingredients.splice(row, 1);
    $("#ingredientRows").children().remove();
    $("#ingredientRows").append(ingredientRow(recipe));
}

function addStep () {
    var recipe = getRecipe();
    if (recipe.steps == null) {
        recipe.steps = [];
    }
    recipe.steps.push("");
    $("#stepsRows").children().remove();
    $("#stepsRows").append(stepsRow(recipe));
}

function deleteStep (row) {
    var recipe = getRecipe();
    recipe.steps.splice(row, 1);
    $("#stepsRows").children().remove();
    $("#stepsRows").append(stepsRow(recipe));
}

function getRecipe () {
    var d = getRecipeDescription();

    var recipe = {
        id : getRecipeId(),
        name: getRecipeName(),
        description : getRecipeDescription(),
        category : getRecipeCategory(),
        prepTime: getRecipePrepTime(),
        cookTime: getRecipeCookTime(),
        user: getRecipeUser()
    }
    var recipeIngredients = [];
    var index = 0;
    while (true) {
        if (document.getElementById("recipeIngredient"+index) != null) {
            var i = document.getElementById("recipeIngredient"+index);
            var ivalue = i.value;
            var c = document.getElementById("recipeCondition"+index);
            var cvalue = c.value;
            var q = document.getElementById("recipeQuantity"+index);
            var qvalue = q.value;

            recipeIngredients.push({
                ingredient: document.getElementById("recipeIngredient"+index).value,
                condition: document.getElementById("recipeCondition"+index).value,
                quantity: document.getElementById("recipeQuantity"+index).value
            });
        } else {
            break;
        }
        index++;
    }
    if (index>0) {
        recipe.ingredients = recipeIngredients;
    }
    var recipeSteps = [];
    index = 0;
    while (true) {
        if (document.getElementById("recipeStep"+index) != null) {
            recipeSteps.push(document.getElementById("recipeStep"+index).value);
        } else {
            break;
        }
        index++;
    }
    if (index>0) {
        recipe.steps = recipeSteps;
    }
    return recipe;
    var recipeFavoriteUsers = [];
    index = 0;
    while (true) {
        if (document.getElementById("favUser"+index) != null) {
            recipeFavoriteUsers.push(document.getElementById("favUser"+index).value);
        } else {
            break;
        }
        index++;
    }
    if (index>0) {
        recipe.favoriteUsers = recipeFavoriteUsers;
    }

    return recipe;
}

function getRecipeId () {
    return parseInt(document.getElementById("recipeIdInput").value);
}

function getRecipeName () {
    return document.getElementById("recipeName").value;
}

function getRecipeDescription () {
    var el = document.getElementById("recipeDescription");
    console.log(document.getElementById("recipeDescription"));
    return document.getElementById("recipeDescription").value;
}

function getRecipePrepTime () {
    return document.getElementById("recipePrepTime").value;
}

function getRecipeCookTime () {
    return document.getElementById("recipeCookTime").value;
}

function getRecipeUser () {
    var username = document.getElementById("recipeUserName").innerText;
    var user = {
        username: username
    };
    return user;
}

function getRecipeCategory () {
    var categoryId = parseInt(document.getElementById("recipeCategory").value);
    var categoryName = getCategoryName(categoryId);
    var category = {
        id: categoryId,
        name: categoryName
    };
    return category;
}

function uploadPhoto () {
    var file = document.getElementById("file").files[0];
    var recipeId = getRecipeId();
    var recipeName = getRecipeName();
    var fileExtension = file.name.split('.').pop();
    var fileType = file.type.substr(0, file.type.indexOf('/'));

    console.log("File name: " + file.name);
    console.log("File type: " + file.type);
    console.log("File ext: " + fileExtension);
    console.log("File type (optional): " + fileType);
    console.log("File size: " + file.size);

    if (file.size >128*1024) { // File is too big >128KB
        clearFlash();
        printFlashMessage("Can not upload file " + file.name + ", because it's size (" + file.size +" bytes) is too big. Maximum size is 128KB.", "failure");
        return;
    }
    if (fileType != "image") { // File is not image
        clearFlash();
        printFlashMessage("Can not upload file " + file.name + ", because it's not an image file.", "failure");
        return;
    }
    var formData = new FormData();
    formData.append( "file", document.getElementById("file").files[0]);
    $.ajax({
        url: "/upload/"+recipeId,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
        success: function (data) {
            var someRandQuery = "?" + (Math.random()*100000);
            $("#imgAppendHere").html("<a href=\"#\"><img id=\"img\" src=\"/photos/" + recipeId + "." + fileExtension + someRandQuery + "\" height=\"60px\" onclick=\"openImageWindow(this.src);\"/></a>");
            clearFlash();
            printFlashMessage("Photo from file " + file.name + " uploaded to recipe \"" + recipeName +"\" (id=" + recipeId + ").", "success");
        }
    });
}

function openImageWindow(src) {
    var image = new Image();
    image.src = src;
    var width = image.width;
    var height = image.height;
    window.open(src,"Image","width=" + width + ",height=" + height);
}

function saveRecipe () {
    var recipe = getRecipe();
    console.log(recipe);

    $.ajax({
        url: "/recipe/"+recipe.id,
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        data: JSON.stringify(recipe, null, "\t"),
        success: function(data) {
            console.log(data);
            clearFlash();
            printFlashMessage("Recipe \""+data.name+"\" (id="+data.id+") saved.", "success");
        },
        error : getErrorMsg
    });
}