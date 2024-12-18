from flask import request
from flask_login import current_user, login_required
from app.api import bp
from app.models import Comment


@bp.route("/vote", methods=["POST"])
@login_required
def vote_up():
    vote_type = request.json["type"]
    comment_id = request.json["comment"]
    comment = Comment.get(comment_id)
    user_vote = comment.get_user_vote(current_user)
    if user_vote is not None:
        if user_vote == vote_type:
            comment.remove_vote(current_user)
        else:
            comment.update_vote(current_user, int(not user_vote))
    else:
        comment.add_vote(current_user, vote_type)
    return {"status": "ok"}