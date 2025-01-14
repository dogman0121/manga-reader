window.addEventListener("resize", adaptManga);
window.addEventListener("load", adaptManga);
let mangaAdaptiveState = 0;

function adaptManga() {
    if (window.innerWidth < 1096 && mangaAdaptiveState > 1) {
        mangaAdaptiveState = 1;

        const similar = document.querySelector("#similar");
        const mangaInfo = document.querySelector("#manga-info");
        mangaInfo.append(similar);
    }
    if (window.innerWidth < 872 && mangaAdaptiveState > 2) {
        mangaAdaptiveState = 2;

        // Изменение кнопки чтения
        if (document.querySelector(".bottom-panel"))
            return;
        const bottomPanel = document.createElement("div");
        bottomPanel.className = "bottom-panel";

        const readButton = document.querySelector(".read-button");

        document.body.append(bottomPanel)
        bottomPanel.append(readButton);
        // Изменение кнопки рейтинга
        const rating = document.querySelector(".rating__button");
        const poster = document.querySelector("#poster");
        poster.append(rating);
    }
    if (window.innerWidth < 700 && mangaAdaptiveState > 3){
        mangaAdaptiveState = 3;

        // Update buttons panel
        const bottomPanel = document.querySelector(".bottom-panel");
        const editButton = document.querySelector(".edit-button");
        const saveButton = document.querySelector(".save-button");

        const editButtonInner = editButton.querySelector(".edit-button__button");
        editButtonInner.innerHTML = `
            <svg class="edit-button__image" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title/><g id="Complete"><g id="edit"><g><path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g></g>
            </svg>
        `;

        const saveButtonInner = saveButton.querySelector(".save-button__button");
        saveButtonInner.innerHTML = `
            <svg class="save-button__image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.75 20.75C17.5974 20.747 17.4487 20.702 17.32 20.62L12 16.91L6.68 20.62C6.56249 20.6915 6.42757 20.7294 6.29 20.7294C6.15243 20.7294 6.01751 20.6915 5.9 20.62C5.78491 20.5607 5.68741 20.4722 5.61722 20.3634C5.54703 20.2546 5.50661 20.1293 5.5 20V6C5.5 5.27065 5.78973 4.57118 6.30546 4.05546C6.82118 3.53973 7.52065 3.25 8.25 3.25H15.75C16.4793 3.25 17.1788 3.53973 17.6945 4.05546C18.2103 4.57118 18.5 5.27065 18.5 6V20C18.5005 20.1362 18.4634 20.2698 18.3929 20.3863C18.3223 20.5027 18.2209 20.5974 18.1 20.66C17.9927 20.7189 17.8724 20.7498 17.75 20.75ZM12 15.25C12.1532 15.2484 12.3033 15.2938 12.43 15.38L17 18.56V6C17 5.66848 16.8683 5.35054 16.6339 5.11612C16.3995 4.8817 16.0815 4.75 15.75 4.75H8.25C7.91848 4.75 7.60054 4.8817 7.36612 5.11612C7.1317 5.35054 7 5.66848 7 6V18.56L11.57 15.38C11.6967 15.2938 11.8468 15.2484 12 15.25Z" fill="#000000"/>
            </svg>
        `;

        bottomPanel.prepend(editButton);
        bottomPanel.append(saveButton);

        // Update main content
        const poster = document.querySelector("#poster");
        const names = document.querySelector("#manga-names");

        const stats = document.querySelector("#stats");

        const sections = document.querySelector(".sections");
        poster.after(sections);
        poster.after(stats);
        poster.after(names);

        const info = document.createElement("div");
        info.className = "information";
        console.log(info);

        const description = document.querySelector("#about");
        const genres = document.querySelector("#genres");
        const similar = document.querySelector("#similar");
        info.append(description);
        info.append(genres);
        info.append(similar);

        const infoSection = new Section("info", "Информация", info);

        sectionsList.addFront(infoSection);
        infoSection.choose();

    }
}