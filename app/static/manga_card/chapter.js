class Chapter {
    constructor(chapter) {
        this.id = chapter.id;
        this.tome = chapter.tome;
        this.chapter = chapter.tome;
        this.date = chapter.date;

        this.element = this.renderElement();
    }

    renderElement(){
        let chapterHtml = `
            <div class="chapters__item chapter">
                <a class="chapter__link" href="chapters/${this.id}">
                    <div class="chapter__content">
                        Том ${this.tome} Глава ${this.chapter}
                    </div>
                </a>
            </div>
        `;

        let chapterRendered = new DOMParser().parseFromString(chapterHtml, "text/html");
        return chapterRendered.querySelector(".chapter");
    }
}