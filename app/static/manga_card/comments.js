class Comments {
    constructor() {
        let commentsForm;
        if (auth)
            commentsForm = `
                <textarea class="comments__input" placeholder="Введите текст"></textarea>
                <div class="comments__send">Отправить</div>
            `;
        else
            commentsForm = `
                <p class="comments-not-auth__text">Чтобы написать комментарий необходимо авторизироваться</p>
                <div class="comments-not-auth__button">
                    <a href="/auth" class="comments-not-auth__login">Войти</a>
                </div>
            `;

        let commentBlockHtml = `
            <div id="comments" class="section">
                <div class="comments__form">
                    ${commentsForm}
                </div>
                <div class="comments__list">
                </div> 
            </div>
           `;

        let commentsBlockConverted = new DOMParser().parseFromString(commentBlockHtml, "text/html");
        this.commentsBlock = commentsBlockConverted.querySelector("#comments");

        if (auth) {
            let commentForm = this.commentsBlock.querySelector(".comments__form");
            commentForm.addEventListener("click", {handleEvent: function(){
                this.comments.querySelector(".comments__input").focus();
                }, comments: this.commentsBlock});

            let commentsFormInput = commentForm.querySelector(".comments__input");
            commentsFormInput.addEventListener("input", function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            }, false);

            let commentButton = this.commentsBlock.querySelector(".comments__send");
            commentButton.addEventListener("click", {handleEvent: this.sendComment, comment: this})
        }
        this.commentsList = [];
    }

    download(page) {
        return fetch("../api/comments?"+ new URLSearchParams({title_id: title_id, page: page}))
            .then(response => response.json());
    }

    show() {
        if(commentsCount === 0) {
            let messageHTML = `
                <div class="no-comments">
                    <h1 class="no-comments__header">Похоже здесь нет комментариев</h1>
                    <p class="no-comments__text">Будьте первым!</p>
                </div>
            `
            let commentsList = this.commentsBlock.querySelector(".comments__list");
            commentsList.innerHTML = messageHTML;
            let section = document.querySelector("#chapters");
            section.replaceWith(this.commentsBlock);
            return null;
        }
        if (this.commentsList.length === 0) {
            this.download(1)
                .then(comments => {
                    //console.log(comments);
                    let newComments = comments.map((comment) => new TitleComment(comment));
                    //console.log(newComments);
                    this.commentsList = this.commentsList.concat(newComments);
                    this.show();
                })
            return null;
        }

        let commentsList = this.commentsBlock.querySelector(".comments__list");
        for (let comment of this.commentsList)
            commentsList.append(comment.element);

        let section = document.querySelector(".section");
        section.replaceWith(this.commentsBlock);

    }

    sendComment() {
        let commentInput = this.comment.commentsBlock.querySelector(".comments__input");
        fetch("../comments/add", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user_id,
                title_id: title_id,
                text: commentInput.value,
            })
        })
            .then((response) => response.json())
            .then((comment) => {
                let commentObject = new TitleComment(comment);
                this.comment.commentsList.unshift(commentObject);

                let commentsList = this.comment.commentsBlock.querySelector(".comments__list");
                if(commentsCount === 0){
                    let message = this.comment.commentsBlock.querySelector(".no-comments");
                    message.remove();
                }
                commentsList.prepend(commentObject.element);
                commentInput.value = "";
                commentsCount += 1;
            })
    }

    load(){
        if (this.commentsList.length === commentsCount){
            return null;
        }
        this.download(Math.ceil(this.commentsList.length / 20) + 1).then(comments => {
            let commentObject = comments.map(comment => new TitleComment(comment));
            this.commentsList = this.commentsList.concat(commentObject);
            let commentsList = this.commentsBlock.querySelector(".comments__list");
            for (let comment of this.commentsList)
                commentsList.append(comment.element);
        })
    }
}

let comments = new Comments();