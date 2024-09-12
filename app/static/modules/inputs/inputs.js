class Selector {
    constructor(element, data={}) {
        this._createWrapper(element);
        this._addListeners();
    }

    _addListeners() {
        this.selectWrapperOptions.addEventListener("click", this._selectOptionEvent);
        this.selectedOption.addEventListener("click", this._inputClickEvent);
        document.body.addEventListener("click", this._closeEvent);
    }

    _createWrapper(element) {
        this.element = new DOMParser().parseFromString(`
            <div class="inputs-select"> 
                <div class="select-wrapper__selected-option"></div>
                <div class="inputs-select__wrapper select-wrapper">
                    <div class="select-wrapper__options-wrapper">
                        <div class="select-wrapper__options select-wrapper__options_closed"></div>
                    </div>
                </div>
            </div>
        `, "text/html").querySelector(".inputs-select");

        // Putting select element to the wrapper
        this.select = element;
        this.select.hidden = true;
        this.select.classList.add("inputs-select__select");

        this.selectWrapperOptions = this.element.querySelector(".select-wrapper__options");
        for(let option of this.select.querySelectorAll("option"))
            this.selectWrapperOptions.innerHTML += `<div class='select-wrapper__option' data-value="${option.value}">${option.textContent}</div>`;

        this.selectedOption = this.element.querySelector(".select-wrapper__selected-option");
        // Select the first option
        console.log(element);
        if (this.select.querySelector("option[selected]")){
            let selected = this.select.querySelector("option[selected]");
            let option = this.selectWrapperOptions.querySelector(`.select-wrapper__option[data-value="${selected.value}"]`);

            this.selectedOption.textContent = selected.textContent;
            option.classList.add("select-wrapper__option_selected");
        }
        else {
            let firstOption = this.selectWrapperOptions.querySelector(".select-wrapper__option");
            let selectOption = this.select.querySelector(`[value="${firstOption.dataset.value}"]`)

            this.selectedOption.textContent = firstOption.textContent;
            firstOption.classList.add("select-wrapper__option_selected");
            selectOption.setAttribute("selected", "");
        }
        element.replaceWith(this.element);

        this.element.prepend(this.select);
    }

    // Call, when user click on select option
    _selectOptionEvent(event) {
        // Check if the clicked element is not an option
        if (!event.target.classList.contains("select-wrapper__option"))
            return null;

        let selectObject = event.target.closest(".inputs-select");
        let wrapperOptions = selectObject.querySelector(".select-wrapper__options");
        let select = selectObject.querySelector(".inputs-select__select");
        let selectedOption = selectObject.querySelector(".select-wrapper__selected-option");

        let option = event.target;
        let hiddenOption = select.querySelector(`option[value="${option.dataset.value}"]`);

        // If there are any selected option, remove selection
        wrapperOptions.querySelector(".select-wrapper__option_selected").classList.remove("select-wrapper__option_selected");
        select.querySelector("option[selected]").removeAttribute("selected");

        option.classList.add("select-wrapper__option_selected");
        hiddenOption.setAttribute("selected", "");
        selectedOption.textContent = hiddenOption.textContent;

        let selectEvent = new CustomEvent("select", {});
        hiddenOption.dispatchEvent(selectEvent);

    }

    _closeEvent(event){
        let select = event.target.closest(".inputs-select");
        let allSelects = document.querySelectorAll(".inputs-select");
        let optionsBlock;
        for(let s of allSelects) {
            optionsBlock = s.querySelector(".select-wrapper__options");
            if (s !== select && !optionsBlock.classList.contains("select-wrapper__options_closed"))
                optionsBlock.classList.add("select-wrapper__options_closed")
        }
    }

    _inputClickEvent(event){
        let select = event.target.closest(".inputs-select");
        let options = select.querySelector(".select-wrapper__options");

        if (options.classList.contains("select-wrapper__options_closed"))
            options.classList.remove("select-wrapper__options_closed");
    }
}

class MultipleSelector {
    constructor(element, data={}) {
        this._createWrapper(element);
        this._addListeners();
    }

    _addListeners() {
        this.selectWrapperOptions.addEventListener("click", this._selectOptionEvent);
        this.input.addEventListener("click", this._inputClickEvent);
        this.input.addEventListener("input", this._inputEvent);
        document.body.addEventListener("click", this._closeEvent);
    }

