const sectionsList = new SectionList();

window.addEventListener("load", function () {
    const sections = document.querySelector(".sections");

    const chapterSectionContent = DATA.title.translators.length ? new ChaptersBlock(DATA.title.translators) : new NoChaptersBlock();
    const chapterSection = new Section("chapters", "Главы", chapterSectionContent);
    sectionsList.addBack(chapterSection);
    chapterSection.choose();

    const commentSection = new Section("comments", "Комментарии", new TitleCommentBlock());
    sectionsList.addBack(commentSection);

    sections.replaceWith(sectionsList.render());
})