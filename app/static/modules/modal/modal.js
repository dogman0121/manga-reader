class Modal extends Component {
    constructor(element) {
        super();

        this.content = element;
    }

    html() {
        return `
            <div class="modal">
                <div class="modal__inner">
                    {{ this.content }}
                </div>
            </div>
        `
    }
    events(element) {
        element.addEventListener("click", this._callbackClose.bind(this))
    }

    open() {
        document.body.append(this.element || this.render());
        document.body.style.overflow = "hidden";
    }

    close() {
        this.element.remove();
        document.body.style.overflow = null;
    }

    _callbackClose(event){
        if (event.target.closest(".modal__inner"))
            return null;

        this.close();
    }
}