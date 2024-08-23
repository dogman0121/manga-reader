from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from database import Saves


@bp.route("/add_save", methods=["POST"])
@login_required
def add_save():
    title_id = request.json["title_id"]
    Saves.add_save(current_user.get_id(), title_id)
    saves = Saves.get_saves(title_id)
    return jsonify({"saves": saves})


@bp.route("/delete_save", methods=["POST"])
@login_required
def delete_save():
    title_id = request.json["title_id"]
    Saves.delete_save(current_user.get_id(), title_id)
    saves = Saves.get_saves(title_id)
    return jsonify({"saves": saves})