function getRoleUser() {
    var role = {
        id: 1,
        name: "ROLE_USER"
    }
    return role;
}

function getUsernameById (id) {
    return document.getElementById("inputUsername#"+id).value;
}

function getPasswordById (id) {
    return document.getElementById("inputPassword#"+id).value;
}

function getRoleById (id) {
    var role = {
        id: 0, // unknown
        name: document.getElementById("inputRole#"+id).value
    };
    return role;
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
        success: function (data) {
            console.log(data);
            console.log(countUsers());
            $("#users").append(toHtml(data));
            clearFlash();
            printFlashMessage("User (id="+data.id+") added.", "success");
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
        success: function (data) {
            document.getElementById("user#"+user.id).remove();
            $("#users").append(toHtml(data));
            clearFlash();
            printFlashMessage("User (id="+data.id+") saved.", "success");
        },
        error: getErrorMsg
    });
}

function checkUsers() {
    $("#buttonsHere").children().remove();
    $("#title").remove();
    $("#titleHere").append("<h1  id=\"title\"> Users: </h1>");
    $("#buttonsHere").append("<a href=\"#\"><button id=\"backToEditButton\" type=\"button\" onclick=\"backToEdit()\" class=\"secondary\">Back to Edit</button></a>");
    $("#users").hide();
    $.ajax({
        url: "/user",
        type: "GET",
        dataType: "json",
        success: function(data) {
            for (i=0;i<data.length;i++) {
                $("#bases").append(
                    "<div>"+
                    "<p><h2>"+"id/username: " + data[i].id+" / "+data[i].username+"</h2></p>"+
                    "<p>"+"password: " + data[i].password+"</p>"+
                    "<p>"+"role: " + data[i].role.name+"</p>"+
                    "<p>"+"authorities: " + JSON.stringify(data[i].authorities)+"</p>"+
                    "</div><br/>");
            }
        },
        error: getErrorMsg
    });
}

function checkRecipes() {
    $("#buttonsHere").children().remove();
    $("#title").remove();
    $("#titleHere").append("<h1 id=\"title\"> Recipes: </h1>");
    $("#buttonsHere").append("<a href=\"#\"><button id=\"backToEditButton\" type=\"button\" onclick=\"backToEdit()\" class=\"secondary\">Back to Edit</button></a>");
    $("#users").hide();
    $.ajax({
        url: "/recipe",
        type: "GET",
        dataType: "json",
        success: function(data) {
            for (i=0;i<data.length;i++) {
                var htmlString =
                    "<div>"+
                    "<p><h2>"+ "id/name: "+data[i].id+ " / "+ data[i].name+ "</h2></p>"+
                    "<p>"+ "description: "+data[i].description+ "</p>"+
                    "<p>"+ "category: "+JSON.stringify(data[i].category, null, "\t")+ "</p>"+
                    "<p>"+ "user: "+JSON.stringify(data[i].user, null, "\t")+ "</p>"+
                    "<p>"+ "prepTime: "+data[i].prepTime+ "</p>"+
                    "<p>"+ "cookTime: "+data[i].cookTime+ "</p>";

                if (data[i].photo != null && data[i].photo.length>0) {
                    htmlString += "<p>photo: detected</p>";
                } else {
                    htmlString += "<p>photo: n/a</p>";
                }

                if (data[i].favoriteUsers != null && data[i].favoriteUsers.length>0) {
                    htmlString += "<p>favoriteUsers: ";
                    for (j=0;j<data[i].favoriteUsers.length;j++) {
                        htmlString += JSON.stringify(data[i].favoriteUsers[j], null, "\t");
                    }
                    htmlString += "</p>";
                } else {
                    htmlString += "<p>favoriteUsers: null</p>";
                }

                if (data[i].ingredients != null && data[i].ingredients.length>0) {
                    htmlString += "<p>ingredients: ";
                    for (j=0;j<data[i].ingredients.length;j++) {
                        htmlString += JSON.stringify(data[i].ingredients[j], null, "\t");
                    }
                    htmlString += "</p>";
                } else {
                    htmlString += "<p>ingredients: null</p>";
                }

                if (data[i].steps != null && data[i].steps.length>0) {
                    htmlString += "<p>steps: ";
                    for (j=0;j<data[i].steps.length;j++) {
                        htmlString += data[i].steps[j]+"; ";
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
    $("#buttonsHere").children().remove();
    $("#title").remove();
    $("#titleHere").append("<h1  id=\"title\"> Categories: </h1>");
    $("#buttonsHere").append("<a href=\"#\"><button id=\"backToEditButton\" type=\"button\" onclick=\"backToEdit()\" class=\"secondary\">Back to Edit</button></a>");
    $("#users").hide();
    $.ajax({
        url: "/category",
        type: "GET",
        dataType: "json",
        headers: {"X-CSRF-Token": $("meta[name='_csrf']").attr("content")},
        success: function(data) {
            for (i=0;i<data.length;i++) {
                $("#bases").append(
                    "<div>"+
                    "<p><h2>"+"id/name: " + data[i].id+" / "+data[i].name+"</h2></p>"+
                    "<p>"+"recipes: " + JSON.stringify(data[i].recipes)+"</p>"+
                    "</div><br/>");
            }
        },
        error: getErrorMsg
    });
}

function backToEdit() {
    $("#title").remove();
    $("#titleHere").append("<h1  id=\"title\"> Admin Panel </h1>");
    $("#buttonsHere").children().remove();
    $("#buttonsHere").append("<a href=\"#\"><button id=\"checkCategoriesButton\" type=\"button\" onclick=\"checkCategories()\" class=\"secondary\">Check Categories</button></a> ");
    $("#buttonsHere").append("<a href=\"#\"><button id=\"checkRecipesButton\" type=\"button\" onclick=\"checkRecipes()\" class=\"secondary\">Check Recipes</button></a> ");
    $("#buttonsHere").append("<a href=\"#\"><button id=\"checkUsersButton\" type=\"button\" onclick=\"checkUsers()\" class=\"secondary\">Check Users</button></a> ");
    $("#buttonsHere").append("<a href=\"#\"><button id=\"addUserButton\" type=\"button\" onclick=\"addUser()\">Add User</button></a>");
    $("#users").show();
    $("#bases").children().remove();
}
