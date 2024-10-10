// Класс отвечающий за работу select-фильтров
class Select {
    constructor(element) {
        this.name = element.id;
        this.selectInputBlock = element.querySelector(".select__input-block");
        this.selectInput = element.querySelector(".select__input");
        this.selectChoices = element.querySelector(".select__list");
        this.selectedBlocks = element.querySelector(".select__selected");
        this.isChoicesOpened = false;

        this.selectInputBlock.addEventListener("click", {handleEvent: this.openChoicesEvent, object: this});
        this.selectChoices.addEventListener("click", {handleEvent:this.chooseElementEvent, object: this});
        this.selectInput.addEventListener("input", {handleEvent: this.inputEvent, object: this});
        this.selectedBlocks.addEventListener("click", {handleEvent: this.deleteChoiceEvent, object:this})
        document.body.addEventListener("click", {handleEvent: function (){}, object: this})
    }

    openChoicesEvent(event) {
        this.object.openChoices();
    }

    openChoices() {
        this.selectChoices.querySelector(".select-list__inner").hidden = null;
        this.isChoicesOpened = true;
    }

    closeChoices() {
        this.selectChoices.querySelector(".select-list__inner").hidden = true;
        this.isChoicesOpened = false;
    }

    addChoice(value) {
        let text = this.selectChoices.querySelector(`[data-value="${value}"]`).textContent;
        let choiceBlock = `
            <div class="selected__option" data-value="${value}">
                ${text} | <span class="selected__delete"> X </span>
            </div>
        `
        this.selectedBlocks.innerHTML += choiceBlock;

        let choiceElement = this.selectChoices.querySelector(`[data-value="${value}"]`);
        choiceElement.classList.add("select-list__option_selected");
    }

    removeChoice(value) {
        this.selectedBlocks.querySelector(`[data-value="${value}"]`).remove();

        let choiceElement = this.selectChoices.querySelector(`[data-value="${value}"]`);
        choiceElement.classList.remove("select-list__option_selected");
    }

    cleanChoices() {
        this.selectedBlocks.innerHTML = "";

        for (let el of this.selectChoices.querySelectorAll(".select-list__option")){
            el.classList.remove("select-list__option_selected");
        }

        editCatalog(this.name, null, 4);
    }

    chooseElementEvent(event) {
        if (event.target.classList.contains("select-list__option")){
            if (event.target.classList.contains("select-list__option_selected")) {
                this.object.removeChoice(event.target.dataset.value);
                editCatalog(this.object.name, event.target.dataset.value, 2);
            }
            else {
                this.object.addChoice(event.target.dataset.value);
                editCatalog(this.object.name, event.target.dataset.value, 1);
            }
        }
    }

    deleteChoiceEvent(event) {
        if(event.target.classList.contains("selected__delete")){
            let selectedBlock = event.target.closest(".selected__option");
            this.object.removeChoice(selectedBlock.dataset.value);
            editCatalog(this.object.name, selectedBlock.dataset.value, 3);
        }
    }

    inputEvent(event) {
        let selectChoiceElements = this.object.selectChoices.querySelectorAll(".select-list__option");
        for (let choice of selectChoiceElements){
            if (!choice.textContent.toLowerCase().includes(event.target.value.toLowerCase()))
                choice.hidden = true;
            else
                choice.hidden = null;
        }
    }
}


let types = new Select(document.querySelector(".type"));
let genres = new Select(document.querySelector(".genres"));
let statuses = new Select(document.querySelector(".status"));


document.body.addEventListener("click", function (event){
    if (types.isChoicesOpened && !event.target.closest(".type"))
        types.closeChoices();
    if (genres.isChoicesOpened && !event.target.closest(".genres"))
        genres.closeChoices();
    if (statuses.isChoicesOpened && !event.target.closest(".status"))
        statuses.closeChoices();
})


function getParamsFromUrl(url){
    let queryDict = {};
    url.substring(1).split("&").forEach((item) => {
        let param = item.split("=");
        if (queryDict[param[0]])
            queryDict[param[0]].push(param[1]);
        else
            queryDict[param[0]] = [param[1]];
    })
    return queryDict;
}

let params = getParamsFromUrl(window.location.search);
console.log(params);

let typesParams = params['types'];
if (typesParams)
    for (let type of typesParams){
        types.addChoice(type);
        formData.append("types", type);
    }

let genresParams = params['genres'];
if (genresParams)
    for (let genre of genresParams){
        genres.addChoice(genre);
        formData.append("genres", genre);
    }

let statusesParams = params['status'];
if (statusesParams)
    for (let status of statusesParams){
        statuses.addChoice(status);
        formData.append("status", status);
    }


let cleanButton = document.querySelector(".filters__clean");
cleanButton.addEventListener("click", function (){
    types.cleanChoices();
    genres.cleanChoices();
    statuses.cleanChoices();
});