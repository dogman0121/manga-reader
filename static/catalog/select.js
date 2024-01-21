let selectForms = document.querySelectorAll(".select");
for (let form of selectForms) {
    form.addEventListener("click", formClick);
}

let openedSelectForm = null;
function formClick(event){
    if (event.target.closest(".select__input-block")){
        if (openedSelectForm != null)
            openedSelectForm.hidden = true;

        let selectForm = event.target.closest(".select");
        let visibleOptionsListInner = selectForm.querySelector(".select-list__inner");
        visibleOptionsListInner.hidden = false;
        openedSelectForm = visibleOptionsListInner;
        event.stopPropagation();
    }
    if (event.target.classList.contains("select-list__option")){
        let selectBlock = event.target.closest(".select");
        let selectedVisibleOption = selectBlock.querySelector(".select__selected");
        let selectForm = selectBlock.querySelector(".select__select");
        if (event.target.classList.contains("select-list__option_selected")) {
            event.target.classList.remove("select-list__option_selected");
            let value = event.target.dataset.value;
            selectedVisibleOption.querySelector(`[data-value="${value}"]`).remove();
            let selectFormOption = selectForm.querySelector(`[value="${value}"]`);
            selectFormOption.remove();
            editCatalog(selectForm.name, selectFormOption.value, 2);
            return null;
        }

        event.target.classList.add("select-list__option_selected")
        selectedVisibleOption.innerHTML += `
            <div class="selected__option" data-value="${event.target.dataset.value}">
                ${event.target.textContent} | <span class="selected__delete"> X </span>
            </div>
        `;

        selectForm.innerHTML += `
            <option class="select-list__option" value="${event.target.dataset.value}" selected>
                ${event.target.textContent}
            </option>
        `;
        editCatalog(selectForm.name, event.target.dataset.value, 1);
    }
}


let selectVisibleBlock = document.querySelectorAll(".selected");
for (let form of selectVisibleBlock) {
    form.addEventListener("click", deleteSelected);
}

function deleteSelected(event) {
    let selectBlock = event.target.closest(".select");
    let selectForm = selectBlock.querySelector(".select__select");
    let selectVisibleList = selectBlock.querySelector(".select-list");
    if (event.target.className === "selected__delete"){
        let selectedOption = event.target.closest(".selected__option");
        let selectFormOption = selectForm.querySelector(`[value="${selectedOption.dataset.value}"]`);
        let selectVisibleOption = selectVisibleList.querySelector(`[data-value="${selectedOption.dataset.value}"]`);

        selectFormOption.remove();
        selectedOption.remove();
        selectVisibleOption.classList.remove("select-list__option_selected");
        editCatalog(selectForm.name, selectFormOption.value, 2);
    }
}

let selectInputs = document.querySelectorAll(".select__input");
for(let input of selectInputs){
    input.addEventListener("input", inputFilter)
}

function inputFilter(event){
    let selectBlock = event.target.closest(".select");
    let selectListVisible = selectBlock.querySelector(".select-list__inner");
    let selectListVisibleChildren = selectListVisible.children;
    for (let i = 0; i < selectListVisibleChildren.length; i++){
        if (!selectListVisibleChildren[i].textContent.toLowerCase().includes(event.target.value.toLowerCase()))
            selectListVisibleChildren[i].style.display = "none";
        else
            selectListVisibleChildren[i].style.display = null;
    }
}


document.body.addEventListener("click", function(event) {
    if (openedSelectForm){
        openedSelectForm.hidden = true;
        openedSelectForm = null;
    }
})