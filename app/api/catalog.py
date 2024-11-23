from flask import request, jsonify
from app.api import bp
from app.models import Title, Type, Status, Genre
from app.catalog.routes import parse_filters


@bp.route("/catalog", methods=["GET"])
def get_catalog():
    titles = Title.get_with_filters(**parse_filters(request.args))
    return jsonify([i.to_dict() for i in titles])