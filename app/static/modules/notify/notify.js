class Notify extends Component {
    constructor(title, description){
        super();
        this.title = title;
        this.description = description;
    }

    hide() {
        let alpha = 1;
        const proc = setInterval(() => {
            if (alpha < 0) {
                this.element.remove();
                clearInterval(proc);
            }

            this.element.style.opacity = alpha;
            alpha -= 0.1;
        }, 100);
    }

    html() {
        return `
            <div class="notify">
                <div class="notify__header">
                    <span class="notify__title">{{ this.title }}</span>
                    <svg class="notify__close-icon" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 5L4.99998 19M5.00001 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <hr>
                <p class="notify__description">
                    {{ this.description }}
                </p>
            </div>
        `
    }

    events(element) {
        this.element.addEventListener("click", function (event){
            if (!event.target.closest(".notify__close-icon"))
                return null;

            event.target.closest(".notify").remove();
        })
    }
}

class NotifyManager extends Component {
    constructor() {
        super();

        if (!document.querySelector(".notify__manager"))
            document.body.prepend(this.render());
        else {
            this.element = document.querySelector(".notify__manager");
        }
    }

    html() {
       return `<div class="notify__manager"></div>`;
    }

    push(notify){
        this.element.append(notify.render());
        setTimeout(notify.hide.bind(notify), 1000);
    }
}