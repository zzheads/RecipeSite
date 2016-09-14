function getLoggedUser () {
    return {
        username: document.getElementById("loggedUser").innerText,
        role: document.getElementById("loggedUserRole").innerText
    };
}

function getRecipeUser (id) {
    return {
        username: document.getElementById("recipeUser#" + id).innerText
    };
}

function checkAccess (loggedUser, ownerUser) {
    return (loggedUser.role == "ROLE_ADMIN" || loggedUser.username == ownerUser.username);
}

function getSelectedCategoryId () {
    if (document.getElementById("selectCategory")!=null) {
        return parseInt(document.getElementById("selectCategory").value);
    } else {
        return parseInt(document.getElementById("selectedCategory").innerText);
    }
}

function getPattern () {
    if (document.getElementById("searchRecipe")!=null) {
        return document.getElementById("searchRecipe").value;
    } else {
        return document.getElementById("pattern").innerText;
    }
}

function getMethod () {
    if (document.getElementById("searchMethod")!=null) {
        return document.getElementById("searchMethod").value;
    } else {
        return document.getElementById("method").innerText;
    }
}

function getAllCategories () {
    var index = 0;
    var allCategories = [];
    while (true) {
        if (document.getElementById("allCategoriesName"+index) == null)
            break;
        allCategories.push({
            id: document.getElementById("allCategoriesId"+index).innerText,
            name: document.getElementById("allCategoriesName"+index).innerText
        });
        index++;
    }
    return allCategories;
}

