from flask import request
from flask_login import login_required, current_user
from app.api import bp
from app.models import Title


@bp.route("/rating", methods=["POST"])
@login_required
def add_rating():
    title_id = request.json["title_id"]
    rating = int(request.json["rating"])
    title = Title.get_by_id(title_id)
    if 0 <= rating <= 10:
        title.add_rating(current_user, rating)
        return {"status": "ok"}
    else:
        return {"status": "error"}


@bp.route("/rating", methods=["UPDATE"])
@login_required
def update_rating():
    title_id = request.json["title_id"]
    rating = int(request.json["rating"])
    title = Title.get_by_id(title_id)
    if 0 <= rating <= 10:
        title.update_rating(current_user, rating)
        return {"status": "ok"}
    else:
        return {"status": "error"}


@bp.route("/rating", methods=["DELETE"])
@login_required
def delete_rating():
    title_id = request.json["title_id"]
    title = Title.get_by_id(title_id)
    title.remove_rating(current_user)
    return {"status": "ok"}
