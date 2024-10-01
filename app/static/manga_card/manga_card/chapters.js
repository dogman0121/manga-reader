class Chapters {
    constructor() {
        this.chapters = [];
    }
    show(){
        let chaptersBlockHtml;
        if(this.chapters.length !== 0) {
            chaptersBlockHtml = `
                <div id="chapters" class="section">
                    <div class="chapters__header chapters-header">
                        Список глав
                        <div class="chapters-header__buttons">
                            <img class="add-chapter" src="/static/manga_card/manga_card/images/plus.png">
                            <img id="chapters__filter" src="/static/manga_card/manga_card/images/filter.svg">
                        </div>
                    </div>
                    <div class="chapters__list"></div>
                </div>
            `;
        }
        else {
            if (this.chaptersNotExist){
                chaptersBlockHtml = `
                    <div id="chapters" class="section">
                        <div class="no-chapters">
                            <h1 class="no-chapters__header">
                            Глав нет
                            </h1>
                            <p class="no-chapters__text">Автор еще не добавил ни одной главы</p>
                            <a class="no-chapters__add-link"><div class="no-chapters__add-button">Добавить</div></a>
                        </div>
                    </div>
                `;
            }
            else {
                fetch("../api/chapters?" + new URLSearchParams({title_id: title_id}))
                    .then(response => response.json())
                    .then(chapters => {
                        if(chapters.length === 0)
                            this.chaptersNotExist = true;
                        else{
                            let chaptersObject = chapters.map((chapter) => new Chapter(chapter));
                            this.chapters = this.chapters.concat(chaptersObject);
                        }

                        this.show();
                    })
                return null;
            }
        }
        let chaptersBlockRendered = new DOMParser().parseFromString(chaptersBlockHtml, "text/html");
        let chaptersBlockElement = chaptersBlockRendered.querySelector("#chapters");

        if(this.chapters.length !== 0) {
            let chaptersList = chaptersBlockElement.querySelector(".chapters__list");
            for(let chapter of this.chapters)
                chaptersList.append(chapter.element);
        }
        //console.log(chaptersBlockElement);
        let section = document.querySelector(".section");
        section.replaceWith(chaptersBlockElement);
    }
}

let chapters = new Chapters();