from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from app.models import Title


@bp.route("/rating", methods=["GET"])
@login_required
def get_rating():
    title_id = request.args.get("title")
    title = Title.get(title_id)

    rating = title.get_user_rating(current_user)

    return jsonify(rating)


@bp.route("/rating", methods=["POST"])
@login_required
def add_rating():

    title = Title.get(request.json["title"])
    rating = int(request.json["rating"])

    if abs(rating) <= 10:
        title.add_rating(current_user, rating)
        return {"status": "ok"}
    else:
        return {"status": "error"}


@bp.route("/rating", methods=["UPDATE"])
@login_required
def update_rating():

    title = Title.get(request.json["title"])
    rating = int(request.json["rating"])

    if 0 <= rating <= 10:
        title.update_rating(current_user, rating)
        return {"status": "ok"}
    else:
        return {"status": "error"}


@bp.route("/rating", methods=["DELETE"])
def delete_rating():

    title = Title.get(request.json["title"])
    title.remove_rating(current_user)

    return {"status": "ok"}
