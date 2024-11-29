window.addEventListener("resize", () => {
    if (window.innerWidth <= 700){
        adapt_header();
    }
})

if (window.innerWidth <= 700){
    adapt_header();
}
function adapt_header(){
    let navCatalog = document.querySelector(".nav__catalog");
    if (navCatalog)
        navCatalog.remove();
    // navCatalog.innerHTML = "<img class='nav__icon' src='/static/header/images/catalog.png'>"

    let navSearch = document.querySelector(".nav__search");
    navSearch.innerHTML = `
        <svg class="nav__icon" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

    const rightNav = document.querySelector(".nav-right__nav");
    rightNav.prepend(navSearch);
}