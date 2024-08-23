let gridMode = 1;
let catalogGrid = document.querySelector(".catalog__grid");
let buttonBlocks = document.querySelector(".sortings__blocks");
let buttonLines = document.querySelector(".sortings__lines");

buttonBlocks.addEventListener('click', function (){
    if (gridMode === 1)
        return null;


    catalogGrid.classList.remove("catalog__grid_rectangle");
    catalogGrid.classList.add("catalog__grid_square");
    catalogGrid.innerHTML = "";
    for(let title of catalogTitles) {
        catalogGrid.innerHTML += createGridBlock(title, 1);
    }
    buttonLines.classList.remove("sortings__icon-block_active");
    gridMode = 1;
    buttonBlocks.classList.add("sortings__icon-block_active");
})


buttonLines.addEventListener('click', function (){
    if (gridMode === 2)
        return null;

    catalogGrid.classList.remove("catalog__grid_square");
    catalogGrid.classList.add("catalog__grid_rectangle");
    catalogGrid.innerHTML = "";
    for(let title of catalogTitles) {
        catalogGrid.innerHTML += createGridBlock(title, 2);
    }
    buttonBlocks.classList.remove("sortings__icon-block_active");
    gridMode = 2;
    buttonLines.classList.add("sortings__icon-block_active");
})