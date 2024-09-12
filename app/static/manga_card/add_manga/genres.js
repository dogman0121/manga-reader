let genresList;

document.querySelector(".genres-list__item_add").addEventListener("click", async function (){
    let response = await fetch("/api/genres");
    genresList = await response.json();

    let genresItems = ""
    for (let genre of genresList){
        if (!document.querySelector(`[data-id="${genre.id}"]`))
            genresItems += `<div data-id="${genre.id}" class="genres-form__item">${genre.name}</div>`;
    }

    let genresForm = `
        <div class="genres-form">
            <input class="genres-form__input" placeholder="Название жанра">
            <div class="genres-form__items">
                ${genresItems}
            </div>
        </div>
    `

    let genresFormRendered = new DOMParser().parseFromString(genresForm, "text/html").querySelector(".genres-form");

    genresFormRendered.querySelector(".genres-form__input").addEventListener("input", typeHandler);
    genresFormRendered.querySelector(".genres-form__items").addEventListener("click", selectHandler);

    let modal = new Modal(genresFormRendered)
    modal.open();
})


function typeHandler(event){
    let genresListBlock = document.querySelector(".genres-form__items");
    genresListBlock.innerHTML = "";
    for (let genre of genresList){
        if (genre.name.includes(event.target.value) && !document.querySelector(`[data-id="${genre.id}"]`))
            genresListBlock.innerHTML += `<div data-id="${genre.id}" class="genres-form__item">${genre.name}</div>`;
    }
}

function selectHandler(event){
    if (event.target.closest(".genres-form__item")){
         let genresForm = document.querySelector(".genres-list__form");
         genresForm.innerHTML += `
            <option value="${event.target.dataset.id}" selected></option>
         `

         let genresAddBlock = document.querySelector(".genres-list__item_add");
         let genreBlock = new DOMParser().parseFromString(`
            <li data-id="${event.target.dataset.id}" class="genres-list__item">
                ${event.target.textContent}
                <img class="genres-list__cross" src="/static/manga_card/add_manga/images/close.svg">
            </li>>
         `, "text/html").querySelector(".genres-list__item");
         genresAddBlock.before(genreBlock);

         event.target.remove();
    }
}


document.querySelector("#genres-list").addEventListener("click", function (event) {
    if (event.target.className === "genres-list__cross"){
        let genresBlock = event.target.closest(".genres-list__item");
        let genresForm = document.querySelector(".genres-list__form");
        genresForm.querySelector(`option[value="${genresBlock.dataset.id}"]`).remove();
        genresBlock.remove();
    }
})
