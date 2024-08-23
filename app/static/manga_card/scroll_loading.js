// Функция прогрузки манги при проматывании страницы вниз
function loadCommentsOnScroll() {
    let commentsList = document.querySelector(".comments__list");
    let commentsCords = commentsList.getBoundingClientRect();
    let commentsBottom = commentsCords.bottom;
    if((commentsBottom - document.documentElement.clientHeight) < 10)
        comments.load();
}