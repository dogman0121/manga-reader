window.addEventListener("resize", adaptManga);
window.addEventListener("load", adaptManga);
let mangaAdaptiveState = 1;

function adaptManga() {
    if (window.innerWidth < 1096 && mangaAdaptiveState === 1) {
        mangaAdaptiveState = 2;

        const similar = document.querySelector("#similar");
        const mangaInfo = document.querySelector("#manga-info");
        mangaInfo.append(similar);
    }
    if (window.innerWidth < 872 && mangaAdaptiveState === 2) {
        mangaAdaptiveState = 3;
        // Изменение кнопки рейтинга
        const rating = document.querySelector(".rating-button");
        const poster = document.querySelector("#poster");
        poster.append(rating);
    }
    if (window.innerWidth < 700 && mangaAdaptiveState === 3){
        mangaAdaptiveState = 4;

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

        const description = document.querySelector("#about");
        const genres = document.querySelector("#genres");
        const similar = document.querySelector("#similar");
        info.append(description);
        info.append(genres);
        info.append(similar);

        const infoSection = new Section("info", "Информация", info);

        document.querySelector("#description").remove();

        sectionsList.addFront(infoSection);
        infoSection.choose();

    }
}