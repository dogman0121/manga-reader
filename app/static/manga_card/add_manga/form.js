function addSelectedOption(option){
    let select = option.closest(".inputs-select");
    let input = select.querySelector(".select-wrapper__input");

    if (!select.querySelector(`.select-wrapper__option[data-value="${option.value}"]`).
    classList.contains("select-wrapper__option_selected")){
        select.querySelector(`.select-wrapper__option[data-value="${option.value}"]`).
        classList.add("select-wrapper__option_selected");
    }

    let selectOption = new DOMParser().parseFromString(`
        <div data-value="${option.value}" class="selected-option">
            ${option.textContent}
            <img class="selected-option__image" src="/static/manga_card/add_manga/images/close.svg">
        </div>
    `, "text/html").querySelector(".selected-option");

    selectOption.querySelector(".selected-option__image").addEventListener("click", function (event){
        let selectedOption = event.target.closest(".selected-option");
        let select = event.target.closest(".inputs-select");
        option.removeAttribute("selected");
        select.querySelector(`.select-wrapper__option_selected[data-value="${selectedOption.dataset.value}"]`)
            .classList.remove("select-wrapper__option_selected");
        select.querySelector(`.selected-option[data-value="${selectedOption.dataset.value}"]`).remove();
        selectedOption.remove();
    })

    input.before(selectOption);
}



for (let i of document.querySelectorAll(".form-input__select"))
    new Selector(i);

for (let i of document.querySelectorAll(".form-input__select_multiple")){
    let select = new MultipleSelector(i);

    for (let j of i.querySelectorAll("option[selected]")){
        addSelectedOption(j);
    }

    i.addEventListener("select", function (event){
        addSelectedOption(event.target);
    })

    i.addEventListener("unselect", function (event){
        let select = event.target.closest(".inputs-select");
        select.querySelector(`.selected-option[data-value="${event.target.value}"]`).remove();
    })
}

for (let i of document.querySelectorAll(".form-input__input")){
    new Inputer(i);
}