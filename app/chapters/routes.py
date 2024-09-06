from flask import request, jsonify, render_template, url_for
from app.models import Chapter
from os import listdir
from app.chapters import bp


@bp.route("/<int:chapter_id>")
def chapter(chapter_id):
    images_list = list()
    for i in listdir(f"app/static/media/chapters/{chapter_id}"):
        images_list.append(url_for("static", filename=f"media/chapters/{chapter_id}/{i}"))

    referer = request.headers.get("Referer")
    chapter_info = Chapter.get_by_id(chapter_id)
    return render_template("chapter.html",
                           chapter=chapter_info,
                           images=images_list,
                           referer=referer
                           )
