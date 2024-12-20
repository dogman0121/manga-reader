from app.api import bp
from app.models import Title, Chapter
from flask import request, jsonify
from flask_login import current_user, login_required


@bp.route("/progress", methods=["GET"])
@login_required
def get_progress():
    title_id = request.args.get("title")
    chapter_id = int(request.args.get("chapter"))

    title = Title.get(title_id)

    chapter, progress = title.get_progress(current_user)

    if chapter == chapter_id:
        return jsonify({"progress": progress})
    else:
        return jsonify({"progress": None})


@bp.route("/progress", methods=["POST"])
@login_required
def add_progress():

    title_id = int(request.json["title"])
    chapter_id = int(request.json["chapter"])
    progress = float(request.json["progress"])

    title = Title.get(title_id)
    chapter = Chapter.get(chapter_id)
    title.add_progress(current_user, chapter, progress)

    return


@bp.route("/progress", methods=["DELETE"])
@login_required
def delete_progress():

    title = Title.get(int(request.json["title"]))

    progress = title.delete_progress(current_user)

    return jsonify({"status": "ok"})


@bp.route("/progress", methods=["UPDATE"])
@login_required
def update_progress():

    title = Title.get(request.json["title"])
    chapter = Chapter.get(request.json["chapter"])
    progress = float(request.json["progress"])

    title.update_progress(current_user, chapter, progress)

    return "", 204
