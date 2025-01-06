class PostsList extends Component {
    constructor(posts) {
        super();

        this.commentForm = new CommentForm();
        this.posts = posts ? posts : [];
        this.page = 1;
    }

    events(element) {
        this.commentForm.addEventListener("send", this.onCommentSend.bind(this));
    }

    html() {
        const form = `
            <div class="posts__form">
                {{ this.commentForm }}
            </div>
        `;

        return `
            <div class="posts">
                ${ DATA.user.id === DATA.profile.id ? form : ""}
                <div class="posts__list">
                    {{ this.posts }}
                </div>
            </div>
        `;
    }

    onCommentSend(event) {
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
                this.addFront(Post.fromObj(post));
            })
    }

    addFront(post){
        this.element.querySelector(".posts__list").prepend(post.element || post.render());
    }

    addBack(post){
        this.element.querySelector(".posts__list").append(post.element || post.render());
    }

    onRender(){
        this.loadPosts();
    }

    loadPosts() {
        fetch("/api/posts?" + new URLSearchParams({page: this.page, user: DATA.profile.id}).toString())
            .then(response => response.json())
            .then(posts => {
                let post;
                for(let postObj of posts) {
                    post = Post.fromObj(postObj);
                    this.posts.push(post);
                    this.addBack(post);
                }
                this.page += 1;
            })
    }
}


class Post extends Comment {
    constructor(id, author, text, date) {
        super();

        this.id = id;
        this.text = text
        this.user = author;
        this.date = new Date(date);
    }

    static fromObj(obj) {
        const id = obj.id;
        const user = obj.author;
        const text = obj.text;
        const date = new Date(obj.date);
        return new Post(id, user, text, date);
    }

    html() {
        let howOld = this.commentBody.formatTimedelta(
            new Date().getTime() + new Date().getTimezoneOffset() * 60000 - this.date
        );

        return `
            <div class="post" data-id="${this.id}">
                <div class="post__inner">
                    <div class="post__author author">
                        <img class="post__author-avatar" src="${this.user.avatar}">
                        <div class="post__author-info">
                            <span class="post__author-name">${this.user.login}</span>
                            <span class="post__date">${howOld}</span>
                        </div>
                        <div class="post__options-button">
                            <svg width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-three-dots-vertical">
                              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="post__text">${this.text}</div>
                </div>
            </div>
        `;
    }
}