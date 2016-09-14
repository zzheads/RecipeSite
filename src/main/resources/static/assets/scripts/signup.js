function submitForm() {
    var username = document.getElementById("username").value;
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;

    var role = {
        id: 0,
        name: "ROLE_USER"
    };

    var newUser = {
        id: 0,
        username: document.getElementById("username").value,
        password: document.getElementById("password1").value,
        role: role,
        enabled: true
    };

    var existedUsernames = [], index = 0;
    while (true) {
        if (document.getElementById("user"+index) == null)
            break;
        existedUsernames.push(document.getElementById("user"+index).innerText);
        index++;
    }
    var usernameExist = false;
    for (i=0;i<existedUsernames.length;i++) {
        if (existedUsernames[i] == username) {
            usernameExist = true;
        }
    }
    if (usernameExist) {
        // Error message, username already existed, edit again
        clearFlash();
        printFlashMessage("Username already existed.", "failure");
        return;
    }
    if (password1 !== password2) {
        // Error message, passwords must be same, edit again
        clearFlash();
        printFlashMessage("Passwords entered must be the same.", "failure");
        return;
    }

    // Create new user
    $.ajax({
        url: "/user",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(newUser, null, "\t"),
        headers: {"X-CSRF-Token" : $("meta[name='_csrf']").attr("content")},
        success: function (data) {
            clearFlash();
            printFlashMessage("Registered new user with username ("+data.username+") and password ("+data.password+").", "success");
        },
        error: getErrorMsg
    });
}
