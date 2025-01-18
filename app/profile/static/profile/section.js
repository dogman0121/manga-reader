const PROFILE = parseInt(window.location.href.match(/\d+$/)[0]);

window.addEventListener("load", function () {
    const sections = document.querySelector(".sections");

    const posts = new Section("posts", "Посты", new Posts());
    const saves = new Section("saves", "Закладки", new Saves());

    const sectionsList = new SectionList([posts, saves]);

    sections.replaceWith(sectionsList.render());
})
