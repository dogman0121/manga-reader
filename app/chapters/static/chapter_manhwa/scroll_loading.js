let isLoading = false;

window.addEventListener("load",function() {
    window.onscroll = checkPosition;
    window.onresize = checkPosition;
})

async function checkPosition() {
    const height = document.body.offsetHeight
    const screenHeight = window.innerHeight

    const scrolled = window.scrollY

    const threshold = height - screenHeight / 4

    const position = scrolled + screenHeight

    if (position >= threshold) {
        await loadChapters();
    }
}

function fetchChapter() {
    return fetch(`/api/chapters/next?chapter=${DATA.chapter.id}`)
        .then(response => response.json())
}

function pushChapter(chapter) {
    const pages = chapter.pages;

    const chapterNode = document.querySelector(".chapter");
    const pageNode = document.querySelector(".page");

    const newChapter = chapterNode.cloneNode(false);
    newChapter.dataset.id = chapter.id;
    for(let page of pages){
        let newPage = pageNode.cloneNode(true);
        newPage.querySelector(".page__image").src = page;
        newChapter.appendChild(newPage);
    }

    document.querySelector(".main__inner").appendChild(newChapter);
}

async function loadChapters() {
    if (isLoading)
        return;

    isLoading = true;

    let chapter = await fetchChapter();

    if (!chapter)
        return;

    DATA.chapter = chapter;

    pushChapter(DATA.chapter);

    isLoading = false;
}