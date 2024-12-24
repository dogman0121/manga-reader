import sqlalchemy
from flask import request, render_template
from app.models import Title, Genre, Status, Type
from app import db
from flask_login import current_user
from app.catalog import bp
import json


def parse_filters(args):
    filters = dict()
    filters["types"] = [int(i) for i in args.getlist("types")]
    filters["statuses"] = [int(i) for i in args.getlist("statuses")]
    filters["genres"] = [int(i) for i in args.getlist("genres")]
    filters["adult"] = [int(i) for i in args.getlist("adult")]
    filters["year_from"] = int(args.get("year_by") or 0)
    filters["year_to"] = int(args.get("year_to") or 10000)
    filters["rating_from"] = int(args.get("rating_by") or 0)
    filters["rating_to"] = int(args.get("rating_to") or 10)
    filters["sortings"] = int(args.get("sort_by") or 1)
    filters["page"] = int(args.get("page") or 1)

    return filters


@bp.route("/")
def catalog_page():
    titles = Title.get_with_filters(**parse_filters(request.args))
    titles_json = json.dumps([i.to_dict() for i in titles], ensure_ascii=False)
    if current_user.is_authenticated:
        user_json = json.dumps(current_user.to_dict())
    else:
        user_json = {}
    return render_template("catalog.html", user=current_user, titles=titles,
                           titles_json=titles_json, genres=db.session.execute(sqlalchemy.Select(Genre)).scalars(),
                           types=db.session.execute(sqlalchemy.Select(Type)).scalars(), user_json=user_json,
                           statuses=db.session.execute(sqlalchemy.Select(Status)).scalars())

