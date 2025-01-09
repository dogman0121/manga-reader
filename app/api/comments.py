from flask import jsonify, request
from flask_login import login_required, current_user
from app.models import Title
from app.comments.models import Comment
from app.posts.models import Post
from app.api import bp


@bp.route("/comments", methods=["GET"])
def get_comments():
    page = int(request.args.get("page") or 1)
    if "post" in request.args:
        post = Post.get(request.args.get("post"))
        print(Comment.get_post_comments(post, page))
        return jsonify([i.to_dict() for i in Comment.get_post_comments(post, page)])

    if request.args.get("parent"):
        parent = Comment.get(request.args.get("parent"))
        return jsonify([i.to_dict() for i in parent.get_answers()])

    if request.args.get("root"):
        root = Comment.get(request.args.get("root"))
        return jsonify([i.to_dict() for i in root.get_answers()])

    if request.args.get("title"):
        title = Title.get(request.args.get("title"))
        return jsonify([i.to_dict() for i in Comment.get_title_comments(title, page)])

    return jsonify([])


@bp.route("/comments", methods=["POST"])
@login_required
def add_comment():
    text = request.json.get("text")
    user_id = current_user.id
    parent_id = int(request.json.get("parent")) if "parent" in request.json else None
    root_id = int(request.json.get("root")) if "root" in request.json else None

    comment = Comment(text=text, user_id=user_id, root_id=root_id, parent_id=parent_id)

    if "post" in request.json:
        post = Post.get(request.json.get("post"))
        comment.add_for_post(post)

    if "title" in request.json:
        title = Title.get(request.json.get("title"))
        comment.add_for_title(title)

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