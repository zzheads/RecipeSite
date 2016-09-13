function getEditRecipeHtmlString(allCategories, recipe) {
    var i=0;
    var htmlString =
        "<div class='recipes'>" +
        "<input type='hidden' id='recipeIdInput' field='" + recipe.id + "' value='" + recipe.id + "'/>";

    htmlString += "<div id='favoriteUsers' hidden=\"hidden\">";
    htmlString += getFavoriteUsersHtmlString(recipe);
    htmlString += "</div>";

    htmlString += "<p hidden=\"hidden\" id=\"recipeId\">"+recipe.id+"</p>";
    htmlString += "<p hidden=\"hidden\" id=\"recipeUserName\">"+recipe.user.username+"</p>";
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
    htmlString += "<input id=\"recipeName\" type=\"text\" placeholder=\"" + recipe.name + "\"/>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "<div class=\"grid-40\">";
    htmlString += "<h2 id=\"picHere\" class=\"flush-right\">";
    htmlString += getFavoriteIconHtmlString(recipe, loggedUser);
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
    htmlString += "<img id=\"img\" src=\"/photos/" + recipe.id + ".png" + "\" height=\"60px\" onclick=\"openImageWindow(this.src)\"/>";
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
    htmlString += "<textarea id=\"recipeDescription\" placeholder=\""+recipe.description+"\"/>";
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
    htmlString += getIngredientsRowsHtmlString(recipe);
    htmlString += "<div class=\"clear\"></div>";
    htmlString += "</div>";


    htmlString += "<div id=\"stepsRows\" class=\"grid-100 row\">";
    htmlString += getStepsRowsHtmlString(recipe);
    htmlString += "</div><div class=\"clear\"></div>";


    htmlString += "<div class=\"row\">&nbsp;</div>";

    htmlString += "</div>";

    return htmlString;
}

function getFavoriteUsersHtmlString (recipe) {
    var htmlString="", i=0;
    if (recipe.favoriteUsers!=null) {
        for (i = 0; i < recipe.favoriteUsers.length; i++) {
            htmlString += "<input hidden='hidden' id='favUser" + i + "' value='" + recipe.favoriteUsers[i].username + "'/>";
        }
    }
    return htmlString;
}

function getFavoriteIconHtmlString (recipe, loggedUser) {
    if (isFavorite(recipe, loggedUser)) {
        return "<img id=\"favoritedSvg\" src=\"../assets/images/favorited.svg\" height=\"16px\" onclick=\"toggleFavorite()\"/>";
    } else {
        return "<img id=\"favoriteSvg\" src=\"../assets/images/favorite.svg\" height=\"16px\" onclick=\"toggleFavorite()\"/>";
    }
}

