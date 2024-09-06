from flask import request, jsonify
from app.models import Title
from app.api import bp


@bp.route("/chapters", methods=["GET"])
def get_chapters():
    title_id = request.args.get("title_id")
    title = Title.get_by_id(title_id)
    chapters_list = title.get_chapters()
    return jsonify([i.__dict__ for i in chapters_list])