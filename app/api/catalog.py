from flask import request, jsonify
from app.api import bp
from app.models import Title, Type, Status, Genre


@bp.route("/catalog", methods=["GET"])
def get_catalog():
    types = [Type.get_by_id(i) for i in request.args.getlist("type")]
    statuses = [Status.get_by_id(i) for i in request.args.getlist("status")]
    genres = [Genre.get_by_id(i) for i in request.args.getlist("genres")]
    adult = [int(i) for i in request.args.getlist("adult")]
    year_from = int(request.args.get("year_by") or 0)
    year_to = int(request.args.get("year_to") or 10000)
    rating_from = int(request.args.get("rating_by") or 0)
    rating_to = int(request.args.get("rating_to") or 10)
    sort = int(request.args.get("sort_by") or 0)
    page = int(request.args.get("page") or 1)
    titles = Title.get_with_filters(types=types, statuses=statuses, genres=genres, year_from=year_from, year_to=year_to,
                                    page=page, rating_from=rating_from, rating_to=rating_to)
    return jsonify([i.to_dict() for i in titles])