const currentPage = document.querySelector(".page__image");
const currentPageNumElem = document.querySelector(".page-num__number");
let currentPageNum = 0;

document.querySelector(".main__inner").addEventListener("click", function (event){
    const cords = document.querySelector(".main__inner").getBoundingClientRect();

    if (event.clientX > (cords.left + cords.right)/2) {
        if (currentPageNum !== DATA.pages.length - 1)
            currentPage.src = DATA.pages[++currentPageNum];
    }
    else{
        if (currentPageNum !== 0)
            currentPage.src = DATA.pages[--currentPageNum];
    }

    currentPageNumElem.textContent = currentPageNum + 1;
})