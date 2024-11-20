class CommentBody extends Component{
    constructor(comment) {
        super();
        this.comment = comment;
    }

    html() {
        let dateUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        let commentDate = this.comment.date;
        let howOld = this.formatTimedelta(dateUTC - commentDate);

        return `
            <div class="comment__body">
                <div class="comment__user user">
                    <img class="user__avatar" src="${this.comment.user.avatar}">
                    <div class="user__info">
                        <span class="user__name">${this.comment.user.login}</span>
                        <span class="comment__date">${howOld}</span>
                    </div>
                </div>
                <div class="comment__text">${this.comment.text}</div>
            </div>
        `;
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
                return 3
            else if (1 < n % 10 < 5)
                return 2
            else
                return 1
        }

        if (timeDelta / 31536000000 >= 1){ // Проверяем если прошел хотя бы год после публикации
            let years = parseInt(timeDelta / 31536000000);
            return years.toString() + " " + yearsEnd[findEnd(years)];
        }
        else if (timeDelta / 2692000000 >= 1) { // Проверяем если прошел хотя бы месяц после публикации
            let months = parseInt(timeDelta / 2692000000);
            return months.toString() + " " + monthsEnd[findEnd(months)];
        }
        else if (timeDelta / 604800000 >= 1) { // Проверяем если прошел хотя бы месяц после публикации
            let weeks = parseInt(timeDelta / 604800000);
            return weeks.toString() + " " + monthsEnd[findEnd(weeks)];
        }
        else if (timeDelta / 86400000 >= 1) { // Проверяем если прошел хотя бы месяц после публикации
            let days = parseInt(timeDelta / 86400000);
            return days.toString() + " " + daysEnd[findEnd(days)];
        }
        else if (timeDelta / 3600000 >= 1) { // Проверяем если прошел хотя бы месяц после публикации
            let hours = parseInt(timeDelta / 3600000);
            return hours.toString() + " " + hoursEnd[findEnd(hours)];
        }
        else if (timeDelta / 60000 >= 1) { // Проверяем если прошел хотя бы месяц после публикации
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
    constructor(comment) {
        super();
        this.comment = comment;
        this.answersOpened = 0;
        this.formOpened = 0;
    }

    html() {
        let answersButton = "";
        if (this.comment.answersCount)
            answersButton += `
                <span class="comment__show-answers show-answers">
                    ПОКАЗАТЬ ОТВЕТЫ(<span class="show-answers__answers-count">${this.comment.answersCount}</span>)
                    <svg class="rating-down__image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                    </svg>
                </span>
            `

        const html = `
            <div class="comment__panel">
                <div class="comment__rating">
                    <div class="rating__button rating-up ${(this.comment.userVote === 1) ? " rating__button_active" : ""}">
                        <svg class="rating-image rating-up__image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <span class="rating__text">${this.comment.upVotes - this.comment.downVotes}</span>
                    <div class="rating__button rating-down${(this.comment.userVote === 0) ? " rating__button_active" : ""}">
                        <svg class="rating-image rating-down__image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                        </svg>
                    </div>
                </div>
                <span class="comment__answer-button">ответить</span>
                ${answersButton}
            </div>
        `

        return html;
    }

    events(element) {
        this.element.querySelector(".rating-up").addEventListener("click", this.voteUp.bind(this));
        this.element.querySelector(".rating-down").addEventListener("click", this.voteDown.bind(this));
        this.element.querySelector(".comment__answer-button").addEventListener("click", this.commentFormListener.bind(this));
        this.element.querySelector(".show-answers")?.addEventListener("click", this.answersListener.bind(this));
    }

    voteDown() {
        if (this.voteWork)
            return null;

        this.voteWork = true;
        this.sendVote(0)
            .then(() => {
                const voteUpButton = this.element.querySelector(".rating-up");
                const voteDownButton = this.element.querySelector(".rating-down");
                const votesCounter = this.element.querySelector(".rating__text");
                if (this.comment.userVote === 0){
                    voteDownButton.classList.remove("rating__button_active");
                    votesCounter.textContent = parseInt(votesCounter.textContent) + 1;
                    this.comment.downVotes--;
                    this.comment.userVote = undefined;
                }
                else if (this.comment.userVote === 1) {
                    voteUpButton.classList.remove("rating__button_active");
                    voteDownButton.classList.add("rating__button_active");
                    votesCounter.textContent = parseInt(votesCounter.textContent) - 2;
                    this.comment.upVotes--;
                    this.comment.downVotes++;
                    this.comment.userVote = 0;
                } else {
                    voteDownButton.classList.add("rating__button_active");
                    votesCounter.textContent = parseInt(votesCounter.textContent) - 1;
                    this.comment.downVotes++;
                    this.comment.userVote = 0;
                }
        })
            .then(() => {this.voteWork = false});
    }

    voteUp() {
        if (this.voteWork)
            return null;

        this.voteWork = true;
        this.sendVote(1)
            .then(() => {
                const voteUpButton = this.element.querySelector(".rating-up");
                const voteDownButton = this.element.querySelector(".rating-down");
                const votesCounter = this.element.querySelector(".rating__text");
                if (this.comment.userVote === 1){
                    voteUpButton.classList.remove("rating__button_active");
                    votesCounter.textContent = parseInt(votesCounter.textContent) - 1;
                    this.comment.upVotes--;
                    this.comment.userVote = undefined;
                }
                else if (this.comment.userVote === 0) {
                    voteDownButton.classList.remove("rating__button_active");
                    voteUpButton.classList.add("rating__button_active");
                    votesCounter.textContent = parseInt(votesCounter.textContent) + 2;
                    this.comment.upVotes++;
                    this.comment.downVotes--;
                    this.comment.userVote = 1;
                } else {
                    voteUpButton.classList.add("rating__button_active");
                    votesCounter.textContent = parseInt(votesCounter.textContent) + 1;
                    this.comment.upVotes++;
                    this.comment.userVote = 1;
                }
        })
            .then(() => {this.voteWork = false});
    }

    sendVote(voteType){
        return fetch("../api/vote", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: this.comment.id,
                type: voteType,
            })
        })
    }

    answersListener(event) {
        if (this.answersOpened)
            this.closeAnswers();
        else
            this.showAnswers();
    }

    commentFormListener(event) {
        if (this.commentFormOpened)
            this.closeCommentForm();
        else
            this.showCommentForm();
    }

    showAnswers() {
        this.answersOpened = true;
        let event = new CustomEvent("answersOpened", {detail: {"comment": this.comment}});
        this.dispatchEvent(event);
    }

    closeAnswers() {
        this.answersOpened = false;
        let event = new CustomEvent("answersClosed", {detail: {"comment": this.comment}});
        this.dispatchEvent(event);
    }

    showCommentForm() {
        this.commentFormOpened = true;
        let event = new CustomEvent("formOpened", {detail: {"comment": this.comment}});
        this.dispatchEvent(event);
    }

    closeCommentForm() {
        this.commentFormOpened = false;
        let event = new CustomEvent("formClosed", {detail: {"comment": this.comment}});
        this.dispatchEvent(event);
    }
}

