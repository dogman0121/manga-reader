window.addEventListener("load", function () {
    const sections = document.querySelector(".sections");

    const posts = new Section("posts", "Посты", new PostsList([new Post(1, DATA.user, "Ты дурак", new Date())]));
    const saves = new Section("saves", "Закладки", "Убуба");

    const sectionsList = new SectionList([posts, saves]);

    sections.replaceWith(sectionsList.render());
})
