for (let i of document.querySelectorAll(".form-input__select"))
    new Selector(i);

for (let i of document.querySelectorAll(".form-input__select_multiple")){
    new MultipleSelector(i);
}

for (let i of document.querySelectorAll(".form-input__input")){
    new Inputer(i);
}