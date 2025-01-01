from flask import jsonify, request
from flask_login import login_required, current_user
from app.models import Comment, Title
from app.api import bp


@bp.route("/comments", methods=["GET"])
def get_comments():
    page = int(request.args.get("page") or 1)
    if request.args.get("parent"):
        parent = Comment.get(request.args.get("parent"))
        return jsonify([i.to_dict() for i in parent.get_answers()])

    if request.args.get("root"):
        root = Comment.get(request.args.get("root"))
        return jsonify([i.to_dict() for i in root.get_answers()])

    if request.args.get("title"):
        title = Title.get(request.args.get("title"))
        return jsonify([i.to_dict() for i in title.get_comments(page)])

    return jsonify([])


@bp.route("/comments", methods=["POST"])
@login_required
def add_comment():
    text = request.json.get("text")
    title_id = int(request.json.get("title"))
    user_id = current_user.id
    parent_id = int(request.json.get("parent")) if request.json.get("parent") is not None else None
    root_id = int(request.json.get("root")) if request.json.get("root") is not None else None

    comment = Comment(text=text, user_id=user_id, title_id=title_id, root_id=root_id, parent_id=parent_id)
    comment.add()

    return jsonify(comment.to_dict())


@bp.route("/comments", methods=["DELETE"])
@login_required
def delete_comment():
    if current_user.role < 4:
        return "", 403
    comment_id = request.json["comment"]

    comment = Comment.get(comment_id)

    comment.remove()
    return {"status": "ok"}