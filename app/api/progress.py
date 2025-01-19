from app.api import bp
from app.models import Title, Chapter
from flask import request, jsonify
from flask_login import current_user, login_required


@bp.route("/progress", methods=["GET"])
@login_required
def get_progress():
    title_id = request.args.get("title")

    title = Title.get(title_id)

    chapter_id, progress = title.get_progress(current_user) or [None, None]

    chapter = Chapter.get(chapter_id)

    if chapter is None:
        if len(title.chapters) > 0:
            return jsonify(title.chapters[0].to_dict())
        return jsonify(None)

    chapter_dict = chapter.to_dict()
    chapter_dict["progress"] = progress

    return jsonify(chapter_dict)


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

    title.delete_progress(current_user)

    return "", 204


@bp.route("/progress", methods=["UPDATE"])
@login_required
def update_progress():

    chapter = Chapter.get(request.json["chapter"])
    progress = float(request.json["progress"])

    chapter.title.update_progress(current_user, chapter, progress)

    return "", 204