function linkToSelectedCategory () {
    var selectedCategory = getSelectedCategoryId();
    console.log("Select category changed, starting searching recipes by category with id: " + selectedCategory);
    // Update store place
    updateSelectedCategory();
    // Unassigned category means any recipe so redirect to index then
    $.ajax({
        url: "/recipe_bycategory/"+selectedCategory,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function (data) {
            showRecipesList(data);
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
    var pattern = getPattern();
    var method = getMethod();
    updatePatternAndMethod();
    console.log("Search changed, starting searching recipes by pattern: \"" + pattern + "\"");
    // Empty pattern means any recipe so redirect to index then
    if (pattern != "") {
        $.ajax({
            url: "/recipe_bypattern/" + pattern + "." + method,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
            success: function (data) {
                showRecipesList(data);
                clearFlash();
                printFlashMessage("Listed all recipes contains (" + pattern + ") which searched " + method.toLowerCase() + ".", "info");
            },
            error: getErrorMsg
        });
    } else {
        $.ajax({
            url: "/recipe",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
            success: function (data) {
                showRecipesList(data);
                clearFlash();
                printFlashMessage("Listed all recipes, because search pattern is empty.", "info");
            },
            error: getErrorMsg
        });
    }
}

function deleteRecipe (buttonId) {
    var id = buttonId.split('#').pop();
    console.log("Deleting recipe id="+id);
    if (!checkAccess(getLoggedUser(), getRecipeUser(id))) {
        clearFlash();
        printFlashMessage("You can not delete this recipe, only owner ("+ getRecipeUser(id).username +") can do it. Access denied.","failure");
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
    console.log("Editing recipe id=" + id);
    if (!checkAccess(getLoggedUser(), getRecipeUser(id))) {
        clearFlash();
        printFlashMessage("You can not edit this recipe, only owner (" + getRecipeUser(id).username + ") can do it. Access denied.", "failure");
        return;
    }

    $.ajax({
        url: "/category/",
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function (allCategories) {
            $.ajax({
                url: "/recipe/"+id,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
                success: function (recipe) {
                    console.log("prepTime: "+recipe.prepTime);
                    console.log("cookTime: "+recipe.cookTime);
                    toEditMode(allCategories, recipe);
                },
                error: getErrorMsg
            });
        }
    });
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
    var ingredientRows = $("#ingredientRows");
    ingredientRows.children().remove();
    ingredientRows.append(getIngredientsRowsHtmlString(recipe));
}

function deleteIngredient (row) {
    var recipe = getRecipe();
    recipe.ingredients.splice(row, 1);
    var ingredientRows = $("#ingredientRows");
    ingredientRows.children().remove();
    ingredientRows.append(getIngredientsRowsHtmlString(recipe));
}

function addStep () {
    var recipe = getRecipe();
    if (recipe.steps == null) {
        recipe.steps = [];
    }
    recipe.steps.push("");
    var stepsRows = $("#stepsRows");
    stepsRows.children().remove();
    stepsRows.append(getStepsRowsHtmlString(recipe));
}

function deleteStep (row) {
    var recipe = getRecipe();
    recipe.steps.splice(row, 1);
    var stepsRows = $("#stepsRows");
    stepsRows.children().remove();
    stepsRows.append(getStepsRowsHtmlString(recipe));
}

function toggleFavorite () {
    var recipe = getRecipe();
    var currentUser = getLoggedUser();
    // if loggedUser present in favoriteUsers - remove it, if not - add
    if (isFavorite(recipe, currentUser)) {
        recipe.favoriteUsers.splice(recipe.favoriteUsers.indexOf(currentUser),1);
    } else {
        recipe.favoriteUsers.push(currentUser);
    }
    // update stored favoriteUsers
    updateFavoriteUsers(recipe);
    // update icon
    var picHere = $("#picHere");
    picHere.children().remove();
    picHere.append(getFavoriteIconHtmlString(recipe, currentUser));
}

function updateFavoriteUsers (recipe) {
    var favoriteUsers = $("#favoriteUsers");
    favoriteUsers.children().remove();
    favoriteUsers.append(getFavoriteUsersHtmlString(recipe));
}

function addNewCategory () {
    var newCategory = {
        name: document.getElementById("newCategoryNameInput").value
    };
    var allCategories = getAllCategories();
    var recipe = getRecipe();
    console.log("Adding new category with name:"+newCategory.name);
    // Check there is no category with same name
    for (var i=0;i<allCategories.length;i++) {
        if (allCategories[i].name == newCategory.name) {
            clearFlash();
            printFlashMessage("Can't add new category, there is with same name already.", "failure");
            return;
        }
    }

    $.ajax({
        url: "/category",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newCategory, null, "\t"),
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        success: function (data) {
            newCategory = data;
            allCategories.push(newCategory);
            // update select with new category
            var selectCategoryRow = $("#selectCategoryRow");
            selectCategoryRow.children().remove();
            selectCategoryRow.append(getSelectCategoryRowHtmlString(allCategories, recipe));
            clearFlash();
            printFlashMessage("New category (name='"+data.name+"', id="+data.id+") successfully added.", "success");
        },
        error: getErrorMsg
    });
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
    if (fileExtension != "png") { // File is not image
        clearFlash();
        printFlashMessage("Can not upload file " + file.name + ", only '.png' files allowed.", "failure");
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
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        cache: false,
        success: function () {
            var someRandQuery = "?" + (Math.random()*100000);
            $("#imgAppendHere").html("<a href=\"#\"><img id=\"img\" src=\"/photos/" + recipeId + "." + fileExtension + someRandQuery + "\" height=\"60px\" onclick=\"openImageWindow(this.src);\"/></a>");
            clearFlash();
            printFlashMessage("Photo from file " + file.name + " uploaded to recipe \"" + recipeName +"\" (id=" + recipeId + ").", "success");
        },
        error: getErrorMsg
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
        url: "/recipe/" + recipe.id,
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        data: JSON.stringify(recipe, null, "\t"),
        success: function (data) {
            var savedRecipe = data;
            $.ajax({
                url: "/category/",
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
                success: function (data) {
                    var allCategories = data;
                    $.ajax({
                        url: "/recipe",
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
                        success: function (data) {
                            toListMode(allCategories, data);
                            clearFlash();
                            printFlashMessage("Recipe \"" + savedRecipe.name + "\" (id=" + savedRecipe.id + ") saved.", "success");
                        },
                        error: getErrorMsg
                    });
                },
                error: getErrorMsg
            });
        },
        error: getErrorMsg
    });
}

function addNewRecipe () {
    var newRecipe = getNewRecipe();

    $.ajax({
        url: "/recipe",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(newRecipe, null, "\t"),
        contentType: "application/json",
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        success: function (newRecipe) {
            $.ajax({
                url: "/category/",
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
                success: function (allCategories) {
                    toEditMode(allCategories, newRecipe);
                },
                error: getErrorMsg
            });
        },
        error: getErrorMsg
    });
}

function indexPage () {
    $.ajax({
        url: "/recipe",
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        success: function (allRecipes) {
            toListMode(getAllCategories(), allRecipes);
        },
        error: getErrorMsg
    });
}
