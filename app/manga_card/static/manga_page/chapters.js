class ChaptersBlock extends Component{
    constructor(data) {
        super();

        this.chaptersTranslators = new ChapterTranslatorsList(data);
        this.chaptersList = new State(new ChaptersList(this.chaptersTranslators.translators[0]));
    }

    html() {
        return `
            <div id="chapters" class="section section_selected">
                {{ this.chaptersTranslators }}
                <div class="chapters__header chapters-header">
                    Список глав
                    <div class="chapters-header__buttons">
                        <a href="/chapters/add?title_id=${DATA.title.id}">
                            <svg class="chapters-header__icon add-chapter" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12H20M12 4V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                        <svg class="chapters-header__icon" id="filter-button" fill="currentColor" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11,4.5a1,1,0,0,1,1-1h9a1,1,0,0,1,0,2H12A1,1,0,0,1,11,4.5Zm1,6h9a1,1,0,0,0,0-2H12a1,1,0,0,0,0,2Zm0,5h9a1,1,0,0,0,0-2H12a1,1,0,0,0,0,2Zm0,5h9a1,1,0,0,0,0-2H12a1,1,0,0,0,0,2ZM6,2A1,1,0,0,0,5,3V18.586L3.707,17.293a1,1,0,0,0-1.414,1.414l3,3a1,1,0,0,0,1.416,0l3-3a1,1,0,0,0-1.414-1.414L7,18.586V3A1,1,0,0,0,6,2Z"/></svg>
                    </div>
                </div> 
                {{ this.chaptersList }}
            </div>
        `
    }

    events() {
        this.chaptersTranslators.addEventListener("translatorSwitched", this.onTranslatorSwitched.bind(this));
        this.element.querySelector("#filter-button").addEventListener("click",
            this.chaptersList.value.reOrder.bind(this.chaptersList));
    }

    onTranslatorSwitched(event) {
        this.chaptersList.set(new ChaptersList(event.detail.translator));
    }
}

class NoChaptersBlock extends Component {
    html() {
        return `
            <div id="chapters" class="section section_selected">
                <div class="no-chapters">
                    <h1 class="no-chapters__header">Глав нет</h1>
                    <p class="no-chapters__text">Автор еще не добавил ни одной главы</p>
                    {{ DATA.user.team_id ? new AddChapterButton() : "" }}
                </div>
            </div>
        `
    }
}

class AddChapterButton extends Component {
    html() {
        return `
            <a class="no-chapters__add-link" href="/chapters/add?title_id=${DATA.title.id}">
                <button class="no-chapters__add-button">Добавить</button>
            </a>
        `
    }
}

class ChapterTranslatorsList extends Component {
    translators = [];

    constructor(data = []) {
        super();

        this.translators = data.map(team => new ChapterTranslator(team));
        this.selectedTranslator = this.translators[0];
        this.selectedTranslator.selected = true;
    }

    html() {
        return `
            <div class="translators-list">
                {{ this.translators }}
            </div>
        `
    }

    events() {
        for(let translator of this.translators)
            translator.addEventListener("click", this.onSelect.bind(this));
    }

    onSelect(event) {
        this.selectedTranslator.unSelect();
        this.selectedTranslator = event.detail.translator;
        this.selectedTranslator.select();
        this.dispatchEvent(new CustomEvent("translatorSwitched", {detail: event.detail}));
        this.dispatchEvent(new CustomEvent("translatorSwitched", {detail: event.detail}));
    }

}

class ChapterTranslator extends Component {
    constructor(data) {
        super();

        this.id = data.id;
        this.name = data.name;
        this.poster = data.poster;
        this.selected = data.selected;
        this.chapters = data.chapters;
    }

    html() {
        return `
            <div class="translator ${this.selected ? "translator_selected" : ""}">
                <img class="translator__image" src="${this.poster}">
                <div class="translator__description">
                    <div class="translator__name">{{ this.name }}</div>
                </div>
            </div>
        `
    }

    events(element) {
        this.element.addEventListener("click", this.onClick.bind(this));
    }

    onClick() {
        this.dispatchEvent(new CustomEvent("click", {detail: {translator: this}}));
    }

    select() {
        this.element.classList.add("translator_selected");
    }

    unSelect() {
        this.element.classList.remove("translator_selected");
    }
}

class ChaptersList extends Component {
    chapters = [];

