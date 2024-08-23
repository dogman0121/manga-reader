from flask import jsonify, request
from flask_login import login_required
from database import Comment
from app.utils import get_comment_as_dict
from app.api import bp


@bp.route("/comments")
def get_comments():
    title_id = int(request.args.get("title_id"))
    if request.args.get("page"):
        page = int(request.args.get("page"))
    else:
        page = 1
    comments_list = list()
    for comment in Comment.get(title_id, page):
        comments_list.append(get_comment_as_dict(comment))

    return jsonify(comments_list)


@bp.route("/add", methods=["POST"])
@login_required
def add_comment():
    title_id = request.json.get("title_id")
    text = request.json.get("text")
    user_id = request.json.get("user_id")
    parent = request.json.get("parent")
    root = request.json.get("root")

    comment = Comment.add(title_id, text, user_id, root, parent)

    comment_dict = get_comment_as_dict(comment)
    return jsonify(comment_dict)


@bp.route("/get_answers")
def get_answers():
    answers_list = list()
    for answer in Comment.get_answers(request.args["comment_id"]):
        answers_list.append(get_comment_as_dict(answer))

    return jsonify(answers_list)