class CommentForm extends Component{
    constructor(comment) {
        super();
        this.comment = comment;
    }

    html() {
        let html;
        if (auth)
            html = `
                <div class="comment__form">
                    <textarea class="comments__input" placeholder="Введите текст"></textarea>
                    <button class="comments__send">Отправить</button>
                </div>
            `
        else
            html = `
                <div class="comment__form">
                    <p class="comments-not-auth__text">Чтобы написать комментарий необходимо авторизоваться</p>
                    <div class="comments-not-auth__button">
                        <a href="/auth" class="comments-not-auth__login">Войти</a>
                    </div>
                </div>
            `
        return html;
    }

    events(element) {
        element.querySelector(".comments__send")?.addEventListener("click", this.sendAnswer.bind(this));
    }

    sendAnswer(){
        let textarea = this.element.querySelector(".comments__input");
        let text = textarea.value;
        textarea.value = "";

        fetch("/api/comments", {
            method: "POST",
             headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": title_id,
                "text": text,
                "user": user_id,
                "root": this.comment.root ? this.comment.root : this.comment.id,
                "parent": this.comment.id
            })
        })
            .then((response) => response.json())
            .then((comment) => {
                let commentObj = Comment.createFromObj(comment);

                let event = new CustomEvent("commentSend", {detail: {"comment": commentObj}});
                this.dispatchEvent(event);
            })
    }

    show() {
        this.element.classList.add("comment__form_visible");
    }

    hide() {
        this.element.classList.remove("comment__form_visible");
    }
}

