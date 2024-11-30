from flask import request
from flask_login import login_required, current_user
from app.api import bp
from app.models import Title


@bp.route("/rating", methods=["POST"])
def add_rating():
    if not current_user.is_authenticated:
        return {
            "status": "error",
            "detail": "unauthorized"
        }

    title = Title.get_by_id(request.json["title_id"])
    rating = int(request.json["rating"])

    if abs(rating) <= 10:
        title.add_rating(current_user, rating)
        return {"status": "ok"}
    else:
        return {"status": "error"}


@bp.route("/rating", methods=["UPDATE"])
def update_rating():
    if not current_user.is_authenticated:
        return {
            "status": "error",
            "detail": "unauthorized"
        }

    title = Title.get_by_id(request.json["title_id"])
    rating = int(request.json["rating"])

    if 0 <= rating <= 10:
        title.update_rating(current_user, rating)
        return {"status": "ok"}
    else:
        return {"status": "error"}


@bp.route("/rating", methods=["DELETE"])
def delete_rating():
    if not current_user.is_authenticated:
        return {
            "status": "error",
            "detail": "unauthorized"
        }

    title = Title.get_by_id(request.json["title_id"])
    title.remove_rating(current_user)

    return {"status": "ok"}
