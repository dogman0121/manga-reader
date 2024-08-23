let sortingsButton = document.querySelector(".sortings__block");
let sortingOptions = document.querySelector(".sortings__options");
let selectLabel = sortingsButton.querySelector(".sortings__text");
let openedSortings = false;

sortingsButton.addEventListener("click", function(event) {
    sortingOptions.hidden = null;
    openedSortings = true;
    event.stopPropagation();
})

sortingOptions.addEventListener("click", function(event) {
    if (event.target.classList.contains("sortings-list__option_selected"))
        return null;

    let selectedOption = sortingOptions.querySelector(".sortings-list__option_selected");
    selectedOption.classList.remove("sortings-list__option_selected");

    event.target.classList.add("sortings-list__option_selected");
    selectLabel.textContent = event.target.textContent;

    editCatalog("sort_by", event.target.dataset.value, 3);

})

document.body.addEventListener("click", function(event) {
    if (openedSortings){
        sortingOptions.hidden = true;
        openedSortings = false;
    }
})