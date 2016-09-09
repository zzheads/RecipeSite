function getRoleUser() {
    var role = {
        id: 1,
        name: "ROLE_USER"
    }
    return role;
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
        }
    });
}


