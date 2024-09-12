from flask import jsonify
from app.api import bp
from app.models import Genre


@bp.route("/genres", methods=["GET"])
def get_genres():
    genres = Genre.get_all()
    return jsonify([i.__dict__ for i in genres])