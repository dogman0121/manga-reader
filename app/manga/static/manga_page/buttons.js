function debounce(func, timeout){
    return function call(...args){
        let previousCall = this.lastCall;

        this.lastCall = Date.now();

        if (previousCall && (this.lastCall - previousCall) < timeout)
            clearTimeout(this.callTimeout);

        this.callTimeout = setTimeout(() => func(...args), timeout);
    }
}

class SaveButton extends Component {
    constructor(options) {
        super();

        this.saved = false;
        this.options = options;
    }
    html() {
        return `
            <div class="save-button">
                <button class="save-button__button">
                    Сохранить
                </button>
            </div>
        `
    }

    events(element) {
        this.element.addEventListener("click", this.onClick.bind(this));
    }

    onClick(event){
        if (DATA.user){
            if (this.saved)
                this.delete();
            else
                this.add();
        }
        else {
            const notify = new NotifyManager();
            notify.push(new Notify("Ошибка", "Вы не авторизированы!"));
        }
    }

    onRender() {
        fetch("/api/save?" + new URLSearchParams({title: DATA.title.id}).toString())
            .then(response => response.json())
            .then(saved => {
                if (saved) {
                    this.element.querySelector(".save-button__button").textContent = "Сохранено";
                }
                this.saved = saved;
            })
    }

    delete() {
        fetch("../api/save", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: DATA.title.id,
            }),
        })
            .then(() => {
                this.saved = false;
                this.element.querySelector(".save-button__button").textContent = "Сохранить";
            })

    }

    add() {
        fetch("../api/save", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: DATA.title.id,
            }),
        })
            .then(() => {
                this.saved = true;
                this.element.querySelector(".save-button__button").textContent = "Сохранено";
            })
    }
}

class EditButton extends Component {
    constructor(options) {
        super();

        this.options = options;
    }

    html() {
        return `
            <div class="edit-button">
                <button class="edit-button__button">Редактировать</button>
            </div>
        `
    }
}

class MangaButtons extends Component {
    html(){
        if (DATA.user)
            return `
                <div class="manga-buttons">
                    {{ new SaveButton() }}
                    {{ new EditButton() }}
                </div>
            `;
        else
            return ``;
    }
}

class ProgressButton extends Component {
    constructor() {
        super();

        this.fetchProgress();
    }

    html() {
        if (!this.progress)
            return `
                <div class="read-button">
                    <button class="read-button__button">
                        Нет глав
                    </button>  
                </div>
            `;
        else if (!this.progress.progress)
            return `
                <div class="read-button">
                    <a href="/chapters/${this.progress.id}">
                        <button class="read-button__button">Читать</button>
                    </a>
                </div>
            `;
        else
            return `
                <div class="read-button">
                    <a href="/chapters/${this.progress.id}">
                        <button class="read-button__button">
                            <span class="read-button__header">Продолжить</span>
                            <span class="read-button__text">
                                ТОМ ${this.progress.tome} ГЛАВА ${this.progress.chapter}
                                </span>
                        </button>
                    </a>
                </div>
            `;
    }

    fetchProgress() {
        fetch("/api/progress?" + new URLSearchParams({title: DATA.title.id, chapter: true}).toString())
            .then(response => response.json())
            .then(chapter => {
                this.progress = chapter;
            })
    }

}

class NavigationButtons extends Component {
    html() {
        return `
            sdfsdf
        `
    }
}

class BottomButtonsPanel1 extends Component {
    html() {
        return `
            <div class="buttons-panel">
                {{  }}
            </div>
        `
    }
}

window.addEventListener("load", function () {
    const mangaButtons = document.querySelector(".manga-buttons");
    mangaButtons.replaceWith(new MangaButtons().render());

    const navigationButtons = document.querySelector(".read-button");
    navigationButtons.replaceWith(new ProgressButton().render());
});