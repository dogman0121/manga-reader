from flask import jsonify, request
from flask_login import login_required, current_user
from app.models import Comment, Title
from app.api import bp


@bp.route("/comments", methods=["GET"])
def get_comments():
    page = request.json.get("page") or 1
    if request.json.get("parent_id"):
        pass

    if request.json.get("root_id"):
        root = Comment.get_by_id(request.json.get("root_id"))
        return jsonify([i.to_dict() for i in root.get_answers()])

    if request.json.get("title_id"):
        title = Title.get_by_id(request.json.get("title_id"))
        return jsonify([i.to_dict() for i in title.get_comments(page)])

    return jsonify([])



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
