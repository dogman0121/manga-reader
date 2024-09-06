from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from app.models import Rating


@bp.route("/rating", methods=["POST"])
@login_required
def add_rating():
    title_id = request.json["title_id"]
    rating = request.json["rating"]
    rating_obj = Rating(user_id=current_user.id, title_id=title_id, rating=rating)
    rating_obj.add()
    return {"status": "ok"}


@bp.route("/rating", methods=["UPDATE"])
@login_required
def update_rating():
    title_id = request.json["title_id"]
    rating = request.json["rating"]
    rating_obj = Rating(user_id=current_user.id, title_id=title_id)
    rating_obj.update(rating)
    return {"status": "ok"}


@bp.route("/rating", methods=["DELETE"])
@login_required
def delete_rating():
    title_id = request.json["title_id"]
    rating = Rating(user_id=current_user.id, title_id=title_id)
    rating.delete()
    return {"status": "ok"}
