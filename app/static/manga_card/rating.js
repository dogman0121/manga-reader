let ratingButton = document.querySelector(".rating");
ratingButton.addEventListener("click", function(event){
    let modal = `
        <div class="modal">
            <ul class="modal__content">
                <ul class="modal__inner ratings-list">
                    <li class="ratings-list__item rating-option" data-stars="10">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">10</span>
                        <span class="rating-option__description">Превосходно!!!</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="9">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">9</span>
                        <span class="rating-option__description">Превосходно</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="8">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">8</span>
                        <span class="rating-option__description">Супер</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="7">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">7</span>
                        <span class="rating-option__description">Отлично</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="6">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">6</span>
                        <span class="rating-option__description">Хорошо</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="5">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">5</span>
                        <span class="rating-option__description">Неплохо</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="4">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">4</span>
                        <span class="rating-option__description">С пивом пойдет</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="3">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">3</span>
                        <span class="rating-option__description">Плохо</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="2">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">2</span>
                        <span class="rating-option__description">Ужасно</span>
                    </li>
                    <li class="ratings-list__item rating-option" data-stars="1">
                        <img class="rating-option__image" src="../static/manga_card/images/star.svg">
                        <span class="rating-option__number">1</span>
                        <span class="rating-option__description">Отвратительно</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    let modalRendered = new DOMParser().parseFromString(modal, "text/html");
    let modalElement = modalRendered.querySelector(".modal");
    let ratingsList = modalElement.querySelector(".ratings-list");
    ratingsList.addEventListener("click", ratingEvent);
    document.body.append(modalElement);
    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = getScrollbarWidth() + "px";
    event.stopPropagation();
})

function ratingEvent(event) {
    //console.log(event.target);
    let element = event.target;
    if (!element.closest(".rating-option"))
        return null;

    let ratingElement = element.closest(".rating-option");
    //console.log(ratingElement);
    if (document.querySelector(".user-rating")) {
        let userRatingElement = document.querySelector(".user-rating");
        if (userRatingElement.dataset.stars === ratingElement.dataset.stars) {
            fetch("../api/delete_rating", {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title_id: title_id,
                    rating: ratingElement.dataset.stars,
                }),
            })
                .then(response => (response.json()))
                .then(rating => {
                    let ratingStats = document.querySelector(".rating");
                    let ratingStatsText = ratingStats.querySelector(".stats-option__text");
                    ratingStatsText.textContent = rating.rating;
                    let ratingVotes = ratingStats.querySelector(".stats-option__votes");
                    ratingVotes.textContent = rating.voices_count;

                    userRatingElement.remove();
                })
        }
        else {
            fetch("../api/update_rating", {
                method: "UPDATE",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title_id: title_id,
                    rating: ratingElement.dataset.stars,
                }),
            })
                .then(response => (response.json()))
                .then(rating => {
                    let userRatingBlockHtml = `
                        <span class="user-rating" data-stars="${ratingElement.dataset.stars}">
                            <span class="user-rating__number">
                                ${ratingElement.dataset.stars}
                            </span>
                        </span>
                    `;

                    let userRatingBlockRendered = new DOMParser().parseFromString(userRatingBlockHtml, "text/html");
                    let userRatingBlockElement = userRatingBlockRendered.querySelector(".user-rating");

                    let ratingStars = parseInt(userRatingBlockElement.dataset.stars);
                    if (ratingStars < 4)
                        userRatingBlockElement.classList.add("user-rating_bad");
                    else if (ratingStars < 7)
                        userRatingBlockElement.classList.add("user-rating_normal");
                    else if (ratingStars < 10)
                        userRatingBlockElement.classList.add("user-rating_good");
                    else
                        userRatingBlockElement.classList.add("user-rating_excellent");

                    let ratingStats = document.querySelector(".rating");
                    let ratingStatsText = ratingStats.querySelector(".stats-option__text");
                    ratingStatsText.textContent = rating.rating;

                    let ratingVotes = ratingStats.querySelector(".stats-option__votes");
                    ratingVotes.textContent = rating.voices_count;

                    userRatingElement.replaceWith(userRatingBlockElement);
                })
        }
    }
    else {
        fetch("../api/add_rating", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title_id: title_id,
                rating: ratingElement.dataset.stars,
            }),
        })
            .then(response => response.json())
            .then(rating => {
                let userRatingBlockHtml = `
                    <span class="user-rating" data-stars="${ratingElement.dataset.stars}">
                        <span class="user-rating__number">
                            ${ratingElement.dataset.stars}
                        </span>
                    </span>
                `;

                let userRatingBlockRendered = new DOMParser().parseFromString(userRatingBlockHtml, "text/html");
                let userRatingBlockElement = userRatingBlockRendered.querySelector(".user-rating");

                let ratingStars = parseInt(userRatingBlockElement.dataset.stars);
                if (ratingStars < 4)
                    userRatingBlockElement.classList.add("user-rating_bad");
                else if (ratingStars < 7)
                    userRatingBlockElement.classList.add("user-rating_normal");
                else if (ratingStars < 10)
                    userRatingBlockElement.classList.add("user-rating_good");
                else
                    userRatingBlockElement.classList.add("user-rating_excellent");

                let ratingStats = document.querySelector(".rating");
                let ratingStatsHeader = ratingStats.querySelector(".stats-option__header");
                let ratingStatsText = ratingStats.querySelector(".stats-option__text");
                ratingStatsText.textContent = rating.rating;

                let ratingVotes = ratingStats.querySelector(".stats-option__votes");
                ratingVotes.textContent = rating.voices_count;

                ratingStatsHeader.append(userRatingBlockElement);
            })
    }
}

document.body.addEventListener("click", function(event) {
    if (!document.querySelector(".modal"))
        return null;
    if (!event.target.closest(".modal__content")) {
        let modal = document.querySelector(".modal");
        modal.remove();
        document.body.style.overflowY = null;
        document.body.style.paddingRight = null;
        return null;
    }
})

function getScrollbarWidth() {

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}