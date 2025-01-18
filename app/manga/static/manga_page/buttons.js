function debounce(func, timeout){
    return function call(...args){
        let previousCall = this.lastCall;

        this.lastCall = Date.now();

        if (previousCall && (this.lastCall - previousCall) < timeout)
            clearTimeout(this.callTimeout);

        this.callTimeout = setTimeout(() => func(...args), timeout);
    }
}

const SAVEBUTTONMIN1 = new Component(`
    <button class="save-button__button">
        <svg class="save-button__image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
`); // saved

const SAVEBUTTONMIN2 = new Component(`
    <button class="save-button__button">
        <svg class="save-button__image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.75 20.75C17.5974 20.747 17.4487 20.702 17.32 20.62L12 16.91L6.68 20.62C6.56249 20.6915 6.42757 20.7294 6.29 20.7294C6.15243 20.7294 6.01751 20.6915 5.9 20.62C5.78491 20.5607 5.68741 20.4722 5.61722 20.3634C5.54703 20.2546 5.50661 20.1293 5.5 20V6C5.5 5.27065 5.78973 4.57118 6.30546 4.05546C6.82118 3.53973 7.52065 3.25 8.25 3.25H15.75C16.4793 3.25 17.1788 3.53973 17.6945 4.05546C18.2103 4.57118 18.5 5.27065 18.5 6V20C18.5005 20.1362 18.4634 20.2698 18.3929 20.3863C18.3223 20.5027 18.2209 20.5974 18.1 20.66C17.9927 20.7189 17.8724 20.7498 17.75 20.75ZM12 15.25C12.1532 15.2484 12.3033 15.2938 12.43 15.38L17 18.56V6C17 5.66848 16.8683 5.35054 16.6339 5.11612C16.3995 4.8817 16.0815 4.75 15.75 4.75H8.25C7.91848 4.75 7.60054 4.8817 7.36612 5.11612C7.1317 5.35054 7 5.66848 7 6V18.56L11.57 15.38C11.6967 15.2938 11.8468 15.2484 12 15.25Z" fill="#000000"/>
        </svg>
    </button>
`); // unsaved


const SAVEBUTTONMAX1 = new Component(`
    <button class="save-button__button">
        Сохранено
    </button>
`); // saved

const SAVEBUTTONMAX2 = new Component(`
    <button class="save-button__button">
        Сохранить
    </button>
`) // unsaved

class SaveButton extends Component {
    constructor(options={}) {
        super();

        this.saved = false;
        this.options = options;
        this.content = new State();
    }
    html() {
        return `
            <div class="save-button">
                <div class="save-button__button" />
            </div>
        `;
    }

    events(element) {
        this.element.addEventListener("click", this.onClick.bind(this));
    }

    onClick(event){
        if (Object.keys(DATA.user).length !== 0){
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

    async onRender() {
        this.content.bindElement(this.element.querySelector(".save-button__button"));

        try {
            const response = await fetch(`/api/save?title=${DATA.title.id}`);

            if (response.ok){
                const saved = await response.json();

                if (saved)
                    this.content.set(this.options.size === "min" ? SAVEBUTTONMIN1 : SAVEBUTTONMAX1);
                else
                    this.content.set(this.options.size === "min" ? SAVEBUTTONMIN2 : SAVEBUTTONMAX2);

                this.saved = saved;
            }
            else {
                this.content.set(this.options.size === "min" ? SAVEBUTTONMIN2 : SAVEBUTTONMAX2);
            }
        }
        catch (e) {
            console.error(e);
        }
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
                this.content.set(this.options.size === "min" ? SAVEBUTTONMIN2 : SAVEBUTTONMAX2);
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
                this.content.set(this.options.size === "min" ? SAVEBUTTONMIN1 : SAVEBUTTONMAX1);
            })
    }
}

class EditButton extends Component {
    constructor(options) {
        super();

        this.options = options;
    }

