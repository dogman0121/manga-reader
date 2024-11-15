let catalogPage = 1;
let ended = true;


window.addEventListener("scroll", function (){

    let titlesGrid = document.querySelector(".catalog__grid");
    let titlesGridCords = titlesGrid.getBoundingClientRect();
    let titlesGridBottom = titlesGridCords.bottom;
    if((titlesGridBottom - document.documentElement.clientHeight) < 10) {
        if (ended){
            ended = false;
            getTitles(formData, ++catalogPage)
                .then((titles) => {
                    let grid = document.querySelector(".catalog__grid");
                    catalogTitles = catalogTitles.concat(titles);
                    for (let title of titles)
                        grid.innerHTML += createGridBlock(title, gridMode);
                })
                .then(() => {ended = true});
        }
    }
});