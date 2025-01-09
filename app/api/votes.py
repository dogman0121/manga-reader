from flask import request
from flask_login import current_user, login_required
from app.api import bp
from app.comments.models import Comment
from app.posts.models import Post


@bp.route("/vote", methods=["POST"])
@login_required
def vote_up():
    vote_type = request.json["type"]
    if "post" in request.json:
        post = Post.get(request.json["post"])
        user_vote = post.get_vote(current_user)
        if user_vote is not None:
            if user_vote == vote_type:
                post.remove_vote(current_user)
            else:
                post.update_vote(current_user, int(not user_vote))
        else:
            post.add_vote(current_user, vote_type)

    if "comment" in request.json:
        comment = Comment.get(request.json["comment"])
        user_vote = comment.get_vote(current_user)
        if user_vote is not None:
            if user_vote == vote_type:
                comment.remove_vote(current_user)
            else:
                comment.update_vote(current_user, int(not user_vote))
        else:
            comment.add_vote(current_user, vote_type)

    return {"status": "ok"}