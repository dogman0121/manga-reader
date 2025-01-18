from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from app.models import User, Title


@bp.route("/save", methods=["POST"])
@login_required
def add_save():
    title_id = request.json["title"]
    title = Title.get(title_id)
    current_user.add_save(title)
    return {"status": "ok"}


@bp.route("/save", methods=["DELETE"])
@login_required
def delete_save():
    title_id = request.json["title"]
    title = Title.get(title_id)
    current_user.remove_save(title)
    return {"status": "ok"}


@bp.route("/save", methods=["GET"])
def get_save():
    if "title" in request.args:
        title = Title.get(request.args.get("title"))
        if current_user.is_authenticated:
            return jsonify(title in current_user.saves)

    if "user" in request.args:
        user = User.get_by_id(int(request.args.get("user")))
        saves = [i.to_dict() for i in user.saves]
        return jsonify(saves)

    if current_user.is_authenticated:
        saves = [i.to_dict() for i in current_user.saves]
        return jsonify(saves)

    return "", 401
