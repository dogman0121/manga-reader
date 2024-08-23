import { Modal } from "../modules/modal/modal"

document.querySelector(".genres-list__item_add").addEventListener("click", function (){

});


function createList() {
    let html = `
        <div class="modal-list">
            <input class="modal-list__input">
            <div class="modal-list__list">
            
            </div>
        </div>
    `
    let domObject = new DOMParser().parseFromString(html).querySelector(".modal-list");
    let modal = new Modal(domObject);
}