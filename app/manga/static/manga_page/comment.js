class TitleComment extends Comment {
    constructor(obj, options) {
        super(obj);
    }
}

class TitleCommentBlock extends Comment {
    constructor() {
        super({});
        this.page = 1;
    }

    html() {
        return `
            <div class="comments__title-comments">
                {{ this.commentForm }}
                {{ this.commentAnswers }}
            </div>
        `
    }

    events(element) {
        super.events(element);
        this.loadComments();
    }

    onCommentSend(event) {
        const text = event.detail.value;
        this.commentForm.clean();

        fetch("/api/comments", {
            method: "POST",
             headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": DATA.title.id,
                "text": text,
            })
        })
            .then((response) => response.json())
            .then((comment) => {
                const commentObj = new TitleComment(comment);
                this.commentAnswers.addFront(commentObj)
            })
    }

    loadComments() {
        fetch("/api/comments?" + new URLSearchParams({ title: DATA.title.id, page: this.page }))
            .then((response) => response.json())
            .then((comments) => {
                for (let comment of comments){
                    this.commentAnswers.addBack(new TitleComment(comment));
                }
                this.page++;
            })
    }
}