function getIngredientsRowsHtmlString (recipe) {
    var i=0;
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
            htmlString += "<input id=\"recipeIngredient" + i + "\" placeholder=\"" + recipe.ingredients[i].ingredient + "\"/>";
            htmlString += "</p>";
        }
    }
    htmlString += "</div>";

    htmlString += "<div class=\"grid-30\">";
    if (recipe.ingredients != null) {
        for (i = 0; i < recipe.ingredients.length; i++) {
            htmlString += "<p>";
            htmlString += "<input id=\"recipeCondition" + i + "\" placeholder=\"" + recipe.ingredients[i].condition + "\"/>";
            htmlString += "</p>";
        }
    }
    htmlString += "</div>";

    htmlString += "<div class=\"grid-20\">";
    if (recipe.ingredients != null) {
        for (i = 0; i < recipe.ingredients.length; i++) {
            htmlString += "<p>";
            htmlString += "<input id=\"recipeQuantity" + i + "\" placeholder=\"" + recipe.ingredients[i].quantity + "\" style=\"width: 10px\"/>";
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

function getStepsRowsHtmlString (recipe) {
    var i=0;
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
            htmlString += "<input id=\"recipeStep" + i + "\" placeholder=\"" + recipe.steps[i] + "\" name=\"" + recipe.steps[i] + "\" style=\"width: 400px\"/>";
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

function getNavBarHtmlString (allCategories) {
    var i = 0;
    var selectedCategory = getSelectedCategoryId();
    var pattern = getPattern();
    var method = getMethod();
    var user = getLoggedUser();
    var htmlString = "<p id='loggedUser' hidden='hidden'>"+user.username+"</p>";
    htmlString += "<p id='loggedUserRole' hidden='hidden'>"+user.role+"</p>";
    htmlString += "<div id='categoriesHere'>";
    for (i=0;i<allCategories.length;i++) {
        htmlString += "<p id='getCategoryNameById" + allCategories[i].id + "' hidden='hidden'>" + allCategories[i].name + "</p>";
    }
    htmlString += "</div>";

    htmlString += "<div class='grid-100 row controls'>";
    htmlString += "<div class='grid-30'>";
    htmlString += "<select id='recipeCategory' field='" + selectedCategory.id + "' value='"+selectedCategory.id+"' onchange='linkToSelectedCategory()'>";
    for (i = 0; i < allCategories.length; i++) {
        if (selectedCategory.id != parseInt(allCategories[i].id)) {
            htmlString += "<option value=\"" + parseInt(allCategories[i].id) + "\">" + allCategories[i].name + "</option>";
        } else {
            htmlString += "<option value=\"" + parseInt(allCategories[i].id) + "\" selected='selected'>" + allCategories[i].name + "</option>";
        }
    }
    htmlString += "</select>";

    htmlString += "</div>";
    htmlString += "<div class='grid-30' id='search-form'>";
    htmlString += "<input type='text' id='searchRecipe' name='q' autocomplete='off' value='"+pattern+"' oninput='linkToPattern()'/>";
    htmlString += "</div>";
    htmlString += "<div class='grid-20'>";
    htmlString += "<select id='searchMethod' value='"+method+"'>";
    if (method == "in Description") {
        htmlString += "<option selected='selected'>in Description</option>";
        htmlString += "<option>in Ingredient</option>";
    } else {
        htmlString += "<option>in Description</option>";
        htmlString += "<option selected='selected'>in Ingredient</option>";
    }
    htmlString += "</select>";
    htmlString += "</div>";
    htmlString += "<div class='grid-20'>";
    htmlString += "<div class='flush-right'>";
    htmlString += "<button type='button' onclick='addNewRecipe()'>Add Recipe</button>";
    htmlString += "</div>";
    htmlString += "</div>";
    htmlString += "</div>";

    htmlString += "<div class='grid-100'>";
    htmlString += "<div class='recipes'>";
    htmlString += "<div class='grid-100 row controls'>";
    htmlString += "<div class='grid-100'>";
    htmlString += "<h2> Recipes </h2>";
    htmlString += "</div>";
    htmlString += "</div> <div class='clear'></div>";

    htmlString += "<div id='recipesList'>";



    htmlString += "</div>";
    htmlString += "<div class='row'>&nbsp;</div>";
    htmlString += "</div>"; <!-- recipes -->
    htmlString += "</div>"; <!-- grid-100 -->

    return htmlString;
}

function getRecipeRowHtmlString (recipe) {
    var
        htmlString = "<div id='recipe#"+recipe.id+"' class=\"grid-100 row addHover\">";
    htmlString += "<a href=\"/detail/" + recipe.id +"\">";
    htmlString += "<div class=\"grid-70\">";
    htmlString += "<p>";
    if (isFavorite(recipe, getLoggedUser()))
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
    htmlString += "<a id='editButton#"+recipe.id+"' href='#' class='button' onclick='editRecipe(this.id)'><img src='../assets/images/edit.svg' height='12px'/>Edit</a>";
    htmlString += "<a id='deleteButton#"+recipe.id+"' href='#' class='button' onclick='deleteRecipe(this.id)'><img src='../assets/images/delete.svg' height='12px'/>Delete</a>";
    htmlString += "<p id='recipeUser#"+recipe.id+"' hidden='hidden'>"+recipe.user.username+"</p>";
    htmlString += "</p>";
    htmlString += "</div>";
    htmlString += "</div>";
    htmlString += "</div>";
    htmlString += "</div> <div class=\"clear\">";
    htmlString += "</div>";

    return htmlString;
}

function showRecipesList (recipes) {
    var i = 0;
    $("#recipesList").children().remove();
    if (recipes != null) {
        for (i = 0; i < recipes.length; i++) {
            $("#recipesList").append(getRecipeRowHtmlString(recipes[i]));
        }
    }
}

function toListMode (allCategories, recipes) {
    $("#root").children().remove();
    $("#root").append(getNavBarHtmlString(allCategories));
    showRecipesList(recipes);
}

function updateSelectedCategory () {
    if (document.getElementById("selectedCategory") == null) {
        $("#hiddenPlaceToStoreSomeVars").append("<p id='selectedCategory' hidden='hidden'>"+getSelectedCategoryId()+"</p>");
    } else {
        document.getElementById("selectedCategory").innerHTML="<p id='selectedCategory' hidden='hidden'>"+getSelectedCategoryId()+"</p>";
    }
}

function updatePatternAndMethod () {
    if (document.getElementById("pattern") == null) {
        $("#hiddenPlaceToStoreSomeVars").append("<p id='pattern' hidden='hidden'>"+getPattern()+"</p>");
    } else {
        document.getElementById("pattern").innerHTML="<p id='pattern' hidden='hidden'>"+getPattern()+"</p>";
    }

    if (document.getElementById("method") == null) {
        $("#hiddenPlaceToStoreSomeVars").append("<p id='method' hidden='hidden'>"+getMethod()+"</p>");
    } else {
        document.getElementById("method").innerHTML="<p id='method' hidden='hidden'>"+getMethod()+"</p>";
    }
}

function toEditMode (allCategories, recipe) {
    // save selectedCategory, pattern, method
    updateSelectedCategory();
    updatePatternAndMethod();
    $("#root").children().remove();
    $("#root").append(getEditRecipeHtmlString(allCategories, recipe))
}

