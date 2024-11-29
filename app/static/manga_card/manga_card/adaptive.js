window.addEventListener("resize", () => {
    if (window.innerWidth <= 700){
        adapt_manga_page();
    }
})

if (window.innerWidth <= 700){
    adapt_manga_page();
}

function adapt_buttons() {
    const readButton = document.querySelector("#read-button");
    const saveButton = document.querySelector(".save-button");
    const editButton = document.querySelector(".edit-button");

    const buttonsPanel = document.createElement("div");
    buttonsPanel.className = "buttons-panel";

    buttonsPanel.append(editButton);
    buttonsPanel.append(readButton);
    buttonsPanel.append(saveButton);

    document.querySelector("#left-side").append(buttonsPanel);
}

function adapt_manga_page(){
    const leftSide = document.querySelector("#left-side");
    const mangaNames = document.querySelector("#manga-names");
    const stats = document.querySelector("#stats");
    const sectionButtons = document.querySelector(".sections__buttons");
    const sections = document.querySelector(".sections");
    const sectionContent = document.querySelector(".sections__content");

    if (!sectionButtons.querySelector("#info-button")) {
        sectionButtons.innerHTML = `
            <div class="sections-buttons__item" id="info-button">Информация</div>
        ` + sectionButtons.innerHTML;
        underLineSection(document.querySelector("#info-button"));
    }

    if (!document.querySelector("#info")) {
        let infoSection = document.createElement("div");
        infoSection.classList.add("section");
        infoSection.id = "info";

        const description = document.querySelector("#description");
        const about = document.querySelector("#about");
        const genresList = document.querySelector("#genres-list");
        const similar = document.querySelector("#similar");
        infoSection.append(description);
        infoSection.append(about);
        infoSection.append(genresList);
        infoSection.append(similar);
        sectionContent.append(infoSection);
        chooseSection("info");
    }

    leftSide.append(mangaNames);
    leftSide.append(stats);
    leftSide.append(sectionButtons);
    leftSide.append(sections);
}