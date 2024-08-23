class Selector {
    constructor(element, data={}) {
        this._createWrapper(element);
        this._addListeners();
    }


    _addListeners() {
        this.selectWrapperOptions.addEventListener("click", this._selectOptionEvent);
        this.input.addEventListener("click", this._inputEvent);
        document.body.addEventListener("click", this._closeEvent);
    }


    _createWrapper(element) {
        this.element = new DOMParser().parseFromString(`
            <div class="inputs-select"> 
                <div class="inputs-select__wrapper select-wrapper">
                    <input type="text" class="select-wrapper__input">
                    <div class="select-wrapper__options select-wrapper__options_closed" hidden>
                    </div>
                </div>
            </div>
        `, "text/html").querySelector(".inputs-select");

        // Putting select element to the wrapper
        this.select = element;
        this.select.classList.add("inputs-select__select");

        this.input = this.element.querySelector(".select-wrapper__input");
        this.inputElement = new Inputer(this.input);

        this.selectWrapperOptions = this.element.querySelector(".select-wrapper__options");
        for(let option of this.select.querySelectorAll("option"))
            this.selectWrapperOptions.innerHTML += `<div class='select-wrapper__option' data-value="${option.value}">${option.textContent}</div>`;
    
        element.replaceWith(this.element);
        
        this.element.prepend(this.select);
    }


    // Call, when user click on select option
    _selectOptionEvent(event) {
        // Check if the clicked element is not an option
        if (!event.target.classList.contains("select-wrapper__option"))
            return null;

        let selectObject = event.target.closest(".inputs-select");
        let wrapperOptions = selectObject.querySelector(".select-wrapper_options");
        let select = selectObject.querySelector(".inputs-select__select");

        let option = event.target;
        let hiddenOption = select.querySelector(`option[value="${option.dataset.value}"]`);
        if (option.classList.contains("select-wrapper__option_selected")){
            option.classList.remove("select-wrapper__option_selected");
            hiddenOption.removeAttribute("selected");
        } else {
            // If there any selected option, remove selection
            if (!select.multiple && select.querySelector("[selected]")) {
                wrapperOptions.querySelector(".select-wrapper__option_selected").classList.remove("select-wrapper__option_selected");
                select.querySelector("option[selected]").select = null;
            }
            option.classList.add("select-wrapper__option_selected");
            hiddenOption.setAttribute("selected", "");

            let selectEvent = new CustomEvent("select", {});
            hiddenOption.dispatchEvent(selectEvent);

        }
    }


    // Call, when user click on the input
    _inputEvent(event){
        let select = event.target.closest(".inputs-select");
        let options = select.querySelector(".select-wrapper__options");

        if (options.classList.contains("select-wrapper__options_closed"))
            options.classList.remove("select-wrapper__options_closed");
    }


    _closeEvent(event){
        console.log(event);
        let select = event.target.closest(".inputs-select");
        let allSelects = document.querySelectorAll(".inputs-select");
        let optionsBlock;
        for(let s of allSelects) {
            optionsBlock = s.querySelector(".select-wrapper__options");
            if (s !== select && !optionsBlock.classList.contains("select-wrapper__options_closed"))
                optionsBlock.classList.add("select-wrapper__options_closed")
        }
    }
}


class Inputer {
    constructor(element, data={}) {
        this._createWrapper(element);
        this._addListeners();
    }

    _createWrapper(element) {
        this.element = new DOMParser().parseFromString(`
            <div class="inputs-input">
            </div>
        `, "text/html").querySelector(".inputs-input");

        this.input = element;
        this.input.classList.add("inputs-input__input");

        element.replaceWith(this.element);

        this.element.append(this.input);
    }

    _addListeners() {
        this.element.addEventListener("click", this._inputClickEvent);
    }


    // Call, when user click on the input wrapper
    _inputClickEvent(event) {
        let input;
        if (event.target.classList.contains("inputs-input__input"))
            input = event.target;
        else
            input = event.target.querySelector(".inputs-input__input");
        let clickEvent = new Event("click", {});
        console.log(event.target);
        input.focus();
        input.dispatchEvent(clickEvent);
    }
}
