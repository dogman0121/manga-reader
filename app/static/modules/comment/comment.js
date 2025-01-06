class CommentOptions extends Component{

    html() {
        if (DATA.user.role === 4){
            return `
                <ul class="comments__options-list">
                    <li class="comments__option comments__option_delete">Удалить</li>
                </ul>
            `;
        }
        return `
            <ul class="comments__options-list">
                <li class="comments__option">Пожаловаться</li>
            </ul>
        `;
    }

    events(element) {
        this.element.addEventListener("click", this.onClick.bind(this));
    }

    onClick(event) {
        this.dispatchEvent(new CustomEvent("optionSelected", {detail: {event: event}}));
    }
}

class CommentBody extends Component{
    constructor(user, text, date) {
        super();

        this.user = user;
        this.text = text;
        this.date = date;
    }

    html() {
        let dateUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        let commentDate = this.date;
        let howOld = this.formatTimedelta(dateUTC - commentDate);

        return `
            <div class="comments__body">
                <div class="comments__user user">
                    <img class="comments__user-avatar" src="${this.user.avatar}">
                    <div class="comments__user-info">
                        <span class="comments__user-name">${this.user.login}</span>
                        <span class="comments__date">${howOld}</span>
                    </div>
                    <div class="comments__options-button">
                        <svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-three-dots-vertical">
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="comments__text">${this.text}</div>
            </div>
        `;
    }

    events(element) {
        this.element.querySelector(".comments__options-button").addEventListener("click", this.onCallOptions.bind(this));
    }

    onCallOptions(event) {
        const options = new CommentOptions();
        options.addEventListener("optionSelected", this.onClickOptions.bind(this));

        this.dropDown = new Dropdown(this.element.querySelector(".comments__options-button"), options);
        this.dropDown.show();
    }

    onClickOptions(event) {
        if (event.detail.event.target.classList.contains("comments__option_delete"))
            this.dispatchEvent(new CustomEvent("delete"));
        this.dropDown.hide();
    }

    formatTimedelta(timeDelta) {
        let yearsEnd = {1: "год", 2: "года", 3: "лет"}
        let monthsEnd = {1: "месяц", 2: "месяца", 3: "месяцев"}
        let weeksEnd = {1: "неделя", 2: "недели", 3: "недель"}
        let daysEnd = {1: "день", 2: "дня", 3: "дней"}
        let hoursEnd = {1: "час", 2: "часа", 3: "часов"}
        let minutesEnd = {1: "минута", 2: "минуты", 3: "минут"}
        let secondsEnd = {1: "секунда", 2: "секунды", 3: "секунд"}

        let findEnd = (n) => {
            if ((n % 10 > 4) || (20 < n < 10) || (n % 10 === 0))
                return 3;
            else if (1 < n % 10 < 5)
                return 2;
            else
                return 1;
        }

        if (timeDelta / 31536000000 >= 1){ // Проверяем если прошел хотя бы год после публикации
            let years = parseInt(timeDelta / 31536000000);
            return years.toString() + " " + yearsEnd[findEnd(years)];
        }
        else if (timeDelta / 2692000000 >= 1) { // Проверяем если прошел хотя бы месяц после публикации
            let months = parseInt(timeDelta / 2692000000);
            return months.toString() + " " + monthsEnd[findEnd(months)];
        }
        else if (timeDelta / 604800000 >= 1) { // Проверяем если прошел хотя бы неделя после публикации
            let weeks = parseInt(timeDelta / 604800000);
            return weeks.toString() + " " + monthsEnd[findEnd(weeks)];
        }
        else if (timeDelta / 86400000 >= 1) { // Проверяем если прошел хотя бы день после публикации
            let days = parseInt(timeDelta / 86400000);
            return days.toString() + " " + daysEnd[findEnd(days)];
        }
        else if (timeDelta / 3600000 >= 1) { // Проверяем если прошел хотя бы час после публикации
            let hours = parseInt(timeDelta / 3600000);
            return hours.toString() + " " + hoursEnd[findEnd(hours)];
        }
        else if (timeDelta / 60000 >= 1) { // Проверяем если прошел хотя бы минута после публикации
            let minutes = parseInt(timeDelta / 60000);
            return minutes.toString() + " " + minutesEnd[findEnd(minutes)];
        }
        else { // Обрабатываем секунды
            let seconds = parseInt(timeDelta / 1000);
            return seconds.toString() + " " + secondsEnd[findEnd(seconds)];
        }
    }

}

