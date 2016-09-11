function printFlashMessage (message, status) {
    var htmlString = "<div class=\"grid-100 row controls\">" +
        "<div class=\"message\">" +
        "<div class=\"flash " + status +"\">" +
        "<p>" +
        "<a href=\"#\"><span onclick=\"clearFlash()\" class=\"flashspan\"> [X]</span></a>" +
        message +
        "</p>" +
        "</div>" +
        "</div>" +
        "</div>";

    $("#flashMessage").append(htmlString);
}

function clearFlash() {
    $("#flashMessage").children().remove();
}

function getErrorMsg (jqXHR, textStatus, errorThrown) {
    clearFlash();
    printFlashMessage(jqXHR.responseText, "failure");
}
