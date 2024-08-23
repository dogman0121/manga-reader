let dropDown = document.querySelector(".dropdown-panel");
dropDown.addEventListener("click", function (event){
    if (dropDown.querySelector(".dropdown-menu").hidden)
        dropDown.querySelector(".dropdown-menu").hidden = null;
    else
        dropDown.querySelector(".dropdown-menu").hidden = true;
    event.stopPropagation();
});

document.body.addEventListener("click", function (){
    if (!dropDown.querySelector(".dropdown-menu").hidden)
        dropDown.querySelector(".dropdown-menu").hidden = true;
})