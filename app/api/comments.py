from flask import jsonify, request
from flask_login import login_required, current_user
from app.models import Comment, Title
from app.api import bp


def comment_to_dict(comment: Comment):

    comment_dict = {
        "id": comment.id,
        "text": comment.text,
        "date": comment.date,
        "user": {
            "id": comment.user.id,
            "login": comment.user.login,
            "email": comment.user.email,
            "avatar": comment.user.avatar
        },
        "title_id": comment.title_id,
        "root": comment.root,
        "parent": comment.parent,
        "up_votes": comment.up_votes,
        "down_votes": comment.down_votes,
        "answers_count": comment.answers_count
    }

    user_vote = comment.get_user_vote(current_user)
    if user_vote:
        comment_dict["is_voted_by_user"] = True
        comment_dict["user_vote_type"] = user_vote.type
    else:
        comment_dict["is_voted_by_user"] = False

    return comment_dict


@bp.route("/comments", methods=["GET"])
def get_comments():
    if request.args.get("page"):
        page = int(request.args.get("page"))
    else:
        page = 1

    if request.args.get("root"):
        root = request.args.get("root")
        comment = Comment.get_by_id(root)
        comments_obj = comment.get_answers()

    if request.args.get("title_id"):
        title_id = request.args.get("title_id")
        title = Title.get_by_id(title_id)
        comments_obj = title.get_comments(page)

    comments_list = []
    for comment in comments_obj:
        comments_list.append(comment_to_dict(comment))

    return jsonify(comments_list)


@bp.route("/comments", methods=["POST"])
@login_required
def add_comment():
    title_id = request.json.get("title_id")
    text = request.json.get("text")
    parent = request.json.get("parent")
    root = request.json.get("root")

    comment = Comment(text=text, user=current_user, title_id=title_id, root=root, parent=parent)
    comment.add()

    return jsonify(comment_to_dict(comment))
