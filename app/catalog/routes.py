from flask import request, render_template, jsonify
from app.models import Title, Genre, Tag, Status, Type
from flask_login import current_user
import json
from app.catalog import bp


@bp.route("/")
def catalog_page():
    types = [int(i) for i in request.args.getlist('types')]
    types = None if not types else types

    genres = [int(i) for i in request.args.getlist('genres')]
    genres = None if not genres else genres

    tags = [int(i) for i in request.args.getlist('tags')]
    tags = None if not tags else tags

    status = [int(i) for i in request.args.getlist('status')]
    status = None if not status else status

    adult = [int(i) for i in request.args.getlist('adult')]
    adult = None if not adult else adult

    year_by = request.args.get("year_by")
    year_by = int(year_by) if year_by else None

    year_to = request.args.get("year_to")
    year_to = int(year_to) if year_to else None

    rating_by = request.args.get("rating_by")
    rating_by = int(rating_by) if rating_by else None

    rating_to = request.args.get("rating_to")
    rating_to = int(rating_to) if rating_to else None

    sort = request.args.get("sort_by")
    sort = int(sort) if sort else None

    page = request.args.get("page")
    page = int(page) if sort else None

    titles = Title.get_with_filter(types, genres, tags, status, adult, rating_by, rating_to, year_by, year_to, sort, page)
    titles_json = json.dumps([i.__dict__ for i in titles], ensure_ascii=False)
    return render_template("catalog.html", user=current_user, titles=titles,
                           titles_json=titles_json, genres=Genre.get_all(), types=Type.get_all(),
                           tags=Tag.get_all(), statuses=Status.get_all())

