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
def add_comment():
    text = request.json.get("text")
    title_id = int(request.json.get("title_id"))
    user_id = int(request.json.get("user_id"))
    parent_id = int(request.json.get("parent_id")) if request.json.get("parent_id") is not None else None
    root_id = int(request.json.get("root_id")) if request.json.get("root_id") is not None else None

    comment = Comment(text=text, user_id=user_id, title_id=title_id, root_id=root_id, parent_id=parent_id)
    comment.add()

    return jsonify(comment.to_dict())
