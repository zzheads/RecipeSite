function toggleInputMode(elementId) {
    var element = document.getElementById(elementId);
    var elementRoot = document.getElementById(elementId+"Root");
    var newElementHtmlString;
    console.log(element);
    console.log(elementRoot);
    if (element.nodeName == "P") {
        newElementHtmlString = "<p><input id='"+elementId+"' value='"+element.innerText+"' onkeypress='return toggleTextMode(event, this.id)'/></p>";
        element.remove();
        elementRoot.innerHTML = newElementHtmlString;
    }
}

function toggleTextMode(event, elementId) {
    if (event.keyCode == 13) {
        var element = document.getElementById(elementId);
        var elementRoot = document.getElementById(elementId+"Root");
        var newElementHtmlString;
        console.log(element);
        console.log(elementRoot);
        if (element.nodeName == "INPUT") {
            newElementHtmlString = "<p id='"+elementId+"' onclick='toggleInputMode(this.id)'>"+element.value+"</p>";
            element.remove();
            elementRoot.innerHTML = newElementHtmlString;
        }
        return false;
    }
}