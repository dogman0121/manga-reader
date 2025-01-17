class RatingLabel extends Component {
    constructor(rating) {
        super();

        this.rating = rating;
    }

    html() {
        return `
            <span class="rating-button__text">Ваша оценка:
                <span class="user-rating ${this.getClass(this.rating)}" data-stars="${this.rating}">
                    <span class="user-rating__number">{{ this.rating }}</span>
                </span>
            </span>
        `
    }

    set(newRating){
        this.element.querySelector(".user-rating").classList.remove(this.getClass(this.rating));
        this.element.querySelector(".user-rating").classList.add(this.getClass(newRating));
        this.element.querySelector(".user-rating").dataset.stars = newRating;
        this.element.querySelector(".user-rating__number").textContent = newRating;
        this.rating = newRating;
    }

    getClass(rating) {
        if (rating < 4)
            return "user-rating_bad";
        else if (rating < 7)
            return "user-rating_normal";
        else if (rating < 10)
            return "user-rating_good";
        else
            return "user-rating_excellent";
    }
}

class NoRatingLabel extends Component {
    html() {
        return `
            <span class="rating-button__text">
                Оценить
                <svg width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                </svg>
            </span>
        `
    }
}

class Rating extends Component {
    constructor() {
        super();

        this.fetchRating();

        this.list = new RatingList();
        this.modal = new Modal(this.list);


        this.emptyLabel = new NoRatingLabel();
        this.ratingLabel = new RatingLabel(this.rating);

        if (this.rating)
            this.content = new State(this.ratingLabel);
        else
            this.content = new State(this.emptyLabel);
    }

    html() {
        return `
            <div class="rating-button">
                {{ this.content }}
            </div>
        `
    }

    events(element) {
        this.element.addEventListener("click", this.onClick.bind(this));
        this.list.addEventListener("chooseRating", this.onChooseRating.bind(this));
    }

    fetchRating(){
        fetch("/api/rating?" + new URLSearchParams({title: DATA.title.id}).toString())
            .then(response => response.json())
            .then(rating => {
                this.rating = rating;
            })
            .catch(e => {
                console.log(e);
            })
    }

    onClick(event) {
        this.modal.open();
    }

    onChooseRating(event) {
        const rating = parseInt(event.detail.rating);

        if (!this.rating)
            this.addRating(rating);
        else if (this.rating === rating)
            this.deleteRating();
        else
            this.updateRating(rating);
    }

    deleteRating(){
        fetch("../api/rating", {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: DATA.title.id,
                rating: this.rating
            })
        })
            .then(response => {
                this.setRating(undefined);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    updateRating(rating){
        console.log(rating);
        fetch("../api/rating", {
            method: "UPDATE",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: DATA.title.id,
                rating: rating,
            })
        })
            .then(response => {
                this.setRating(rating);
            })
            .catch(e => {
                console.log(e);
            });
    }

    addRating(rating){
        fetch("../api/rating", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: DATA.title.id,
                rating: rating,
            }),
        })
            .then(response => {
                this.setRating(rating);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    setRating(rating) {
        if (!rating)
            this.content.set(this.emptyLabel);
        else {
            this.content.set(this.ratingLabel)
            this.ratingLabel.set(rating)
        }

        this.rating = rating;
    }
}

class RatingList extends Component {

    html() {
        return `
            <ul class="rating__list">
                <li class="rating__item rating__option" data-stars="10">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">10</span>
                    <span class="rating__option-description">Превосходно!!!</span>
                </li>
                <li class="rating__item rating__option" data-stars="9">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">9</span>
                    <span class="rating__option-description">Превосходно</span>
                </li>
                <li class="rating__item rating__option" data-stars="8">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">8</span>
                    <span class="rating__option-description">Супер</span>
                </li>
                <li class="rating__item rating__option" data-stars="7">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">7</span>
                    <span class="rating__option-description">Отлично</span>
                </li>
                <li class="rating__item rating__option" data-stars="6">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">6</span>
                    <span class="rating__option-description">Хорошо</span>
                </li>
                <li class="rating__item rating__option" data-stars="5">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">5</span>
                    <span class="rating__option-description">Неплохо</span>
                </li>
                <li class="rating__item rating__option" data-stars="4">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">4</span>
                    <span class="rating__option-description">С пивом пойдет</span>
                </li>
                <li class="rating__item rating__option" data-stars="3">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">3</span>
                    <span class="rating__option-description">Плохо</span>
                </li>
                <li class="rating__item rating__option" data-stars="2">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
                    <span class="rating__option-number">2</span>
                    <span class="rating__option-description">Ужасно</span>
                </li>
                <li class="rating__item rating__option" data-stars="1">
                    <svg class="rating__option-image" width="18px" height="18px" viewBox="0 -0.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0005 0L21.4392 9.27275L32.0005 11.5439L24.8005 19.5459L25.889 30.2222L16.0005 25.895L6.11194 30.2222L7.20049 19.5459L0.000488281 11.5439L10.5618 9.27275L16.0005 0Z" fill="#FFCB45"/>
                    </svg>
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

        this.dispatchEvent(new CustomEvent("chooseRating", {detail: {rating: option.dataset.stars}}));
    }
}

document.querySelector(".rating-button").replaceWith(new Rating().render());


