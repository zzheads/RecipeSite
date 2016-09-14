function getRecipeId () {
    return parseInt(document.getElementById("recipeIdInput").value);
}

function getRecipeName () {
    var value = document.getElementById("recipeName").value;
    var placeholder = document.getElementById("recipeName").placeholder;
    if (value != "") {
        return value;
    } else {
        return placeholder;
    }
}

function getRecipeDescription () {
    var value = document.getElementById("recipeDescription").value;
    var placeholder = document.getElementById("recipeDescription").placeholder;
    if (value != "") {
        return value;
    } else {
        return placeholder;
    }
}

function getRecipePrepTime () {
    return document.getElementById("recipePrepTime").value;
}

function getRecipeCookTime () {
    return document.getElementById("recipeCookTime").value;
}

function getRecipeCategory () {
    var categoryId = parseInt(document.getElementById("recipeCategory").value);
    return {
        id: categoryId,
        name: getCategoryName(categoryId)
    };
}

function getRecipeIngredient (index) {
    var ingredientValue = document.getElementById("recipeIngredient"+index).value;
    var ingredientPlaceholder = document.getElementById("recipeIngredient"+index).placeholder;
    var conditionValue = document.getElementById("recipeCondition"+index).value;
    var conditionPlaceholder = document.getElementById("recipeCondition"+index).placeholder;
    var quantityValue = document.getElementById("recipeQuantity"+index).value;
    var quantityPlaceholder = document.getElementById("recipeQuantity"+index).placeholder;
    if (ingredientValue == "")
        ingredientValue = ingredientPlaceholder;
    if (conditionValue == "")
        conditionValue = conditionPlaceholder;
    if (quantityValue == "")
        quantityValue = quantityPlaceholder;

    return {
        ingredient: ingredientValue,
        condition: conditionValue,
        quantity: parseInt(quantityValue)
    };
}

function getRecipeStep (index) {
    var stepValue = document.getElementById("recipeStep"+index).value;
    var stepPlaceholder = document.getElementById("recipeStep"+index).placeholder;
    if (stepValue != "") {
        return stepValue;
    } else {
        return stepPlaceholder;
    }
}

function getFavUser (index) {
    return {
        username: document.getElementById("favUser"+index).value
    };
}

function getCategoryName (categoryId) {
    return document.getElementById("getCategoryNameById"+categoryId).innerText;
}

function getRecipeAnyArray (elementCheck, functionGet) {
    var array = [];
    var index = 0;
    while (true) {
        if (document.getElementById(elementCheck+index) != null) {
            array.push(functionGet(index));
        } else {
            break;
        }
        index ++;
    }
    return array;
}

function isFavorite(recipe, loggedUser) {
    if (recipe.favoriteUsers == null)
        return false;
    for (i=0;i<recipe.favoriteUsers.length;i++) {
        if (recipe.favoriteUsers[i].name == loggedUser.name)
            return true;
    }
    return false;
}

function getRecipe () {
    return {
        id : getRecipeId(),
        name: getRecipeName(),
        description : getRecipeDescription(),
        category : getRecipeCategory(),
        prepTime: getRecipePrepTime(),
        cookTime: getRecipeCookTime(),
        user: getLoggedUser(),
        ingredients: getRecipeAnyArray("recipeIngredient", getRecipeIngredient),
        steps: getRecipeAnyArray("recipeStep", getRecipeStep),
        favoriteUsers: getRecipeAnyArray("favUser", getFavUser)
    };
}

function getNewRecipe () {
    return {
        name: "",
        description : "",
        category : {
            id: 0,
            name: "Unassigned"
        },
        prepTime: "",
        cookTime: "",
        user: getLoggedUser(),
        ingredients: [],
        steps: [],
        favoriteUsers: []
    };
}