    _createWrapper(element) {
        this.element = new DOMParser().parseFromString(`
            <div class="inputs-select"> 
                <div class="inputs-select__wrapper select-wrapper">
                    <input type="text" class="select-wrapper__input">
                    <div class="select-wrapper__options-wrapper">
                        <div class="select-wrapper__options select-wrapper__options_closed"></div>
                    </div>
                </div>
            </div>
        `, "text/html").querySelector(".inputs-select");

        // Putting select element to the wrapper
        this.select = element;
        this.select.hidden = true;
        this.select.classList.add("inputs-select__select");

        this.input = this.element.querySelector(".select-wrapper__input");
        new Inputer(this.input);

        this.selectWrapperOptions = this.element.querySelector(".select-wrapper__options");
        for(let option of this.select.querySelectorAll("option"))
            this.selectWrapperOptions.innerHTML += `
                <div class='select-wrapper__option' data-value="${option.value}">${option.textContent}</div>
            `;
    
        element.replaceWith(this.element);
        
        this.element.prepend(this.select);
    }

    // Call, when user click on select option
    _selectOptionEvent(event) {
        // Check if the clicked element is not an option
        if (!event.target.classList.contains("select-wrapper__option"))
            return null;

        let selectObject = event.target.closest(".inputs-select");
        let wrapperOptions = selectObject.querySelector(".select-wrapper__options");
        let select = selectObject.querySelector(".inputs-select__select");

        let option = event.target;
        let hiddenOption = select.querySelector(`option[value="${option.dataset.value}"]`);
        if (option.classList.contains("select-wrapper__option_selected")){
            option.classList.remove("select-wrapper__option_selected");
            hiddenOption.removeAttribute("selected");

            let unselectEvent = new CustomEvent("unselect", {bubbles:true});
            hiddenOption.dispatchEvent(unselectEvent);
        } else {
            // If there are any selected option, remove selection
            if (!select.multiple && select.querySelector("[selected]")) {
                wrapperOptions.querySelector(".select-wrapper__option_selected")
                    .classList.remove("select-wrapper__option_selected");
                select.querySelector("option[selected]").select = null;
            }
            option.classList.add("select-wrapper__option_selected");
            hiddenOption.setAttribute("selected", "");

            let selectEvent = new CustomEvent("select", {bubbles:true});
            hiddenOption.dispatchEvent(selectEvent);
        }
    }

    _closeEvent(event){
        let select = event.target.closest(".inputs-select");
        let allSelects = document.querySelectorAll(".inputs-select");
        let optionsBlock;
        for(let s of allSelects) {
            optionsBlock = s.querySelector(".select-wrapper__options");
            if (s !== select && !optionsBlock.classList.contains("select-wrapper__options_closed"))
                optionsBlock.classList.add("select-wrapper__options_closed")
        }
    }

    // Call, when user click on the input
    _inputClickEvent(event){
        let select = event.target.closest(".inputs-select");
        let options = select.querySelector(".select-wrapper__options");

        if (options.classList.contains("select-wrapper__options_closed"))
            options.classList.remove("select-wrapper__options_closed");
    }

    _inputEvent(event) {
        let select = event.target.closest(".inputs-select");
        let options = select.querySelector(".select-wrapper__options");
        let selectForm = select.querySelector(".inputs-select__select");

        options.innerHTML = "";
        for (let option of selectForm.querySelectorAll("option")){
            if (option.textContent.includes(event.target.value))
                if (selectForm.querySelector(`option[value="${option.value}"]`).hasAttribute("selected"))
                    options.innerHTML += `
                        <div data-value="${option.value}" class="select-wrapper__option select-wrapper__option_selected">
                            ${option.textContent}
                        </div>
                    `;
                else
                    options.innerHTML += `
                        <div data-value="${option.value}" class="select-wrapper__option">${option.textContent}</div>
                    `;
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
        let inputForm = event.target.closest(".inputs-input");
        if (inputForm){
            let input = inputForm.querySelector(".inputs-input__input");
            let clickEvent = new CustomEvent("click", {});
            input.focus();
            input.dispatchEvent(clickEvent);
        }
    }
}
