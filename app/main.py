from flask import Blueprint, url_for, redirect

bp = Blueprint("index", __name__)


@bp.route("/")
def index():
    return redirect(url_for("catalog.catalog_page"))