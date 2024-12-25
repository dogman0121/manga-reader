import sqlalchemy
from flask import request
from app.models import Title, Genre, Status, Type
from app import db
from flask_login import current_user
from app.catalog import bp
import json
from app.utils import render


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
    jsn = dict()
    jsn["titles"] = [i.to_dict() for i in titles]
    return render("catalog.html", user=current_user, titles=titles, json=jsn,
                           genres=db.session.execute(sqlalchemy.Select(Genre)).scalars(),
                           types=db.session.execute(sqlalchemy.Select(Type)).scalars(),
                           statuses=db.session.execute(sqlalchemy.Select(Status)).scalars())

