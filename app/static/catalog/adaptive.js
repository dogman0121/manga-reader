window.addEventListener("resize", () => {
    if (window.innerWidth <= 700){
        adapt_catalog();
    }
})

if (window.innerWidth <= 700){
    adapt_catalog();
}
function adapt_catalog(){
    const filter = document.querySelector(".filters__title");
    const catalogHeader = document.querySelector(".catalog__header");

    catalogHeader.after(filter);

    filter.addEventListener("click", function (event) {
        document.querySelector(".filters").style.display = "block";
        event.stopPropagation();
    })

    document.body.addEventListener("click", function (event) {
        if (event.target.closest(".filters"))
            return null;
        document.querySelector(".filters").style.display = null;
    })
}