chaptersEvents();


// Переключение разделов
let chosenSection = null;
function chooseSection(element) {
    if (chosenSection != null)
        chosenSection.classList.remove("section-buttons__item_active");
    
    element.classList.add("section-buttons__item_active");
    chosenSection = element;
}

let statsPanel = document.getElementById("section-buttons");
statsPanel.onclick = function(event) {
    let element = event.target;
    if (element.className == "section-buttons__item"){
        chooseSection(event.target);
        
        if (element.id == "chapters-button") {
            showChapters([{tome:1, chapter:1}, {tome:1, chapter:2}]);
            chaptersEvents();
        }

        if (element.id == "comments-button") {
            showComments();
            commentsEvents();
        }
    }
}

let chapters = document.getElementById("chapters-button");
chooseSection(chapters);

// Раздел главы
function showChapters(chapters) {
    let chaptersList = "";
    for (let chapter of chapters)
        chaptersList += `<div class="chapters-list__item">Том ${chapter.tome} Глава ${chapter.chapter}</div>\n`;
    
    let chaptersBlock = document.getElementById("sections-content");
    chaptersBlock.innerHTML = `
        <div id="chapters">
        <div id="chapters__header">
            Список глав
            <img id="filter-button" src="static/manga_card/images/filter.svg">
        </div>
        <div id="chapters-list">
            ${chaptersList}
        </div>
    `
    
}

// Обновление слушателя событий
function chaptersEvents() {
    // Сортировка глав
    let filter = document.getElementById("filter-button");
    filter.onclick = function(event) {
        let chaptersList = document.getElementById("chapters-list");
        for (let child of chaptersList.children)
            chaptersList.prepend(child);
    }
}

function commentsEvents() {
    // Автоизменение высоты ввода текста
    let commentsInput = document.querySelector(".comments__input");
    commentsInput.addEventListener("input", function() {
        console.log(this.scrollHeight);
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }, false);


    // Активация ввода при нажатии
    let form = document.querySelector(".comments__form");
    form.addEventListener('click', function() {
        let text = document.querySelector(".comments__input");
        text.focus();
    }, false);
}



// Раздел комментарии
function showComments(){
    let commentsBlock = document.getElementById("sections-content");
    commentsBlock.innerHTML  = `
        <div id="comments">
        <div class="comments__form">
            <textarea class="comments__input" placeholder="Введите текст"></textarea>
            <buton class="comments__send">Отправить</buton>
        </div>
        <div class="comments__list">
            <div class="comments__item">

            </div>
        </div>
        </div>
    `
}