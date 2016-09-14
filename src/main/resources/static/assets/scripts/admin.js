function getRoleUser() {
    return {
        id: 1,
        name: "ROLE_USER"
    };
}

function getUsernameById (id) {
    return document.getElementById("inputUsername#"+id).value;
}

function getPasswordById (id) {
    return document.getElementById("inputPassword#"+id).value;
}

function getRoleById (id) {
    return {
        id: id,
        name: document.getElementById("inputRole#"+id).value
    };
}

function countUsers() {
    var count = 0, id;
    while (true) {
        id = "inputUsername#"+count;
        if (document.getElementById(id) == null)
            return count;
        count++;
    }
}

function toHtml (user) {
    var html = "";
    html += "<div id=\"user#" + user.id + "\" class=\"recipes\">";
    html += "<div class=\"grid-30\">";
    html += "<p>";
    html += "<input id=\"inputUsername#" + user.id + "\" value=\"" + user.username + "\"/>";
    html += "</p>";
    html += "</div>";
    html += "<div class=\"grid-30\">";
    html += "<p>";
    html += "<input id=\"inputPassword#" + user.id + "\" value=\"" + user.password + "\"/>";
    html += "</p>";
    html += "</div>";
    html += "<div class=\"grid-15\">";
    html += "<p>";
    html += "<input id=\"inputRole#" + user.id + "\" value=\"" + user.role.name + "\"/>";
    html += "</p>";
    html += "</div>";
    html += "<div class=\"grid-25\">";
    html += "<div class=\"flush-right\">";
    html += "<p>";
    html += "<a href=\"#\"><button type=\"button\" id=\"buttonDelete#" + user.id + "\" onclick=\"deleteUser(this.id)\">Delete</button></a> ";
    html += "<a href=\"#\"><button type=\"button\" id=\"buttonSave#" + user.id + "\" onclick=\"saveUser(this.id)\">Save</button></a>";
    html += "</p>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    return html;
}

function addUser() {
    var newUser = {
        id : 0,
        username : "",
        password : "",
        role: getRoleUser(),
        enabled: true
    };

    $.ajax({
        url: "/user",
        type: "POST",
        dataType: "json",
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        data: JSON.stringify(newUser, null, "\t"),
        success: function (newUser) {
            console.log(newUser);
            console.log(countUsers());
            $("#users").append(toHtml(newUser));
            clearFlash();
            printFlashMessage("User (id="+newUser.id+") added.", "success");
        },
        error: getErrorMsg
    });
}

function deleteUser(buttonId) {
    var id = buttonId.split('#').pop();
    console.log("Deleting user (id=" + id + ").");

    $.ajax({
        url: "/user/"+id,
        type: "DELETE",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function () {
            clearFlash();
            printFlashMessage("User (id="+id+") deleted.", "success");
            document.getElementById("user#"+id).remove();
        },
        error: getErrorMsg
    });
}

function saveUser(buttonId) {
    var id = buttonId.split('#').pop();

    console.log(id);
    var user = {
        id: id,
        username: getUsernameById(id),
        password: getPasswordById(id),
        role: getRoleById(id),
        enabled: true
    };
    console.log(user);
    console.log(JSON.stringify(user, null, "\t"));

    $.ajax({
        url: "/user/"+user.id,
        type: "PUT",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        data: JSON.stringify(user),
        success: function (updatedUser) {
            document.getElementById("user#"+user.id).remove();
            $("#users").append(toHtml(updatedUser));
            clearFlash();
            printFlashMessage("User (id="+updatedUser.id+") saved.", "success");
        },
        error: getErrorMsg
    });
}

function checkUsers() {
    var buttonsHere = $("#buttonsHere");
    buttonsHere.children().remove();
    $("#title").remove();
    $("#titleHere").append("<h1  id=\"title\"> Users: </h1>");
    buttonsHere.append("<a href=\"#\"><button id=\"backToEditButton\" type=\"button\" onclick=\"backToEdit()\" class=\"secondary\">Back to Edit</button></a>");
    $("#users").hide();
    $.ajax({
        url: "/user",
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function(allUsers) {
            for (i=0;i<allUsers.length;i++) {
                $("#bases").append(
                    "<div>"+
                    "<p><h2>"+"id/username: " + allUsers[i].id+" / "+allUsers[i].username+"</h2></p>"+
                    "<p>"+"password: " + allUsers[i].password+"</p>"+
                    "<p>"+"role: " + allUsers[i].role.name+"</p>"+
                    "<p>"+"authorities: " + JSON.stringify(allUsers[i].authorities)+"</p>"+
                    "</div><br/>");
            }
        },
        error: getErrorMsg
    });
}