    constructor(team) {
        super();

        if (!team)
            return;

        this.chapters = team.chapters.map(chapter => new Chapter(chapter, team.id));
    }

    html() {
        return `
            <div class="chapters__list">
                {{ this.chapters }}
            </div>
        `
    }

    reOrder() {
        let chapters = this.element.querySelectorAll(".chapter");
        this.element.innerHTML = "";
        chapters.forEach(chapter => this.element.prepend(chapter));
    }

}

class Chapter extends Component {
    constructor(chapter, team_id) {
        super();
        this.id = chapter.id;
        this.chapter = chapter.chapter;
        this.tome = chapter.tome;
        this.team_id = team_id;
    }

    html() {
        return `
            <div class="chapters__item chapter" data-id="${ this.id }">
                <a class="chapter__link" href="/chapters/${ this.id }">
                    <div class="chapter__content">
                        Том {{ this.tome }} Глава {{ this.chapter }}
                        <div class="chapter__icons">
                            {{ DATA.user.team_id === this.team_id ? new EditChapterSection(this) : "" }}
                        </div>
                    </div>
                </a>
            </div>
        `
    }
}

class EditChapterSection extends Component {
    constructor(chapter) {
        super();

        this.chapter = chapter
    }
    html() {
        return `
            <div class="chapter__links">
                <a class="chapter-icon__link chapter__link" href="/chapters/${this.chapter.id}/edit">
                    <svg class="chapter__icon" width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.29289 3.70711L1 11V15H5L12.2929 7.70711L8.29289 3.70711Z" fill="currentColor"/>
                        <path d="M9.70711 2.29289L13.7071 6.29289L15.1716 4.82843C15.702 4.29799 16 3.57857 16 2.82843C16 1.26633 14.7337 0 13.1716 0C12.4214 0 11.702 0.297995 11.1716 0.828428L9.70711 2.29289Z" fill="currentColor"/>
                    </svg>
                </a>
                <a class="chapter-icon__link chapter__link" href="/chapters/${this.chapter.id}/delete">
                    <svg class="chapter__icon" fill="currentColor" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 512 512" xml:space="preserve">
                        <g>
                            <g>
                            <path d="M307.2,0H204.8c-4.71,0-8.533,5.086-8.533,11.375V25.6c0,4.71,3.823,8.533,8.533,8.533h102.4
                            c4.71,0,8.533-3.823,8.533-8.533V11.375C315.733,5.086,311.91,0,307.2,0z"/>
                            </g>
                        </g>
                        <g>
                            <g>
                            <path d="M477.867,51.2H315.733H196.267H34.133c-4.71,0-8.533,3.396-8.533,7.586v53.094c0,4.19,3.823,7.586,8.533,7.586h443.733
                            c4.719,0,8.533-3.396,8.533-7.586V58.786C486.4,54.596,482.586,51.2,477.867,51.2z"/>
                            </g>
                        </g>
                        <g>
                            <g>
                            <path d="M450.039,136.533H61.961c-4.932,0-8.832,4.164-8.516,9.088l23.373,358.4c0.299,4.489,4.019,7.979,8.516,7.979h341.333
                            c4.497,0,8.226-3.49,8.516-7.979l23.373-358.4C458.88,140.698,454.972,136.533,450.039,136.533z M170.667,418.133
                            c0,4.719-3.823,8.533-8.533,8.533c-4.71,0-8.533-3.814-8.533-8.533V196.267c0-4.719,3.823-8.533,8.533-8.533
                            c4.71,0,8.533,3.814,8.533,8.533V418.133z M264.533,418.133c0,4.719-3.823,8.533-8.533,8.533s-8.533-3.814-8.533-8.533V196.267
                            c0-4.719,3.823-8.533,8.533-8.533s8.533,3.814,8.533,8.533V418.133z M358.4,418.133c0,4.719-3.823,8.533-8.533,8.533
                            s-8.533-3.814-8.533-8.533V196.267c0-4.719,3.823-8.533,8.533-8.533s8.533,3.814,8.533,8.533V418.133z"/>
                            </g>
                        </g>
                    </svg>
                </a>
            </div>
        `
    }
}

const a = document.querySelector("#chapters");

let translators;
if (DATA.title.translators.length)
    translators = new ChaptersBlock(DATA.title.translators);
else
    translators = new NoChaptersBlock();

a.replaceWith(translators.render());