window.addEventListener("scroll", function (){

    let titlesGrid = document.querySelector(".catalog__grid");
    let titlesGridCords = titlesGrid.getBoundingClientRect();
    let titlesGridBottom = titlesGridCords.bottom;
    if((titlesGridBottom - document.documentElement.clientHeight) < 10) {
        getTitles(formData, Math.ceil(catalogTitles.length / 20) + 1)
            .then((titles) => {
                let grid = document.querySelector(".catalog__grid");
                catalogTitles = catalogTitles.concat(titles);
                for (let title of titles)
                    grid.innerHTML += createGridBlock(title, gridMode);
            })
    }
});