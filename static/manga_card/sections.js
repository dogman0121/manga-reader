function underLineSection(element) {
    let chosen = document.querySelector(".section-buttons__item_active");

    if (chosen === element)
        return null;
    chosen.classList.remove("section-buttons__item_active");

    element.classList.add("section-buttons__item_active");
}


let sections = document.querySelector("#section-buttons");
let chapters = new Chapters();
let comments = new Comments();
sections.addEventListener("click", chooseSection);
function chooseSection(event){
    if (!event.target.classList.contains("section-buttons__item"))
        return null;

    underLineSection(event.target);

    if (event.target.id === "chapters-button"){
        window.removeEventListener("scroll", scrollLoading);
        chapters.show();
    }

    if (event.target.id === "comments-button") {
        window.addEventListener("scroll", scrollLoading);
        comments.show();
    }
}

function scrollLoading() {
    let commentsList = document.querySelector(".comments__list");
    let commentsListCords = commentsList.getBoundingClientRect();
    let commentListBottom = commentsListCords.bottom + window.scrollY;
    if(Math.abs(commentListBottom - (window.scrollY + document.documentElement.clientHeight)) < 10)
        comments.load();
}