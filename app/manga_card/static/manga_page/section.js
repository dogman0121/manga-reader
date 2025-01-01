window.addEventListener("load", function () {
    const sections = document.querySelector(".sections");

    const chapterSectionContent = DATA.title.translators.length ? new ChaptersBlock(DATA.title.translators) : new NoChaptersBlock();
    const chapterSection = new Section("chapters", "Главы", chapterSectionContent);

    const commentsSection = new Section("comments", "Комментарии", new TitleCommentBlock());

    const sectionsList = new SectionList([chapterSection, commentsSection]);

    sections.replaceWith(sectionsList.render());
})