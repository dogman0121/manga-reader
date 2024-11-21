let rangeInputs = document.querySelectorAll(".range__input");
for (let input of rangeInputs) {
    input.addEventListener("input", inputEvent);
}

function inputEvent(event) {
    let input = event.target;
    let text = input.value;
    if (0 <= text[text.length - 1] && text[text.length - 1] < 10){
    } else {
        input.value = text.slice(0, -1);
        return null;
    }
    editCatalog(input.name, input.value, 2);
}
