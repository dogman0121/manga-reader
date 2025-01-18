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
        if (DATA.user.id === PROFILE)
            return `
                <p class="saves__no-saves">
                    У вас нет сохраненных
                    <br>
                    тайтлов!
                </p>
            `;
        else
            return `
                <p class="saves__no-saves">
                    Пользователь еще не добавил
                    <br>
                    сохраненные тайтлы!
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

    async onRender() {
        try {
            const response = await fetch(`/api/save?user=${PROFILE}`);

            if (response.ok){
                const saves = await response.json();

                if (saves.length === 0)
                    return this.dispatchEvent(new CustomEvent("empty"));

                for(let title of saves)
                    this.addSave(new Save(title));
            }
        }
        catch (e) {
        }
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
    constructor(title) {
        super();

        this.id = title.id;
        this.poster = title.poster;
        this.name = title.name_russian;
    }

    events(element) {
        element.querySelector(".save__delete-option")?.addEventListener("click", this.onDelete.bind(this));
    }

    onDelete(event) {
        this.dispatchEvent(new CustomEvent("delete", {detail: {target: this}}));

        event.preventDefault();
    }

    html() {
        if (PROFILE === DATA.user.id)
            return `
                <div class="save">
                    <a href="/manga/${this.id}">
                        <img src="${this.poster}" class="save__image">
                        <div class="save__name">
                            <span class="save__name-russian">{{ this.name }}</span>
                        </div>
                        <svg class="save__delete-option" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                </div>
            `;
        else
            return `
                <div class="save">
                    <a href="/manga/${this.id}">
                        <img src="${this.poster}" class="save__image">
                        <div class="save__name">
                            <span class="save__name-russian">{{ this.name }}</span>
                        </div>
                    </a>
                </div>
            `
    }
}