class CommentPanel extends Component{
    constructor(upVotes, downVotes, userVote, answersCount) {
        super();

        this.upVotes = upVotes;
        this.downVotes = downVotes;
        this.userVote = userVote;
        this.answersCount = answersCount;
    }

    html() {
        let answersButton = `
            <span class="comments__show-answers show-answers">
                ПОКАЗАТЬ ОТВЕТЫ(<span class="comments__show-answers-answers-count">${this.answersCount}</span>)
                <svg class="comments__rating-down-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                </svg>
            </span>
        `;

        return `
            <div class="comments__panel">
                <div class="comments__rating">
                    <div class="comments__rating-button comments__rating-up ${(this.userVote === 1) ? " comments__rating-button_active" : ""}">
                        <svg class="comments__rating-image comments__rating-up-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <span class="comments__rating-text">${this.upVotes - this.downVotes}</span>
                    <div class="comments__rating-button comments__rating-down ${(this.userVote === 0) ? " comments__rating-button_active" : ""}">
                        <svg class="comments__rating-image comments__rating-down-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                        </svg>
                    </div>
                </div>
                <span class="comments__answer-button">ответить</span>
                ${ this.answersCount ? answersButton : "" }
            </div>
        `;
    }

    events(element) {
        element.querySelector(".comments__rating-up").addEventListener("click", this.onVoteUp.bind(this));
        element.querySelector(".comments__rating-down").addEventListener("click", this.onVoteDown.bind(this));
        element.querySelector(".comments__answer-button").addEventListener("click", this.onShowForm.bind(this));
        element.querySelector(".comments__show-answers")?.addEventListener("click", this.onShowAnswers.bind(this));
    }

    onVoteUp() {
        this.dispatchEvent(new CustomEvent("voteUp"));
    }

    onVoteDown() {
        this.dispatchEvent(new CustomEvent("voteDown"))
    }

    onShowForm() {
        this.dispatchEvent(new CustomEvent("showForm"));
    }

    onShowAnswers() {
        this.dispatchEvent(new CustomEvent("showAnswers"));
    }

