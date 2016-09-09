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
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            var err = eval("(" + jqXHR.responseText + ")");
            printFlashMessage(jqXHR.responseText, "failure");
        }
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
