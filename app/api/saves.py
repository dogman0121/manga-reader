from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from app.models import Save


@bp.route("/save", methods=["POST"])
@login_required
def add_save():
    title_id = request.json["title_id"]
    save = Save(user_id=current_user.id, title_id=title_id)
    save.add()
    return {"status": "ok"}


@bp.route("/save", methods=["DELETE"])
@login_required
def delete_save():
    title_id = request.json["title_id"]
    save = Save(user_id=current_user.id, title_id=title_id)
    save.delete()
    return {"status": "ok"}
