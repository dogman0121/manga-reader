from flask import request
from flask_login import current_user, login_required
from app.api import bp
from app.models import Comment


@bp.route("/vote", methods=["POST"])
@login_required
def vote_up():
    vote_type = request.json["type"]
    comment_id = request.json["commentId"]
    comment = Comment.get_by_id(comment_id)
    comment.add_vote(current_user, vote_type)
    return {"status": "ok"}