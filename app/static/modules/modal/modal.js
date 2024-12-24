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
        document.body.style.overflow = "hidden";
    }

    this.close = function () {
        this.modal.remove();
        document.body.style.overflow = null;
    }

    this._callbackClose = function (event){
        if (event.target.closest(".modal__inner"))
            return null;

        this.close();
    }

    this.modal.addEventListener("click", this._callbackClose.bind(this));
}