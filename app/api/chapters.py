from flask import request, jsonify
from app.models import Title, Chapter
from app.api import bp


@bp.route("/chapters", methods=["GET"])
def get_chapters():
    title_id = request.args.get("title_id")
    title = Title.get_by_id(title_id)
    chapters_list = title.get_chapters()
    return jsonify([i.to_dict() for i in chapters_list])


@bp.route("/chapters/pages")
def get_page():
    chapter_id = request.args.get("chapter_id")
    chapter = Chapter.get_by_id(chapter_id)
    return jsonify(chapter.get_pages())
