let pages = document.querySelectorAll(".page");
let lastPage = pages[pages.length - 1];
let json = JSON.parse(document.querySelector(".DATA").textContent);
let title = json.title;
let chapters = title.chapters;
let currentChapter = json.chapter;


window.addEventListener("scroll", function (){
    let lastPageCords = lastPage.getBoundingClientRect();
    if ((lastPageCords.bottom - document.documentElement.clientHeight) < 50) {
        for (let chapter of chapters){
            if (chapter.tome > currentChapter.tome ||
                (chapter.tome === currentChapter.tome && chapter.chapter > currentChapter.chapter)){
                currentChapter = chapter;
                fetch("/api/chapters/pages?chapter_id=" + currentChapter.id.toString())
                    .then(response => response.json())
                    .then(pages => {
                        for (page of pages){
                            document.querySelector(".main__inner").innerHTML += `
                                <div class="page">
                                    <img class="page__image" src="${page}">
                                </div>
                            `
                        }
                    })
            }
        }
    }

})