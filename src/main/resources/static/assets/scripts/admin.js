function getRoleUser() {
    var role = {
        id: 1,
        name: "ROLE_USER"
    }
    return role;
}

function getIdByCount (count) {
    return document.getElementById("getIdByCount#"+count).innerText;
}

function getUsernameByCount (count) {
    return document.getElementById("inputUsername#"+count).value;
}

function getPasswordByCount (count) {
    return document.getElementById("inputPassword#"+count).value;
}

function getRoleByCount (count) {
    var role = {
        id: 0, // unknown
        name: document.getElementById("inputRole#"+count).value
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
    var nextIndex = countUsers()+1;
    var html = "";
    html += "<div id=\"user#" + nextIndex + "\" class=\"recipes\">";
    html += "<p id=\"getIdByCount#" + nextIndex + "\" text=\"" + user.id + "\" hidden=\"hidden\"></p>";
    html += "<div class=\"grid-30\">";
    html += "<p>";
    html += "<input id=\"inputUsername#" + nextIndex + "\" value=\"" + user.username + "\"/>";
    html += "</p>";
    html += "</div>";
    html += "<div class=\"grid-30\">";
    html += "<p>";
    html += "<input id=\"inputPassword#" + nextIndex + "\" value=\"" + user.password + "\"/>";
    html += "</p>";
    html += "</div>";
    html += "<div class=\"grid-15\">";
    html += "<p>";
    html += "<input id=\"inputRole#" + nextIndex + "\" value=\"" + user.role.name + "\"/>";
    html += "</p>";
    html += "</div>";
    html += "<div class=\"grid-25\">";
    html += "<div class=\"flush-right\">";
    html += "<p>";
    html += "<a href=\"#\"><button type=\"button\" id=\"buttonDelete#" + nextIndex + "\" onclick=\"deleteUser(this.id)\">Delete</button></a> ";
    html += "<a href=\"#\"><button type=\"button\" id=\"buttonSave#" + nextIndex + "\" onclick=\"saveUser(this.id)\">Save</button></a>";
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
        data: JSON.stringify(newUser, null, "\t"),
        success: function (data) {
            console.log(data);
            console.log(countUsers());
            $("#users").append(toHtml(data));
            clearFlash();
            printFlashMessage("User (id="+data.id+") added.", "success");
        }
    });
}

function deleteUser(buttonId) {
    var count = buttonId.split('#').pop();
    console.log("Deleting user (count=" + count + ", id=" + getIdByCount(count) + ").");

    $.ajax({
        url: "/user/"+getIdByCount(count),
        type: "DELETE",
        dataType: "json",
        success: function () {
            document.getElementById("user#"+count).remove();
            clearFlash();
            printFlashMessage("User (id="+getIdByCount(count)+") deleted.", "success");
        }
    });
}

function saveUser(buttonId) {
    var count = buttonId.split('#').pop();

    var user = {
        id: getIdByCount(count),
        username: getUsernameByCount(count),
        password: getPasswordByCount(count),
        role: getRoleByCount(count)
    };
    console.log("Saving user (id=" + user.id + ").");

    $.ajax({
        url: "/user/"+user.id,
        type: "PUT",
        dataType: "json",
        data: JSON.stringify(user, null, "\t"),
        success: function (data) {
            document.getElementById("user#"+user.id).remove();
            $("#users").append(toHtml(data));
            clearFlash();
            printFlashMessage("User (previous id="+user.id+", new id="+data.id+") saved.", "success");
        }
    });
}

