class RatingLabel extends Component {
    html() {
        return `
            <span class="user-rating user-rating_normal" data-stars="0">
                <span class="user-rating__number">0</span>
            </span>
        `
    }
}

class Rating extends Component {
    constructor(ratingLabel) {
        super();

        if (!ratingLabel){
            this.rating = 0;
            this.ratingLabel = new RatingLabel().render();
        }
        else {
            this.rating = ratingLabel.dataset.stars;
            this.ratingLabel = ratingLabel;
        }
    }

    html() {
        return `
            <ul class="rating__list">
                <li class="rating__item rating__option" data-stars="10">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">10</span>
                    <span class="rating__option-description">Превосходно!!!</span>
                </li>
                <li class="rating__item rating__option" data-stars="9">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">9</span>
                    <span class="rating__option-description">Превосходно</span>
                </li>
                <li class="rating__item rating__option" data-stars="8">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">8</span>
                    <span class="rating__option-description">Супер</span>
                </li>
                <li class="rating__item rating__option" data-stars="7">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">7</span>
                    <span class="rating__option-description">Отлично</span>
                </li>
                <li class="rating__item rating__option" data-stars="6">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">6</span>
                    <span class="rating__option-description">Хорошо</span>
                </li>
                <li class="rating__item rating__option" data-stars="5">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">5</span>
                    <span class="rating__option-description">Неплохо</span>
                </li>
                <li class="rating__item rating__option" data-stars="4">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">4</span>
                    <span class="rating__option-description">С пивом пойдет</span>
                </li>
                <li class="rating__item rating__option" data-stars="3">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">3</span>
                    <span class="rating__option-description">Плохо</span>
                </li>
                <li class="rating__item rating__option" data-stars="2">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">2</span>
                    <span class="rating__option-description">Ужасно</span>
                </li>
                <li class="rating__item rating__option" data-stars="1">
                    <img class="rating__option-image" src="../static/manga_card/manga_card/images/star.svg">
                    <span class="rating__option-number">1</span>
                    <span class="rating__option-description">Отвратительно</span>
                </li>
            </ul>
        `
    }

    events(element) {
        this.element.addEventListener("click", this.onChooseRating.bind(this));
    }

    onChooseRating(event) {
        if (!event.target.closest(".rating__option"))
            return null;

        let option = event.target.closest(".rating__option");

        if (!this.rating)
            return this.addRating(option.dataset.stars);

        if (this.rating === option.dataset.stars)
            return this.deleteRating();
        else
            return this.updateRating(option.dataset.stars);
    }

    deleteRating(){
        fetch("../api/rating", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title_id: DATA.title.id,
                rating: this.rating
            })
        })
            .then(response => response.json())
            .then(function (response) {
                if (response.status !== "ok"){
                    if (response.detail === "unauthorized")
                        notify.push(new Notify("Ошибка", "Вы не авторизованы!"));
                    return null;
                }

                this.rating = undefined;
                this.dispatchEvent(new CustomEvent("deleteRating", {detail: {rating: this}}));
            }.bind(this))
    }

    updateRating(rating){
        fetch("../api/rating", {
            method: "UPDATE",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title_id: DATA.title.id,
                rating: rating,
            })
        })
            .then(response => response.json())
            .then(function(response) {
                if (response.status !== "ok"){
                    if (response.detail === "unauthorized")
                        notify.push(new Notify("Ошибка", "Вы не авторизованы!"));
                    return null;
                }

                this.ratingLabel.textContent = rating;
                this.rating = rating;
                this.editRatingLabel(rating);
                this.dispatchEvent(new CustomEvent("updateRating", {detail: {rating: this}}));
            }.bind(this));
    }

    addRating(rating){
        fetch("../api/rating", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title_id: DATA.title.id,
                rating: rating,
            }),
        })
            .then(response => response.json())
            .then(function (response){
                if (response.status !== "ok"){
                    if (response.detail === "unauthorized")
                        notify.push(new Notify("Ошибка", "Вы не авторизованы!"));
                    return null;
                }

                this.ratingLabel.textContent = rating;
                this.rating = rating;
                this.editRatingLabel(rating);
                this.dispatchEvent(new CustomEvent("addRating", {detail: {rating: this}}));
            }.bind(this))
    }

    editRatingLabel(rating) {
        this.ratingLabel.className = "user-rating";
        console.log(rating);

        if (rating < 4)
            this.ratingLabel.classList.add("user-rating_bad");
        else if (rating < 7)
            this.ratingLabel.classList.add("user-rating_normal");
        else if (rating < 10)
            this.ratingLabel.classList.add("user-rating_good");
        else
            this.ratingLabel.classList.add("user-rating_excellent");
    }
}

const notify = new NotifyManager();
const rating = new Rating(document.querySelector(".user-rating"));
const modal = new Modal(rating.render());
const ratingButton = document.querySelector(".rating__button");
const ratingText = document.querySelector(".rating__text");

ratingButton.addEventListener("click", function(event){
    modal.open();
})

rating.addEventListener("addRating", function(event) {
    ratingText.textContent = "Ваша оценка:";
    ratingButton.append(event.detail.rating.ratingLabel);
})

rating.addEventListener("deleteRating", function(event) {
    ratingText.innerHTML = `
        Оценить
        <svg width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
        </svg>
    `;
    event.detail.rating.ratingLabel.remove();
})


