from flask import Blueprint, request, jsonify
from app.models import Title, Team

bp = Blueprint("search", __name__)


@bp.route("/")
def search():
    query = request.args.get("q")
    params = request.args.get("p")
    if params == "title":
        res = [i.to_dict() for i in Title.search(query)]
        print(res)
        return jsonify(res)
    elif params == "team":
        res = [i.to_dict() for i in Team.search(query)]
        return jsonify(res)
    return "null"
