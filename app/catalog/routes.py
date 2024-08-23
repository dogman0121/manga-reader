from flask import request, render_template, jsonify
from database import Title, Genres, Statuses, Types, Tags
from app.utils import get_user_data
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

    ans = Title.get_title_with_filter(types, genres, tags, status, adult, rating_by, rating_to, year_by, year_to, sort, page)
    titles = [Title.get(t) for t in ans]
    titles_json = json.dumps(titles, ensure_ascii=False)
    return render_template("catalog.html", user_data=get_user_data(current_user.get_id()),
                           titles=titles, titles_json=titles_json, genres=Genres.get_genres(), types=Types.get_types(),
                           tags=Tags.get_tags(), statuses=Statuses.get_statuses())


@bp.route("/get")
def get_catalog():
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
    page = int(page) if page else None

    ans = Title.get_title_with_filter(types, genres, tags, status, adult, rating_by, rating_to, year_by, year_to, sort, page)
    ans_titles = [Title.get(t) for t in ans]
    return jsonify(ans_titles)
