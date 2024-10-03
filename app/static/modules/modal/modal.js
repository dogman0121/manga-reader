function Modal(element) {
    this.modal = new DOMParser().parseFromString(`
        <div class="modal">
            <div class="modal__inner">
            </div>
        </div>
    `, "text/html").querySelector(".modal");
    this.modal.querySelector(".modal__inner").append(element);

    this.open = function () {
        document.body.append(this.modal);
    }

    this.close = function () {
        this.modal.remove();
    }

    this._callbackClose = function (event){
        let modal = event.target.closest(".modal");
        let modalInner = event.target.closest(".modal__inner")
        if (!modalInner)
            modal.remove();
    }

    this.modal.addEventListener("click", this._callbackClose);
}