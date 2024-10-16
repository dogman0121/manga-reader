function underLineSection(element) {
    let chosen = document.querySelector(".section-buttons__item_active");

    if (chosen === element)
        return null;
    chosen.classList.remove("section-buttons__item_active");

    element.classList.add("section-buttons__item_active");
}


let sections = document.querySelector("#section-buttons");

sections.addEventListener("click", (event) => {
    if (!event.target.classList.contains("section-buttons__item"))
        return null;

    if (event.target.id === "chapters-button")
        chooseSection("chapters");
    if (event.target.id === "comments-button")
        chooseSection("comments");
    if (event.target.id === "info-button")
        chooseSection("info");
    underLineSection(event.target);
});

async function chooseSection(sectionName){

    if (sectionName === "chapters"){
        if (!document.querySelector("#chapters"))
            chapters.show();
        document.querySelector(".section_selected").classList.remove("section_selected");
        document.querySelector("#chapters").classList.add("section_selected");
        window.removeEventListener("scroll", loadCommentsOnScroll);
    }

    if (sectionName === "comments") {
        if (!document.querySelector("#comments"))
            comments.show();
        document.querySelector(".section_selected").classList.remove("section_selected");
        document.querySelector("#comments").classList.add("section_selected");
        window.addEventListener("scroll", loadCommentsOnScroll);
    }

    if (sectionName === "info"){
        document.querySelector(".section_selected").classList.remove("section_selected");
        document.querySelector("#info").classList.add("section_selected");
        window.removeEventListener("scroll", loadCommentsOnScroll);
    }
}