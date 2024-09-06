class Comment{
    constructor(commentData, parentComment=undefined, rootComment=undefined) {
        this.id = commentData.id;
        this.parent = commentData.parent;
        this.text = commentData.text;
        this.user = commentData.user;
        this.date = commentData.date;
        this.voteUp = commentData.up_votes;
        this.voteDown = commentData.down_votes;
        this.isVotedByUser = commentData.is_voted_by_user;
        this.userVoteType = commentData.user_vote_type;

        this.element = this.renderElement();

        let voteUp = this.element.querySelector(".rating-up");
        voteUp.addEventListener("click", {handleEvent: this.ratingUp, comment: this});

        let voteDown = this.element.querySelector(".rating-down");
        voteDown.addEventListener("click", {handleEvent: this.ratingDown, comment: this});

        let answerButton = this.element.querySelector(".comment__answer-button");
        answerButton.addEventListener("click", {handleEvent: this.addAnswer, comment: this});
    }

    renderElement() {
        let dateComment = new Date(Date.parse(this.date));
        let dateNow = new Date(Date.now());
        let dateNowUTC = new Date(dateNow.getUTCFullYear(), dateNow.getUTCMonth(),
            dateNow.getUTCDate(), dateNow.getUTCHours(), dateNow.getUTCMinutes(),
            dateNow.getUTCSeconds(), dateNow.getUTCMilliseconds())
        let timeDelta = dateNowUTC - dateComment;

        let years = Math.floor(timeDelta / 31104000000);
        let month = Math.floor(timeDelta / 2592000000 % 12);
        let days = Math.floor(timeDelta / 86400000 % 30);
        let hours = Math.floor(timeDelta / 3600000 % 24);
        let minutes = Math.floor(timeDelta / 60000 % 60);
        let seconds = Math.floor(timeDelta / 1000 % 60);

        let howOld;
        if (years !== 0){
            if (years === 1 || (years/ 10 >= 2 && years % 10 === 1))
                howOld = years + " год назад";
            else if (2 <= years%10 && years%10 <= 4 && years !== 11 && years !== 12)
                howOld = years + " года назад";
            else
                howOld = years + " лет назад";
        } else if (month !== 0){
            if (month === 1)
                howOld = month + " месяц назад";
            else if (2 <= month <= 4)
                howOld = month + " месяца назад";
            else
                howOld = month + " месяцев назад";
        } else if (days !== 0) {
            if (days === 1 || (days/10 >= 2 && days % 10 === 1))
                howOld = days + " день назад";
            else if (2 <= days%10 && days%10 <= 4 && days !== 11 && days !== 12)
                howOld = days + " дня назад";
            else
                howOld = days + " дней назад";
        } else if (hours !== 0) {
            if (hours === 1 || (hours / 10 >= 2 && hours % 10 === 1))
                howOld = hours + " час назад";
            else if (2 <= hours%10 && hours%10 <= 4 && hours !== 11 && hours !== 12)
                howOld = hours + " часа назад";
            else
                howOld = hours + " часов назад";
        } else if (minutes !== 0){
            if (minutes === 1 || (minutes / 10 >= 2 && minutes % 10 === 1))
                howOld = minutes + " минута назад";
            else if (2 <= minutes%10 && minutes%10 <= 4 && minutes !== 11 && minutes !== 12)
                howOld = minutes + " минуты назад";
            else
                howOld = minutes + " минут назад";
        } else {
            if (seconds === 1 || (seconds / 10 >= 2 && seconds % 10 === 1))
                howOld = seconds + " секунда назад";
            else if (2 <= seconds%10 && seconds <= 4 && seconds !== 11 && seconds !== 12)
                howOld = seconds + " секунды назад";
            else
                howOld = seconds + " секунд назад";
        }

         let elementHTML = `
            <div class="comment">
                <div class="comment__user">
                    <img class="user__avatar" src="${this.user.avatar}">
                    <div class="user__info">
                        <span class="user__name">${this.user.login}</span>
                        <span class="comment__date">${howOld}</span>
                    </div>
                </div>
                <div class="comment__text">${this.text}</div>
                <div class="comment__reactions">
                    <div class="comment__rating">
                        <div class="rating__button rating-up${(this.isVotedByUser && this.userVoteType) ? " rating__button_active" : ""}">
                            <img class="rating-up__image" src="../static/manga_card/images/rating-up.svg">
                        </div>
                        <span class="rating__text">${this.voteUp - this.voteDown}</span>
                        <div class="rating__button rating-down${(this.isVotedByUser && !this.userVoteType) ? " rating__button_active" : ""}">
                            <img class="rating-down__image" src="../static/manga_card/images/rating-down.svg">
                        </div>
                    </div>
                    <span class="comment__answer-button">ответить</span>
                </div>
            </div>
        `
        let elementRendered = new DOMParser().parseFromString(elementHTML, "text/html");
        return elementRendered.querySelector(".comment");
    }

    ratingUp(event) {
        if (auth) {
            fetch("../api/vote", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    commentId: this.comment.id,
                    type: 1,
                }),
            }).then((response) => {
                if (response.ok) {
                    let commentRating = this.comment.element.querySelector(".rating__text");
                    let voteUp = this.comment.element.querySelector(".rating-up");
                    let voteDown = this.comment.element.querySelector(".rating-down");
                    if (this.comment.isVotedByUser){
                        if (this.comment.userVoteType === 1){
                            commentRating.textContent = parseInt(commentRating.textContent) - 1;
                            this.comment.isVotedByUser = false;
                            voteUp.classList.remove("rating__button_active");
                            delete this.comment.userVoteType;
                        }
                        else{
                            commentRating.textContent = parseInt(commentRating.textContent) + 2;
                            voteUp.classList.add("rating__button_active");
                            voteDown.classList.remove("rating__button_active");
                            this.comment.userVoteType = 1;
                        }
                    }
                    else{
                        commentRating.textContent = parseInt(commentRating.textContent) + 1;
                        voteUp.classList.add("rating__button_active");
                        this.comment.isVotedByUser = true;
                        this.comment.userVoteType = 1;
                    }
                }
            });
        }
    }

    ratingDown(event) {
        if (auth) {
            fetch("../api/vote", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    commentId: this.comment.id,
                    type: 0,
                }),
            }).then((response) => {
                if (response.ok) {
                    let commentRating = this.comment.element.querySelector(".rating__text");
                    let voteUp = this.comment.element.querySelector(".rating-up");
                    let voteDown = this.comment.element.querySelector(".rating-down");
                    if (this.comment.isVotedByUser){
                        if (this.comment.userVoteType === 0){
                            commentRating.textContent = parseInt(commentRating.textContent) + 1;
                            this.comment.isVotedByUser = false;
                            voteDown.classList.remove("rating__button_active");
                            delete this.comment.userVoteType;
                        }
                        else{
                            commentRating.textContent = parseInt(commentRating.textContent) - 2;
                            voteDown.classList.add("rating__button_active");
                            voteUp.classList.remove("rating__button_active");
                            this.comment.userVoteType = 0;
                        }
                    }
                    else{
                        commentRating.textContent = parseInt(commentRating.textContent) -1;
                        this.comment.isVotedByUser = true;
                        voteDown.classList.add("rating__button_active");
                        this.comment.userVoteType = 0;
                    }
                }
            });
        }
    }

    addAnswer(event){
        if (this.comment.answerForm){
            this.comment.answerForm.remove();
            delete this.comment.answerForm;
        }
        else {
            let answerForm;
            if (auth)
                answerForm = `
                <textarea class="comments__input" placeholder="Введите текст"></textarea>
                <div class="comments__send">Отправить</div>
            `;
            else
                answerForm = `
                <p class="comments-not-auth__text">Чтобы написать комментарий необходимо авторизироваться</p>
                <div class="comments-not-auth__button">
                    <a href="login" class="comments-not-auth__login">Войти</a>
                </div>
            `;
            let answerFormHtml = `
            <div class="comments__form answer__form">
                ${answerForm}
            </div>
            `;
            let answerFormRendered = new DOMParser().parseFromString(answerFormHtml, "text/html");
            let answerFormElement = answerFormRendered.querySelector(".comments__form");

            this.comment.answerForm = answerFormElement;
            if (auth) {
                let answerFormInput = answerFormElement.querySelector(".comments__input");
                answerFormElement.addEventListener("click", function () {
                    answerFormInput.focus();
                });
                answerFormInput.addEventListener("input", function () {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                }, false);
            }
            let commentReactions = this.comment.element.querySelector(".comment__reactions");
            commentReactions.after(answerFormElement);
            let sendAnswerButton = this.comment.element.querySelector(".comments__send");
            sendAnswerButton.addEventListener("click", {handleEvent: this.comment.sendAnswer, comment: this.comment});
        }
    }

    sendAnswer(event) {
        let text = this.comment.answerForm.querySelector(".comments__input").value;
        let parent = this.comment.id;
        let root;
        if (this.comment.rootId)
            root = this.comment.rootId;
        else
            root = this.comment.id;

        fetch("../api/comments", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                parent: parent,
                root: root,
                user_id: user_id,
                title_id: title_id,
                text: text,
            })
        })
            .then((response) => response.json())
            .then((comment) => {
                let commentObject = new CommentAnswer(comment, this.comment, this.comment.root);
                if (this.comment.root){
                    // Проверяем, показаны ли ответы на комментарий и если нет, то показываем
                    if (!commentObject.root.element.querySelector(".answers__list"))
                        commentObject.root.showAnswers();
                    let answerList = commentObject.root.element.querySelector(".answers__list");
                    answerList.append(commentObject.element);
                }
                else {
                    this.comment.answersCount += 1;
                    if (this.comment.element.querySelector(".show-answers__answers-count")){
                        let answersCount = this.comment.element.querySelector(".show-answers__answers-count");
                        answersCount.textContent = this.comment.answersCount;
                    }
                    if (this.comment.id == comment.root && this.comment.answers.length === 0){
                        this.comment.loadAnswers(this.comment.id).then(answers => {
                            let answersObjects = answers.map(answer => new CommentAnswer(answer, this.comment));
                            this.comment.answers = this.comment.answers.concat(answersObjects);
                            this.comment.showAnswers();
                        })
                    }
                    else {
                        if (this.comment.id == comment.root && !this.comment.element.querySelector(".answers__list"))
                            this.comment.showAnswers();
                        let answerList = this.comment.element.querySelector(".answers__list");
                        this.comment.answers.push(commentObject);
                        answerList.append(commentObject.element);
                    }
                }
                let commentForm = this.comment.element.querySelector(".comments__form");
                commentForm.remove();
            })
    }
}

