class PostsList extends Component {
    constructor(posts) {
        super();

        this.posts = posts ? posts : [];
    }

    html() {
        return `
            <div class="posts">
                {{ this.posts }}
            </div>
        `;
    }
}


class Post extends Component {
    constructor(id, text) {
        super();

        this.id = id;
        this.text = text;
    }
    html() {
        return `
            <div class="post" data-id="${this.id}">
                {{ this.text }}
            </div>
        `;
    }
}