from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from app.models import User, Title


@bp.route("/save", methods=["POST"])
@login_required
def add_save():
    title_id = request.json["title_id"]
    title = Title.get(title_id)
    current_user.add_save(title)
    return {"status": "ok"}


@bp.route("/save", methods=["DELETE"])
@login_required
def delete_save():
    title_id = request.json["title_id"]
    title = Title.get(title_id)
    current_user.remove_save(title)
    return {"status": "ok"}