    addVoteUp() {
        const voteUpButton = this.element.querySelector(".comments__rating-up");
        const votesCounter = this.element.querySelector(".comments__rating-text");

        voteUpButton.classList.add("comments__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) + 1;
    }

    removeVoteUp() {
        const voteUpButton = this.element.querySelector(".comments__rating-up");
        const votesCounter = this.element.querySelector(".comments__rating-text");

        voteUpButton.classList.remove("comments__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) - 1;
    }

    addVoteDown() {
        const voteDownButton = this.element.querySelector(".comments__rating-down");
        const votesCounter = this.element.querySelector(".comments__rating-text");

        voteDownButton.classList.add("comments__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) - 1;
    }

    removeVoteDown() {
        const voteDownButton = this.element.querySelector(".comments__rating-down");
        const votesCounter = this.element.querySelector(".comments__rating-text");

        voteDownButton.classList.remove("comments__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) + 1;
    }
}

class CommentForm extends Component{
    constructor(minLength=0, maxLength=300 ) {
        super();
        this.minLength = minLength;
        this.maxLength = maxLength;
    }

    html() {
        if (Object.keys(DATA.user).length !== 0)
            return `
                <div class="comments__form">
                    <textarea class="comments__form-input" placeholder="Введите текст"></textarea>
                    <div class="comments__form-panel">
                        <div class="comments__form-length">
                            <span class="comments__form-current-length">0</span>
                            /
                            <span class="comments__form-max-length">{{ this.maxLength }}</span>
                        </div>
                        <button class="comments__form-send">Отправить</button>
                    <div>
                </div>
            `;
        else
            return `
                <div class="comments__form">
                    <p class="comments__not-auth-text">Чтобы написать комментарий необходимо авторизоваться</p>
                    <div class="comments__not-auth-button">
                        <a href="/auth" class="comments__not-auth-login">Войти</a>
                    </div>
                </div>
            `;
    }

    events(element) {
        element.querySelector(".comments__form-send")?.addEventListener("click", this.onSend.bind(this));
        registerResize(element.querySelector("textarea"));
        element.querySelector("textarea")?.addEventListener("input", this.onInput.bind(this));
    }

    onSend(event) {
        const text = this.element.querySelector(".comments__form-input").value;
        if (this.validateInput(text))
            this.dispatchEvent(new CustomEvent("send", {detail: {value: text}}));
    }

    onInput(event){
        this.element.querySelector(".comments__form-current-length").textContent = event.target.value.length;

        if (!this.validateInput(event.target.value)){
            this.element.classList.add("comments__form_error");
            this.element.querySelector(".comments__form-length").classList.add("comments__form-length_error");
        }
        else {
            this.element.classList.remove("comments__form_error");
            this.element.querySelector(".comments__form-length").classList.remove("comments__form-length_error");
        }
    }

    validateInput(value) {
        return this.minLength <= value.length && value.length <= this.maxLength;
    }

    show() {
        this.element.classList.add("comments__form_visible");
        this.opened = true;
    }

    hide() {
        this.element.classList.remove("comments__form_visible");
        this.opened = false;
    }

    clean() {
        this.element.querySelector(".comments__form-input").value = "";
    }
}

class CommentAnswers extends Component{
    answers = [];

    html() {
        return `
            <div class="comments__answers">
                <div class="comments__answers-list">
                </div>
            </div>
        `;
    }

    addBack(comment) {
        this.answers.push(comment);
        this.element.querySelector(".comments__answers-list").append(comment.render());
    }

    addFront(comment){
        this.answers.push(comment);
        this.element.querySelector(".comments__answers-list").prepend(comment.render());
    }

    show() {
        this.element.classList.add("comments__answers_visible");
        this.opened = true;
    }

    hide() {
        this.element.classList.remove("comments__answers_visible");
        this.opened = false;
    }
}

class Comment extends Component{
    constructor(id, title, user, text, date=new Date(), upVotes=0, downVotes=0,
                userVote=undefined, answersCount=0, root=undefined,
                parent=undefined) {
        super();
        this.id = id;
        this.title = title;
        this.user = user;
        this.text = text;
        this.date = date;
        this.upVotes = upVotes;
        this.downVotes = downVotes;
        this.userVote = userVote;
        this.answersCount = answersCount
        this.root = root;
        this.parent = parent;

        this.commentBody = new CommentBody(this.user, this.text, this.date);
        this.commentPanel = new CommentPanel(this.upVotes, this.downVotes, this.userVote, this.answersCount);
        this.commentForm = new CommentForm();
        this.commentAnswers = new CommentAnswers();
    }

    static createFromObj(obj) {
        return new this(
            obj.id,
            obj.title,
            obj.user,
            obj.text,
            new Date(obj.date),
            obj.up_votes,
            obj.down_votes,
            obj.user_vote,
            obj.answers_count,
            obj.root,
            obj.parent
        )
    }

    html() {
        return `
            <div data-id="${this.id}" class="comments__comment">
                {{ this.commentBody }}
                {{ this.commentPanel }}
                {{ this.commentForm }}
                {{ this.commentAnswers }}
            </div>
        `
    }

    events(element) {
        this.commentBody.addEventListener("delete", this.onDelete.bind(this));
        this.commentForm.addEventListener("send", this.onCommentSend.bind(this));
        this.commentPanel.addEventListener("voteUp", this.onVoteUp.bind(this));
        this.commentPanel.addEventListener("voteDown", this.onVoteDown.bind(this));
        this.commentPanel.addEventListener("showForm", this.onShowForm.bind(this));
        this.commentPanel.addEventListener("showAnswers", this.onShowAnswers.bind(this));
    }

    onDelete() {console.log("delete")}

    onCommentSend() {console.log("send")}

    // Comment panel
    onVoteUp() {console.log("vote up")}

    onVoteDown() {console.log("vote down")}

    onShowForm() {console.log("show form")}

    onShowAnswers(){console.log("show answers")}
}