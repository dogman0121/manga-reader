from flask import request, jsonify, render_template, url_for
from database import Chapter
from os import listdir
from app.chapters import bp


@bp.route("/get_chapters")
def get_chapters():
    title_id = request.args.get("title_id")
    chapters_list = Chapter.get(title_id)
    return jsonify([dict(i) for i in chapters_list])


@bp.route("/<int:chapter_id>")
def chapter(chapter_id):
    images_list = list()
    for i in listdir(f"app/static/media/chapters/{chapter_id}"):
        images_list.append(url_for("static", filename=f"media/chapters/{chapter_id}/{i}"))

    referer = request.headers.get("Referer")
    chapter_info = Chapter.get_info(chapter_id)
    return render_template("chapter.html",
                           chapter=chapter_info,
                           images=images_list,
                           referer=referer
                           )