class TitleComment extends Comment {
    constructor(commentData) {
        super(commentData);
        this.answersCount = commentData.answers_count;
        this.answers = [];
        if (this.answersCount > 0){
            let commentReactions = this.element.querySelector(".comment__reactions");
            let showAnswersButtonHTML = `
                <span class="comment__show-answers show-answers">
                    ПОКАЗАТЬ ОТВЕТЫ(<span class="show-answers__answers-count">${this.answersCount}</span>)
                    <img class="show-answers__image" src="../static/manga_card/images/rating-down.svg">
                </span>
            `;

            let showAnswersButtonRendered = new DOMParser().parseFromString(showAnswersButtonHTML, "text/html");
            let showAnswersButton = showAnswersButtonRendered.querySelector(".show-answers");
            showAnswersButton.addEventListener("click", {handleEvent: function(){
                this.comment.showAnswers();
                }, comment: this});

            commentReactions.append(showAnswersButton);
        }
    }


    showAnswers() {
        if (this.element.querySelector(".comment__answers")){
            let commentAnswers = this.element.querySelector(".comment__answers");
            commentAnswers.remove();
            let showCommentsButton = this.element.querySelector(".show-answers__image");
            showCommentsButton.src = "../static/manga_card/images/rating-down.svg";
            return null;
        }
        if(this.answers.length === 0){
            this.loadAnswers(this.id).then(answers => {
                let answersObjects = answers.map(answer => new CommentAnswer(answer, null, this));
                this.answers = this.answers.concat(answersObjects);
                this.showAnswers();
            });
            return null;
        }
        if (!this.element.querySelector(".show-answers") && this.answers.length != 0) {
            let showAnswersButtonHTML = `
                <span class="comment__show-answers show-answers">
                    ПОКАЗАТЬ ОТВЕТЫ(<span class="show-answers__answers-count">${this.answers.length}</span>)
                    <img class="show-answers__image" src="../static/manga_card/images/rating-up.svg">
                </span>
            `;
            let showAnswerButtonRendered = new DOMParser().parseFromString(showAnswersButtonHTML, "text/html");
            let showAnswerButtonElement = showAnswerButtonRendered.querySelector(".show-answers");

            let commentReactions = this.element.querySelector(".comment__reactions");
            commentReactions.append(showAnswerButtonElement);
        }
        let showCommentsButton = this.element.querySelector(".show-answers__image");
        showCommentsButton.src = "../static/manga_card/images/rating-up.svg";
        let answersBlockHtml = `
            <div class="comment__answers">
                <div class="answers__line"></div>
                <div class="answers__list">
                </div>
            </div>
        `;
        let answerBlockRendered = new DOMParser().parseFromString(answersBlockHtml, "text/html");
        let answerBlockElement = answerBlockRendered.querySelector(".comment__answers");
        let answersList = answerBlockElement.querySelector(".answers__list");
        for(let answer of this.answers)
            answersList.append(answer.element);
        this.element.append(answerBlockElement);
    }


    loadAnswers(commentId) {
        return fetch("../api/comments?"+ new URLSearchParams({root: commentId}))
            .then(response => response.json());
    }
}

class CommentAnswer extends Comment{
    constructor(commentData, parent=undefined, root=undefined) {
        super(commentData);
        this.parentId = commentData.parent;
        this.rootId = commentData.root;
        this.parent = parent;
        this.root = root;
    }
}