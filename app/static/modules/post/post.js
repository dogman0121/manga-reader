class Posts extends Component {
    constructor(posts) {
        super();

        this.postForm = new PostsForm();

        this.postsList = new PostsList(posts);
        this.noPosts = new NoPosts();

        this.postSection = new State(this.postsList);
    }

    events(element) {
        this.postsList.addEventListener("empty", this.onEmpty.bind(this));
        this.postForm.addEventListener("send", this.onSend.bind(this));
    }

    html() {
        return `
            <div class="posts">
                {{ DATA.user.id === DATA.profile.id ? this.postForm : "" }}
                {{ this.postSection }}
            </div>
        `
    }

    onEmpty(){
        this.postSection.set(this.noPosts);
    }

    onSend(event) {
        this.postForm.clean();
        fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "text": event.detail.value
            })
        })
            .then(response => response.json())
            .then(post => {
                this.postSection.set(this.postsList);
                this.postsList.addFront(new Post(post));
            })
    }
}

class NoPosts extends Component {
    html() {
        if (PROFILE === DATA.user.id)
            return `
                <p class="posts__no-posts">
                    Вы не опубликовали ни одного поста!
                </p>
            `;
        else
            return `
                <p class="posts__no-posts">
                    Пользователь еще не опубликовал
                    <br>
                    ни одного поста!
                </p>
            `;
    }
}

class PostsList extends Component {
    constructor(posts) {
        super();

        this.posts = posts ? posts : [];
        this.page = 1;
    }

    html() {
        return `
            <div class="posts__list">
                {{ this.posts }}
            </div>
        `;
    }

    addFront(post){
        this.element?.prepend(post.element || post.render());
    }

    addBack(post){
        this.element?.append(post.element || post.render());
    }

    onRender(){
        this.loadPosts();
    }

    loadPosts() {
        fetch("/api/posts?" + new URLSearchParams({page: this.page, user: DATA.profile.id}).toString())
            .then(response => response.json())
            .then(posts => {
                if (posts.length === 0)
                    return this.dispatchEvent(new CustomEvent("empty"));

                let post;
                for(let postObj of posts) {
                    post = new Post(postObj);
                    this.posts.push(post);
                    this.addBack(post);
                }
                this.page += 1;
            })
    }
}

class Post extends Component {
    constructor(obj, options) {
        super();

        this.id = obj.id;
        this.user = obj.author;
        this.text = obj.text;
        this.date = new Date(obj.date);
        this.userVote = obj.user_vote

        this.options = options ? options : {};

        if (this.options.size === "max"){
            this.body = new PostBody(obj);
            this.panel = new PostPanel(obj, {size: "max"});
            this.comments = new PostComments(obj);
        } else {
            this.body = new PostBody(obj);
            this.panel = new PostPanel(obj);
        }
    }

    events(element) {
        this.panel.addEventListener("voteUp", this.onVoteUp.bind(this))
        this.panel.addEventListener("voteDown", this.onVoteDown.bind(this))
    }

    html() {
        if (this.options.size === "max")
            return `
                <div class="post" data-id="${this.id}">
                    <div class="post__inner">
                        {{ this.body }}
                        {{ this.panel }}
                    </div>
                    {{ this.comments }}
                </div>
            `;
        else
            return `
                <div class="post" data-id="${this.id}">
                    <div class="post__inner">
                        {{ this.body }}
                        {{ this.panel }}
                    </div>
                </div>
            `;
    }

    onVoteUp() {
        this.sendVote(1);
    }

    onVoteDown() {
        this.sendVote(0);
    }

    sendVote(voteType){
        return fetch("/api/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post: this.id,
                type: voteType
            })
        })
            .then(response => response.json())
            .then((json) => {
                switch (this.userVote) {
                    case 0:
                        if (voteType === 0){
                            this.userVote = undefined;
                            this.panel.removeVoteDown();
                        } else {
                            this.userVote = 1;
                            this.panel.removeVoteDown();
                            this.panel.addVoteUp();
                        }
                        break;
                    case 1:
                        if (voteType === 0){
                            this.userVote = 0;
                            this.panel.removeVoteUp();
                            this.panel.addVoteDown();
                        } else {
                            this.userVote = undefined;
                            this.panel.removeVoteUp();
                        }
                        break;
                    default:
                        if (voteType === 0){
                            this.userVote = 0;
                            this.panel.addVoteDown();
                        } else {
                            this.userVote = 1;
                            this.panel.addVoteUp();
                        }
                        break;
                }
            })
    }
}