function checkRecipes() {
    var buttonsHere = $("#buttonsHere");
    buttonsHere.children().remove();
    $("#title").remove();
    $("#titleHere").append("<h1 id=\"title\"> Recipes: </h1>");
    buttonsHere.append("<a href=\"#\"><button id=\"backToEditButton\" type=\"button\" onclick=\"backToEdit()\" class=\"secondary\">Back to Edit</button></a>");
    $("#users").hide();
    $.ajax({
        url: "/recipe",
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function(allRecipes) {
            for (i=0;i<allRecipes.length;i++) {
                var htmlString =
                    "<div>"+
                    "<p><h2>"+ "id/name: "+allRecipes[i].id+ " / "+ allRecipes[i].name+ "</h2></p>"+
                    "<p>"+ "description: "+allRecipes[i].description+ "</p>"+
                    "<p>"+ "category: "+JSON.stringify(allRecipes[i].category, null, "\t")+ "</p>"+
                    "<p>"+ "user: "+JSON.stringify(allRecipes[i].user, null, "\t")+ "</p>"+
                    "<p>"+ "prepTime: "+allRecipes[i].prepTime+ "</p>"+
                    "<p>"+ "cookTime: "+allRecipes[i].cookTime+ "</p>";

                if (allRecipes[i].photo != null && allRecipes[i].photo.length>0) {
                    htmlString += "<p>photo: detected</p>";
                } else {
                    htmlString += "<p>photo: n/a</p>";
                }

                if (allRecipes[i].favoriteUsers != null && allRecipes[i].favoriteUsers.length>0) {
                    htmlString += "<p>favoriteUsers: ";
                    for (j=0;j<allRecipes[i].favoriteUsers.length;j++) {
                        htmlString += JSON.stringify(allRecipes[i].favoriteUsers[j], null, "\t");
                    }
                    htmlString += "</p>";
                } else {
                    htmlString += "<p>favoriteUsers: null</p>";
                }

                if (allRecipes[i].ingredients != null && allRecipes[i].ingredients.length>0) {
                    htmlString += "<p>ingredients: ";
                    for (j=0;j<allRecipes[i].ingredients.length;j++) {
                        htmlString += JSON.stringify(allRecipes[i].ingredients[j], null, "\t");
                    }
                    htmlString += "</p>";
                } else {
                    htmlString += "<p>ingredients: null</p>";
                }

                if (allRecipes[i].steps != null && allRecipes[i].steps.length>0) {
                    htmlString += "<p>steps: ";
                    for (j=0;j<allRecipes[i].steps.length;j++) {
                        htmlString += allRecipes[i].steps[j]+"; ";
                    }
                    htmlString += "</p>";
                } else {
                    htmlString += "<p>steps: null</p>";
                }

                htmlString += "</div><br/>";

                $("#bases").append(htmlString);
            }
        },
        error: getErrorMsg
    });
}

function checkCategories() {
    var buttonsHere = $("#buttonsHere");
    buttonsHere.children().remove();
    $("#title").remove();
    $("#titleHere").append("<h1  id=\"title\"> Categories: </h1>");
    buttonsHere.append("<a href=\"#\"><button id=\"backToEditButton\" type=\"button\" onclick=\"backToEdit()\" class=\"secondary\">Back to Edit</button></a>");
    $("#users").hide();
    $.ajax({
        url: "/category",
        type: "GET",
        dataType: "json",
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        success: function(allCategories) {
            for (i=0;i<allCategories.length;i++) {
                $("#bases").append(
                    "<div id='category#"+i+"' class='grid-100 row'>"+
                        "<div class='grid-80'>"+
                            "<p><h2>"+"id/name: " + allCategories[i].id+" / "+allCategories[i].name+"</h2></p>"+
                            "<p>"+"recipes: " + JSON.stringify(allCategories[i].recipes)+"</p>"+
                        "</div>"+
                        "<div class='grid-20'>"+
                            "<p class='label-spacing flush-right'>"+
                                "<a href='#' id='buttonDelete#"+i+"' onclick='deleteCategory(this.id)'><img src='../assets/images/delete.svg' height='12px'/> Delete</a>"+
                            "</p>"+
                        "</div>"+
                        "<div class='clear'></div>"+
                    "</div>"
                );
            }
        },
        error: getErrorMsg
    });
}

function deleteCategory (buttonId) {
    var id = buttonId.split('#').pop();
    console.log("Deleting user (id=" + id + ").");

    $.ajax({
        url: "/category/"+id,
        type: "DELETE",
        dataType: "json",
        contentType: "application/json",
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function () {
            clearFlash();
            printFlashMessage("Category (id="+id+") deleted.", "success");
            document.getElementById("category#"+id).remove();
        },
        error: getErrorMsg
    });
}

function backToEdit() {
    var buttonsHere = $("#buttonsHere");
    $("#title").remove();
    $("#titleHere").append("<h1  id=\"title\"> Admin Panel </h1>");
    buttonsHere.children().remove();
    buttonsHere.append("<a href=\"#\"><button id=\"checkCategoriesButton\" type=\"button\" onclick=\"checkCategories()\" class=\"secondary\">Check Categories</button></a> ");
    buttonsHere.append("<a href=\"#\"><button id=\"checkRecipesButton\" type=\"button\" onclick=\"checkRecipes()\" class=\"secondary\">Check Recipes</button></a> ");
    buttonsHere.append("<a href=\"#\"><button id=\"checkUsersButton\" type=\"button\" onclick=\"checkUsers()\" class=\"secondary\">Check Users</button></a> ");
    buttonsHere.append("<a href=\"#\"><button id=\"addUserButton\" type=\"button\" onclick=\"addUser()\">Add User</button></a>");
    $("#users").show();
    $("#bases").children().remove();
}
