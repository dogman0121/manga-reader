class PostsList extends Comment {
    constructor(posts) {
        super();

        this.posts = posts ? posts : [];
    }

    html() {
        return `
            <div class="posts">
                <div class="posts__form">
                    {{ this.commentForm }}
                </div>
                <div class="posts__list">
                    {{ this.posts }}
                </div>
            </div>
        `;
    }
}


class Post extends Component {
    constructor(id, user, text, date) {
        super();

        this.id = id;
        this.text = text
        this.user = user;
        this.date = new Date(date);
    }

    static fromObj(obj) {
        this.id = obj.id;
        this.user = obj.user;
        this.text = obj.user;
        this.date = new Date(obj.date);
    }

    html() {
        return `
            <div class="post" data-id="${this.id}">
                {{ new CommentBody(this.user, this.text, this.date) }}
            </div>
        `;
    }
}