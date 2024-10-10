from flask import jsonify, request
from flask_login import login_required, current_user
from app.models import Comment, Title
from app.api import bp


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
        comment_dict = comment.to_dict()
        if current_user.is_authenticated:
            comment_dict["user_vote"] = comment.get_user_vote(current_user)
        else:
            comment_dict["user_vote"] = None
        comments_list.append(comment_dict)

    return jsonify(comments_list)


@bp.route("/comments", methods=["POST"])
@login_required
def add_comment():
    title_id = request.json.get("title_id")
    text = request.json.get("text")
    parent = request.json.get("parent")
    root = request.json.get("root")

    comment = Comment(text=text, user_id=current_user.id, title_id=title_id, root_id=root, parent_id=parent)
    comment.add()

    return jsonify(comment.to_dict())