    html() {
        if (this.options.size === "max")
            return `
                <div class="edit-button">
                    <a href="/manga/${DATA.title.id}/edit">
                        <button class="edit-button__button">Редактировать</button>
                    </a>
                </div>
            `;
        else if (this.options.size === "min")
            return `
                <div class="edit-button">
                    <a href="/manga/${DATA.title.id}/edit">
                        <button class="edit-button__button">
                            <svg class="edit-button__image" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <title/><g id="Complete"><g id="edit"><g><path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></g></g></g>
                            </svg>
                        </button>
                    </a>
                </div>
            `
    }
}

class ReadButton extends Component {
    html() {
        return `
            <div class="read-button">
                <button class="read-button__button"></button>
            </div>
        `
    }

    async onRender() {
        try {
            const response = await fetch(`/api/progress?title=${DATA.title.id}`);

            if (response.ok){
                const chapter = await response.json();

                if (chapter === null)
                    this.element.innerHTML = `
                        <button class="read-button__button">
                            Нет глав
                        </button>  
                    `;
                else if (chapter.progress === null)
                    this.element.innerHTML = `
                        <a href="/chapters/${chapter.id}">
                            <button class="read-button__button">Читать</button>
                        </a>
                    `;
                else
                    this.element.innerHTML = `
                        <a href="/chapters/${chapter.id}">
                            <button class="read-button__button">
                                <span class="read-button__header">Продолжить</span>
                                <span class="read-button__text">
                                    ТОМ ${chapter.tome} 
                                    ГЛАВА ${chapter.chapter}
                                   </span>
                            </button>
                        </a>
                    `;
            }
            else {
                this.element.innerHTML = `
                    <button class="read-button__button">
                        Нет глав
                    </button>  
                `;
            }
        }
        catch (e) {
            console.error(e);
        }
    }

}

function scrollButtonPanel(event) {
    const footer = document.querySelector("footer");
    const footerCords = footer.getBoundingClientRect();
    const bottomPanel = document.querySelector(".bottom-panel");
    const windowHeight = window.innerHeight;

    if (windowHeight >= (footerCords.top - bottomPanel.clientHeight))
        bottomPanel.style.bottom = (footerCords.top - bottomPanel.clientHeight) - windowHeight + 10 + "px";
    else
        bottomPanel.style.bottom = "10px";
}

window.addEventListener("DOMContentLoaded", function () {
    let bottomPanel, saveButton, editButton, readButton;
    const saveButtonEl = document.querySelector(".save-button");
    const editButtonEl = document.querySelector(".edit-button");
    const readButtonEl = document.querySelector(".read-button");
    if (window.innerWidth < 700){
        if (document.querySelector(".bottom-panel"))
            return;

        bottomPanel = document.createElement("div");
        bottomPanel.className = "bottom-panel";
        window.addEventListener("scroll", scrollButtonPanel);

        saveButton = new SaveButton({size: "min"});
        editButton = new EditButton({size: "min"});
        readButton = new ReadButton();

        bottomPanel.prepend(editButtonEl);
        bottomPanel.append(readButtonEl);
        bottomPanel.append(saveButtonEl);

        document.body.append(bottomPanel);
    }
    else if (window.innerWidth < 872) {
        if (document.querySelector(".bottom-panel"))
            return;

        bottomPanel = document.createElement("div");
        bottomPanel.className = "bottom-panel";

        saveButton = new SaveButton({size: "max"});
        editButton = new EditButton({size: "max"});
        readButton = new ReadButton();

        bottomPanel.append(readButtonEl);

        document.body.append(bottomPanel);
    }
    else {
        saveButton = new SaveButton({size: "max"});
        editButton = new EditButton({size: "max"});
        readButton = new ReadButton();
    }
    editButtonEl.replaceWith(editButton.render());
    readButtonEl.replaceWith(readButton.render());
    saveButtonEl.replaceWith(saveButton.render());
});