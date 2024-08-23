from flask import request
from flask_login import current_user
from app.api import bp
from database import Comment


@bp.route("/vote", methods=["POST"])
def vote_up():
    vote_type = request.json["type"]
    comment_id = request.json["commentId"]
    user_id = current_user.get_id()
    if user_id is None:
        return "false"
    if vote_type == 1:
        Comment.vote_up(comment_id, user_id)
        return "true"
    Comment.vote_down(comment_id, user_id)
    return "true"