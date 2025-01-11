window.addEventListener("resize", adaptManga);
window.addEventListener("load", adaptManga);
window.addEventListener("DOMContentLoaded", adaptManga);

function adaptManga() {
    if (window.innerWidth < 1096) {
        const similar = document.querySelector("#similar");
        const mangaInfo = document.querySelector("#manga-info");
        mangaInfo.append(similar);
    }
    if (window.innerWidth < 872) {
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
}