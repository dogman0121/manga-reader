class Saves extends Component {
    constructor(saves) {
        super();

        this.savesList = new SavesList(saves);
        this.noSaves = new NoSaves();

        this.savesSection = new State(this.savesList);
    }

    events(element) {
        this.savesList.addEventListener("empty", this.onEmpty.bind(this));
    }

    html() {
        return `
            <div class="saves">
                {{ this.savesSection }}
            </div>
        `
    }

    onEmpty() {
        this.savesSection.set(this.noSaves);
    }
}

class NoSaves extends Component {
    html() {
        return `
            <p class="saves__no-saves">
                У вас нет сохраненных
                <br>
                тайтлов!
            </p>
        `
    }
}

class SavesList extends Component {
    constructor(saves) {
        super();

        this.saves = saves ? saves : [];
    }

    html() {
        return `
            <div class="saves__list">
                {{ this.saves }}
            </div>        
        `
    }

    onRender() {
        fetch("/api/save")
            .then(response => response.json())
            .then(titles => {
                if (titles.length === 0)
                    return this.dispatchEvent(new CustomEvent("empty"));

                for(let title of titles)
                    this.addSave(Save.fromObj(title));
            })
    }

    addSave(save) {
        this.element?.append(save.element || save.render());

        save.addEventListener("delete", this.onDelete.bind(this));
        this.saves.push(save);
    }

    onDelete(event) {
        const save = event.detail.target;

        fetch("/api/save", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: save.id
            })
        })
            .then(response => response.json())
            .then(() => {
                for (let i=0; i < this.saves.length; i++)
                    if (this.saves[i] === save)
                        this.saves.splice(i, 1);
                save.element.remove();

                if (this.saves.length === 0)
                    this.dispatchEvent(new CustomEvent("empty"));
            })
    }
}

class Save extends Component {
    constructor(id, poster, name) {
        super();

        this.id = id;
        this.poster = poster;
        this.name = name;
    }

    static fromObj(title) {
        const id = title.id;
        const poster = title.poster;
        const name = title.name_russian;

        return new Save(id, poster, name);
    }

    events(element) {
        element.querySelector(".save__delete-option").addEventListener("click", this.onDelete.bind(this));
    }

    onDelete(event) {
        this.dispatchEvent(new CustomEvent("delete", {detail: {target: this}}));
    }

    html() {
        return `
            <div class="save">
                <img src="${this.poster}" class="save__image">
                <div class="save__name">
                    <span class="save__name-russian">{{ this.name }}</span>
                </div>
                <svg class="save__delete-option" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;
    }
}