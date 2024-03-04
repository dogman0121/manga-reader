class Modal {
    constructor(element, options={}) {
        this.modal = new DOMParser().parseFromString(`
            <div class="modal">
                <div class="modal__inner"></div>
            </div>
        `, "text/html").querySelector(".modal");

        this.modal.querySelector(".modal__inner").append(element);
    }

    open() {
        document.body.append(this.modal);
    }

    close() {
        this.modal.remove();
    }
}