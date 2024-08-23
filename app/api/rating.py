from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from database import Rating


@bp.route("/add_rating", methods=["POST"])
@login_required
def add_rating():
    title_id = request.json["title_id"]
    rating = request.json["rating"]
    Rating.add_rating(current_user.get_id(), title_id, rating)
    new_rating = Rating.get_title_average_rating(title_id)
    voices_count = Rating.get_rating_voices_count(title_id)
    return jsonify({"rating": new_rating, "voices_count": voices_count})


@bp.route("/update_rating", methods=["UPDATE"])
@login_required
def update_rating():
    title_id = request.json["title_id"]
    rating = request.json["rating"]
    Rating.update_rating(current_user.get_id(), title_id, rating)
    new_rating = Rating.get_title_average_rating(title_id)
    voices_count = Rating.get_rating_voices_count(title_id)
    return jsonify({"rating": new_rating, "voices_count": voices_count})


@bp.route("/delete_rating", methods=["DELETE"])
@login_required
def delete_rating():
    title_id = request.json["title_id"]
    Rating.delete_rating(current_user.get_id(), title_id)
    new_rating = Rating.get_title_average_rating(title_id)
    voices_count = Rating.get_rating_voices_count(title_id)
    return jsonify({"rating": new_rating, "voices_count": voices_count})
