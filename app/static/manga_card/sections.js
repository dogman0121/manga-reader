function underLineSection(element) {
    let chosen = document.querySelector(".section-buttons__item_active");

    if (chosen === element)
        return null;
    chosen.classList.remove("section-buttons__item_active");

    element.classList.add("section-buttons__item_active");
}


let sections = document.querySelector("#section-buttons");

sections.addEventListener("click", chooseSection);
function chooseSection(event){
    if (!event.target.classList.contains("section-buttons__item"))
        return null;

    underLineSection(event.target);

    if (event.target.id === "chapters-button"){
        chapters.show();
        window.removeEventListener("scroll", loadCommentsOnScroll);
    }

    if (event.target.id === "comments-button") {
        comments.show();
        window.addEventListener("scroll", loadCommentsOnScroll);
    }
}