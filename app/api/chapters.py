from flask import request, jsonify
from app.models import Title, Chapter
from app.api import bp


@bp.route("/chapters", methods=["GET"])
def get_chapters():
    title_id = request.args.get("title_id")
    title = Title.get(title_id)
    chapters_list = title.get_chapters()
    return jsonify([i.to_dict() for i in chapters_list])


@bp.route("/chapters/next", methods=["GET"])
def get_next_chapter():
    chapter_id = request.args.get("chapter")
    chapter = Chapter.get(chapter_id)

    next_chapter = chapter.get_next()
    if next_chapter is not None:
        return jsonify(next_chapter.to_dict())
    else:
        return jsonify(None)


@bp.route("/chapters/previous", methods=["GET"])
def get_previous_chapter():
    chapter_id = request.args.get("chapter")
    chapter = Chapter.get(chapter_id)

    prev_chapter = chapter.get_previous()
    if prev_chapter is not None:
        return jsonify(prev_chapter.to_dict())
    else:
        return jsonify(None)


@bp.route("/chapters/pages")
def get_page():
    chapter_id = request.args.get("chapter_id")
    chapter = Chapter.get(chapter_id)
    return jsonify(chapter.get_pages())
