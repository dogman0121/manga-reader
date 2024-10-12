window.onresize = () => {
    if (window.innerWidth <= 700){
        adapt_smartphone();
    }
}

function adapt_smartphone(){
    let navCatalog = document.querySelector(".nav__catalog");
    navCatalog.remove();
    // navCatalog.innerHTML = "<img class='nav__icon' src='/static/header/images/catalog.png'>"

    let navSearch = document.querySelector(".nav__search");
    navSearch.innerHTML = "<img class='nav__icon' src='/static/header/images/search.svg'>"

    const rightNav = document.querySelector(".nav-right__nav");
    rightNav.prepend(navSearch);
}