class PostBody extends Component {
    constructor(obj) {
        super();

        this.id = obj.id;
        this.user = obj.author;
        this.text = obj.text;
        this.date = new Date(obj.date);
    }

    html() {
        let howOld = CommentBody.formatTimedelta(
            new Date().getTime() + new Date().getTimezoneOffset() * 60000 - this.date
        ) + " назад";

        return `
            <div class="post__body">
                <div class="post__author author">
                    <a href="/profile/${this.user.id}"><img class="post__author-avatar" src="${this.user.avatar}"></a>
                    <div class="post__author-info">
                        <a href="href="/profile/${this.user.id}""><span class="post__author-name">${this.user.login}</span></a>
                        <a href="/posts/?id=${this.id}"><span class="post__date">${howOld}</span></a>
                    </div>
                    <div class="post__options-button">
                        <svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-three-dots-vertical">
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        </svg>
                    </div>
                </div>
                <div class="post__text">${this.text}</div>
            </div>
        `
    }
}

class PostPanel extends Component {
    constructor(obj, options) {
        super();

        this.id = obj.id;
        this.upVotes = obj.up_votes;
        this.downVotes = obj.down_votes;
        this.userVote = obj.user_vote;

        this.options = options ? options : {}
    }

    events(element) {
        element.querySelector(".post__rating-up").addEventListener("click", this.onVoteUp.bind(this));
        element.querySelector(".post__rating-down").addEventListener("click", this.onVoteDown.bind(this));
    }

    html() {
        if (this.options.size === "max")
            return `
                <div class="post__panel">
                    <div class="post__rating">
                        <div class="post__rating-button post__rating-up ${(this.userVote === 1) ? " post__rating-button_active" : ""}">
                            <svg class="post__rating-image post__rating-up-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <span class="post__rating-text">${this.upVotes - this.downVotes}</span>
                        <div class="post__rating-button post__rating-down ${(this.userVote === 0) ? " post__rating-button_active" : ""}">
                            <svg class="post__rating-image post__rating-down-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                </div>
            `;

        else
            return `
                <div class="post__panel">
                    <div class="post__rating">
                        <div class="post__rating-button post__rating-up ${(this.userVote === 1) ? " post__rating-button_active" : ""}">
                            <svg class="post__rating-image post__rating-up-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <span class="post__rating-text">${this.upVotes - this.downVotes}</span>
                        <div class="post__rating-button post__rating-down ${(this.userVote === 0) ? " post__rating-button_active" : ""}">
                            <svg class="post__rating-image post__rating-down-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <a href="/posts/?id=${this.id}">
                        <span class="post__comments-button">
                            <svg class="post__comments-image" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 9H17M7 13H12M21 20L17.6757 18.3378C17.4237 18.2118 17.2977 18.1488 17.1656 18.1044C17.0484 18.065 16.9277 18.0365 16.8052 18.0193C16.6672 18 16.5263 18 16.2446 18H6.2C5.07989 18 4.51984 18 4.09202 17.782C3.71569 17.5903 3.40973 17.2843 3.21799 16.908C3 16.4802 3 15.9201 3 14.8V7.2C3 6.07989 3 5.51984 3.21799 5.09202C3.40973 4.71569 3.71569 4.40973 4.09202 4.21799C4.51984 4 5.0799 4 6.2 4H17.8C18.9201 4 19.4802 4 19.908 4.21799C20.2843 4.40973 20.5903 4.71569 20.782 5.09202C21 5.51984 21 6.0799 21 7.2V20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </a>
                </div>
            `
    }

    onVoteUp(event) {
        this.dispatchEvent(new CustomEvent("voteUp"));
    }

    onVoteDown(event) {
        this.dispatchEvent(new CustomEvent("voteDown"));
    }

