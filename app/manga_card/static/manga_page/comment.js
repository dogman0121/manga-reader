class TitleComment extends Comment {
    constructor(...data) {
        super(...data);
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
                comment: this.id,
                type: voteType
            })
        })
            .then(response => response.json())
            .then((json) => {
                switch (this.userVote) {
                    case 0:
                        if (voteType === 0){
                            this.userVote = undefined;
                            this.commentPanel.removeVoteDown();
                        } else {
                            this.userVote = 0;
                            this.commentPanel.removeVoteDown();
                            this.commentPanel.addVoteUp();
                        }
                        break;
                    case 1:
                        if (voteType === 0){
                            this.userVote = 0;
                            this.commentPanel.removeVoteUp();
                            this.commentPanel.addVoteDown();
                        } else {
                            this.userVote = undefined;
                            this.commentPanel.removeVoteUp();
                        }
                        break;
                    default:
                        if (voteType === 0){
                            this.userVote = 0;
                            this.commentPanel.addVoteDown();
                        } else {
                            this.userVote = 1;
                            this.commentPanel.addVoteUp();
                        }
                        break;
                }
            })
    }

    onShowForm() {
        if (!this.commentForm.opened)
            this.commentForm.show();
        else
            this.commentForm.hide();
    }

    onShowAnswers() {
        if (!this.commentAnswers.opened) {
            this.commentAnswers.show();
            if (this.answersCount !== this.commentAnswers.answers.length)
                this.loadAnswers();
        }

        else
            this.commentAnswers.hide();
    }

    loadAnswers() {
    fetch("../api/comments?"+ new URLSearchParams({parent: this.id}))
        .then((response) => response.json())
        .then((comments) => {
            for (let comment of comments){
                this.commentAnswers.addBack(TitleComment.createFromObj(comment));
            }
        })
    }

    onCommentSend(event) {
        const text = event.detail.value;

        fetch("/api/comments", {
            method: "POST",
             headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": DATA.title.id,
                "text": text,
                "root": this.root,
                "parent": this.id
            })
        })
            .then((response) => response.json())
            .then((comment) => {
                const commentObj = TitleComment.createFromObj(comment);
                this.commentAnswers.addFront(commentObj);
                if (!this.commentAnswers.opened)
                    this.commentAnswers.show();
            })
    }

    async onDelete(event) {
        if (this.deleting)
            return null;

        this.deleting = true;
        await fetch("/api/comments", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: this.id
            })
        })
        this.element.remove();
        this.deleting = false;
    }
}

class TitleCommentBlock extends Comment {
    constructor() {
        super();
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
                const commentObj = TitleComment.createFromObj(comment);
                this.commentAnswers.addFront(commentObj)
            })
    }

    loadComments() {
        fetch("/api/comments?" + new URLSearchParams({ title: DATA.title.id, page: this.page }))
            .then((response) => response.json())
            .then((comments) => {
                for (let comment of comments){
                    this.commentAnswers.addBack(TitleComment.createFromObj(comment));
                }
                this.page++;
            })
    }
}