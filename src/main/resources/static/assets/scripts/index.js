function getLoggedUser () {
    return {
        username: document.getElementById("loggedUser").innerText,
        role: document.getElementById("loggedUserRole").innerText
    };
}

function getRecipeUser (id) {
    var element = document.getElementById("recipeUser#" + id);
    var username = document.getElementById("recipeUser#" + id).innerText;
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

function linkToSelectedCategory () {
    var selectedCategory = getSelectedCategory();
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
    console.log("Deleting recipe id=" + id);
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
        success: function (data) {
            var allCategories = data;
            $.ajax({
                url: "/recipe/"+id,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
                success: function (data) {
                    toEditMode(allCategories, data);
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
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        cache: false,
        success: function (data) {
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