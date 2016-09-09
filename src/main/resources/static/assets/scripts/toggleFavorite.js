function toggleFavorite () {
    var recipeId = document.getElementById("recipeId").innerText;
    console.log("Recipe id = " + recipeId);
    $.ajax({
        url: "/togglefavorite/" + recipeId,
        dataType: "json",
        success: function(data) {
            if (document.getElementById("favoritedSvg") == null) {
                $("#favoriteSvg").remove();
                $("#picHere").append("<img id=\"favoritedSvg\" src=\"../assets/images/favorited.svg\" height=\"16px\" onclick=\"toggleFavorite()\"/>");
                document.getElementById("recipeFavorite").value = true;
            } else {
                $("#favoritedSvg").remove();
                $("#picHere").append("<img id=\"favoriteSvg\" src=\"../assets/images/favorite.svg\" height=\"16px\" onclick=\"toggleFavorite()\"/>");
                document.getElementById("recipeFavorite").value = false;
            }
        }
    });
}
