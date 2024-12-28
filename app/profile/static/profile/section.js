window.addEventListener("load", function () {
    const sections = document.querySelector(".sections");

    const posts = new Section("posts", "Посты", "Абоба");
    const saves = new Section("saves", "Сохранения", "Убуба");

    const sectionsList = new SectionList([posts, saves]);

    sections.replaceWith(sectionsList.render());
})
