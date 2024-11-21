import sqlalchemy
from flask import request, render_template
from app.models import Title, Genre, Status, Type
from app import db
from flask_login import current_user
import json
from app.catalog import bp


@bp.route("/")
def catalog_page():
    types = [i for i in request.args.getlist("types")]
    statuses = [Status.get_by_id(i) for i in request.args.getlist("statuses")]
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
    titles_json = json.dumps([i.to_dict() for i in titles], ensure_ascii=False)
    return render_template("catalog.html", user=current_user, titles=titles,
                           titles_json=titles_json, genres=db.session.execute(sqlalchemy.Select(Genre)).scalars(),
                           types=db.session.execute(sqlalchemy.Select(Type)).scalars(),
                           statuses=db.session.execute(sqlalchemy.Select(Status)).scalars())