class CommentAnswers extends Component{
    answers = [];

    constructor(comment) {
        super();
        this.comment = comment;
    }

    html() {
        let html = `
            <div class="comment__answers">
                <div class="answers__list">
                </div>
            </div>
        `
        return html;
    }

    addBack(comment) {
        this.answers.push(comment);
        this.element.querySelector(".answers__list").append(comment.render());
        this.comment.answersCount ++;
    }

    addFront(comment){
        this.answers.push(comment);
        this.element.querySelector(".answers__list").prepend(comment.render());
        this.comment.answersCount ++;
    }

    load(){
        if (this.comment.answersCount === this.answers.length)
            return null;

        fetch("/api/comments?" + new URLSearchParams({parent: this.comment.id}))
            .then((response) => response.json())
            .then((comments) => {
                for (let comment of comments){
                    this.addBack(Comment.createFromObj(comment));
                }
            })
    }

    show() {
        if (this.answers.length === 0)
            this.load();
        this.element.classList.add("comment__answers_visible");
    }

    hide() {
        this.element.classList.remove("comment__answers_visible");
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

        this.commentBody = new CommentBody(this);
        this.commentPanel = new CommentPanel(this);
        this.commentForm = new CommentForm(this);
        this.commentAnswers = new CommentAnswers(this);
    }

    static createFromObj(obj) {
        let comment = new Comment(
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

        return comment;
    }

    html() {
        return `
            <div data-id="${this.id}" class="comment">
                {{ this.commentBody }}
                {{ this.commentPanel }}
                {{ this.commentForm }}
                {{ this.commentAnswers }}
            </div>
        `
    }

    events(element) {
        this.commentPanel.addEventListener("answersOpened", this.commentAnswers.show.bind(this.commentAnswers));
        this.commentPanel.addEventListener("answersClosed", this.commentAnswers.hide.bind(this.commentAnswers));
        this.commentPanel.addEventListener("formOpened", this.commentForm.show.bind(this.commentForm));
        this.commentPanel.addEventListener("formClosed", this.commentForm.hide.bind(this.commentForm));
        this.commentForm.addEventListener("commentSend", (e) => this.commentAnswers.addFront(e.detail.comment));
        this.commentForm.addEventListener("commentSend", this.commentPanel.showAnswers.bind(this.commentPanel));
    }
}


class TitleComment extends Comment {
    constructor() {
        super(undefined, DATA.title, {}, "");
        this.page = 1;
        this.loadComments();
    }

    html() {
        return `
            <div class="title__comments">
                {{ this.commentForm }}
                {{ this.commentAnswers }}
            </div>
        `
    }

    events(){
        this.commentForm.addEventListener("commentSend", (e) => this.commentAnswers.addFront(e.detail.comment));
        window.addEventListener("scroll", () => {
            let commentsList = document.querySelector(".comment__answers");
            let commentsCords = commentsList.getBoundingClientRect();
            let commentsBottom = commentsCords.bottom;
            if((commentsBottom - document.documentElement.clientHeight) < 10)
                this.loadComments();
        })
    }

    loadComments() {
        if (this.cantLoad)
            return null;

        if (this.loadProcess)
            return null;

        this.loadProcess = true;
        fetch("../api/comments?"+ new URLSearchParams({page: this.page, title: this.title.id}))
            .then((response) => response.json())
            .then((comments) => {
                if (comments.length === 0){
                    this.cantLoad = true;
                    return null;
                }
                else {
                    for (let comment of comments){
                        console.log(this.commentAnswers);
                        this.commentAnswers.addBack(Comment.createFromObj(comment));
                    }
                    this.page += 1
                }
            })
            .then(() => {this.loadProcess = false})

    }

}