    addVoteUp() {
        const voteUpButton = this.element.querySelector(".post__rating-up");
        const votesCounter = this.element.querySelector(".post__rating-text");

        voteUpButton.classList.add("post__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) + 1;
    }

    removeVoteUp() {
        const voteUpButton = this.element.querySelector(".post__rating-up");
        const votesCounter = this.element.querySelector(".post__rating-text");

        voteUpButton.classList.remove("post__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) - 1;
    }

    addVoteDown() {
        const voteDownButton = this.element.querySelector(".post__rating-down");
        const votesCounter = this.element.querySelector(".post__rating-text");

        voteDownButton.classList.add("post__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) - 1;
    }

    removeVoteDown() {
        const voteDownButton = this.element.querySelector(".post__rating-down");
        const votesCounter = this.element.querySelector(".post__rating-text");

        voteDownButton.classList.remove("post__rating-button_active");
        votesCounter.textContent = parseInt(votesCounter.textContent) + 1;
    }
}

class PostComments extends Component {
    constructor(obj, comments) {
        super();

        this.id = obj.id;

        this.form = new PostsForm();

        this.list = new PostCommentsList(obj, comments);
        this.empty = new PostNoComments();

        this.section = new State(this.list);
    }

    events(element) {
        this.list.addEventListener("empty", this.onEmpty.bind(this));
        this.form.addEventListener("send", this.onSend.bind(this));
    }

    onSend(event){
        this.form.clean();

        fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                post: this.id,
                text: event.detail.value
            })
        })
            .then(response => response.json())
            .then(comment => {
                this.list.addFront(new PostComment(comment));
                this.section.set(this.list);
            });
    }

    onEmpty(event) {
        this.section.set(this.empty);
    }

    html() {
        return `
            <div class="post__comments">
                {{ this.form }}
                {{ this.section }}
            </div>
        `
    }
}

class PostsForm extends Component {
    constructor(obj, options = {}) {
        super();

        this.minLength = options.minLength | 0;
        this.maxLength = options.maxLength | 500;
    }

    html() {
        return `
            <div class="post__form">
                <textarea rows="1" placeholder="Введите текст" class="post__form-input"></textarea>
                <div class="post__form-panel">
                    <div class="post__form-length">
                        <span class="post__form-current-length">0</span>
                        /
                        <span class="post__form-max-length">{{ this.maxLength }}</span>
                    </div>
                    <button class="post__form-send">Отправить</button>
                </div>
            </div>
        `;
    }

    onRender() {
        registerResize(this.element.querySelector(".post__form-input"));
    }

    events(element) {
        element.querySelector(".post__form-send")?.addEventListener("click", this.onSend.bind(this));
        element.querySelector(".post__form-input")?.addEventListener("input", this.onInput.bind(this));
    }

    onSend(event) {
        const text = this.element.querySelector(".post__form-input").value;
        if (this.validateInput(text) && text !== "")
            this.dispatchEvent(new CustomEvent("send", {detail: {value: text}}));
    }

    onInput(event){
        this.element.querySelector(".post__form-current-length").textContent = event.target.value.length;

        if (!this.validateInput(event.target.value)){
            this.element.querySelector(".post__form-input").classList.add("post__form-input_error");
            this.element.querySelector(".post__form-length").classList.add("post__form-length_error");
        }
        else {
            this.element.querySelector(".post__form-input").classList.remove("post__form-input_error");
            this.element.querySelector(".post__form-length").classList.remove("post__form-length_error");
        }
    }

    validateInput(value) {
        return this.minLength <= value.length && value.length <= this.maxLength;
    }

    clean() {
        this.element.querySelector(".post__form-input").value = "";
    }
}

class PostCommentsList extends Component {
    constructor(obj, comments) {
        super();

        this.id = obj.id;

        this.comments = comments || [];
    }

    html() {
        return `
            <div class="post__comments-list">
                {{ this.comments }}
            </div>
        `
    }

    addFront(comment){
        this.element.prepend(comment.element || comment.render());
    }

    addBack(comment){
        this.element.prepend(comment.element || comment.render());
    }

    onRender() {
        fetch("/api/comments?" + new URLSearchParams({post: this.id}))
            .then(response => response.json())
            .then(comments => {
                if (comments.length === 0)
                    return this.dispatchEvent(new CustomEvent("empty"));

                for(let comment of comments)
                    this.addBack(new PostComment(comment))
            });
    }
}

class PostNoComments extends Component {
    html() {
        return `
            <p class="post__no-comments">
                Здесь пока нет комментариев.
                <br>
                Будьте первым!
            </p>
        `
    }
}

class PostComment extends Comment {
    constructor(obj, options) {
        super(obj, {
            showForm: false,
            minLength: 0,
            maxLength: 300
        });
    }
}