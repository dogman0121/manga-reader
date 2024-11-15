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
                            <img class="add-chapter" src="/static/manga_card/manga_card/images/plus.png">
                        </a>
                        <img id="filter-button" src="/static/manga_card/manga_card/images/filter.svg">
                    </div>
                </div> 
                {{ this.chaptersList }}
            </div>
        `
    }

    events() {
        this.chaptersTranslators.addEventListener("translatorSwitched", this.onTranslatorSwitched.bind(this));
    }

    onTranslatorSwitched(event) {
        this.chaptersList.set(new ChaptersList(event.detail.translator.chapters));
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
                <div class="no-chapters__add-button">Добавить</div>
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
        this.dispatchEvent(new CustomEvent("translatorSwitched", {detail: {translator: event.detail.translator}}));
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

        console.log(team);
        this.chapters = team.chapters.map(chapter => new Chapter(chapter, team.id));
    }

    html() {
        return `
            <div class="chapters__list">
                {{ this.chapters }}
            </div>
        `
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
                    <img class="chapter__icon" src="/manga/static/images/pencil.svg">
                </a>
                <a class="chapter-icon__link chapter__link" href="/chapters/${this.chapter.id}/delete">
                    <img class="chapter__icon" src="/manga/static/images/garbage.svg">
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