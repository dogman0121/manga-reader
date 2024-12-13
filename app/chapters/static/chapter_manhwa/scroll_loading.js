let pages = document.querySelectorAll(".page");
let lastPage = pages[pages.length - 1];
let json = JSON.parse(document.querySelector(".DATA").textContent);
let title = json.title;
let chapters = DATA.chapters_list;


let can = true;

window.addEventListener("scroll", function (){
    let lastPageCords = lastPage.getBoundingClientRect();
    if ((lastPageCords.bottom - document.documentElement.clientHeight) < 100) {
        for (let chapter of chapters){
            if (chapter.tome > DATA.chapter.tome ||
                (chapter.tome === DATA.chapter.tome && chapter.chapter > DATA.chapter.chapter)){
                if (!can)
                    return null;
                can = false;
                DATA.chapter = chapter;
                fetch("/api/chapters/pages?chapter_id=" + DATA.chapter.id.toString())
                    .then(response => response.json())
                    .then(pages => {
                        let pagesContainer = document.querySelector(".main__inner");
                        pagesContainer.innerHTML += `
                            <div class="page-info">Том ${DATA.chapter.tome} Глава ${DATA.chapter.chapter}</div>
                        `;
                        for (page of pages){
                            pagesContainer.innerHTML += `
                                <div class="page">
                                    <img class="page__image" src="${page}">
                                </div>
                            `
                        }
                    })
                    .then(() => {can = true;})
                return;
            }
        }
    }

})