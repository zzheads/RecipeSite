function addIngredient () {
    var recipeId = document.getElementById("recipeId").innerText;
    var recipe = getRecipe();
    var jsonRecipe = JSON.stringify(recipe, null, "\t");
    console.log("Recipe id: " + recipeId);
    console.log("Recipe: " + jsonRecipe);
    $.ajax({
        url: "/recipe_addingredient/" + recipeId,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(recipe, null, "\t"),
        success: function (data) {
            document.location.href = "/edit/"+recipeId;
        }
    });
}

function addStep () {
    var recipeId = document.getElementById("recipeId").innerText;
    var recipe = getRecipe();
    var jsonRecipe = JSON.stringify(recipe, null, "\t");
    console.log("Recipe id: " + recipeId);
    console.log("Recipe: " + jsonRecipe);
    $.ajax({
        url: "/recipe_addstep/" + recipeId,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(recipe, null, "\t"),
        success: function (data) {
            document.location.href = "/edit/"+recipeId;
        }
    });
}

function getRecipe () {
    var recipe = {
        id : document.getElementById("recipeId").innerText,
        name: document.getElementById("recipeName").value,
        description : document.getElementById("recipeDescription").value,
        category : getCategoryName(document.getElementById("recipeCategory").value),

        prepTime: document.getElementById("recipePrepTime").value,
        cookTime: document.getElementById("recipeCookTime").value,
        user: document.getElementById("recipeUserName").innerText
    }
    var recipeIngredients = [];
    var index = 0;
    while (true) {
        if (document.getElementById("recipeIngredient"+index) != null) {
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

function getCategoryName (categoryId) {
    return document.getElementById("getCategoryNameById"+categoryId).innerText;
}

function uploadPhoto () {
    var file = document.getElementById("file").files[0];
    var recipeId = document.getElementById("recipeId").innerText;
    var recipeName = document.getElementById("recipeName").value;
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
