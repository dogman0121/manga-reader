let dropDown = document.querySelector(".dropdown-panel");
dropDown.addEventListener("click", function (event){
    if (!dropDown.querySelector(".dropdown-menu").style.display)
        dropDown.querySelector(".dropdown-menu").style.display = "none";
    else
        dropDown.querySelector(".dropdown-menu").style.display = null;
    event.stopPropagation();
});

document.body.addEventListener("click", function (){
    if (!dropDown.querySelector(".dropdown-menu").style.display)
        dropDown.querySelector(".dropdown-menu").style.display = "none";
})