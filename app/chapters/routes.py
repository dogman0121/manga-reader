from flask import request, render_template, url_for, redirect
from flask_login import current_user
from app.models import Chapter
from os import listdir
from app.chapters import bp
from app.chapters.forms import ChapterForm
import os
import shutil
import json


def clean_folder(path):
    try:
        shutil.rmtree(os.path.join(os.getcwd(), path))
        os.makedirs(os.path.join(os.getcwd(), path))
    except:
        for file in listdir(os.path.join(os.getcwd(), path)):
            os.remove(os.path.join(os.getcwd(), path, file))


@bp.route("/<int:chapter_id>")
def get_chapter(chapter_id):
    chapter = Chapter.get_by_id(chapter_id)
    title_json = json.dumps(chapter.title.to_dict(), ensure_ascii=False)
    chapter_json = json.dumps(chapter.to_dict(), ensure_ascii=False)
    referer = request.headers.get("Referer")
    pages = chapter.get_pages()
    return render_template("chapters/chapter.html",
                           chapter=chapter,
                           pages=pages,
                           referer=referer,
                           user=current_user,
                           title_json=title_json,
                           chapter_json=chapter_json)


@bp.route("/<int:chapter_id>/edit", methods=["GET", "POST"])
def edit_chapter(chapter_id):
    chapter = Chapter.get_by_id(chapter_id)
    form = ChapterForm()
    print(request.files.getlist("file"))
    if form.validate_on_submit():
        print("Fgdfgf")
        chapter.tome = form.tome.data
        chapter.chapter = form.chapter.data
        chapter.name = form.name.data
        chapter.update()

        if os.path.exists(f"app/static/media/chapters/{chapter.id}"):
            clean_folder(f"app/static/media/chapters/{chapter.id}")

        for page in request.files.getlist("file"):
            page.save(f"app/static/media/chapters/{chapter.id}/{page.filename}")

        return redirect(url_for("manga.manga_page", title_id=chapter.title_id))

    form.tome.data = chapter.tome
    form.chapter.data = chapter.chapter
    form.name.data = chapter.name

    chapter.pages_count = len(os.listdir(f"app/static/media/chapters/{chapter.id}"))
    return render_template("chapters/add_chapter.html", user=current_user, form=form, chapter=chapter,
                           mode="edit")


@bp.route("/<int:chapter_id>/delete")
def delete_chapter(chapter_id):
    chapter = Chapter.get_by_id(chapter_id)
    chapter.delete()

    clean_folder(f"app/static/media/chapters/{chapter.id}")

    return redirect(url_for("manga.manga_page", title_id=chapter.title_id))


@bp.route("/add", methods=["GET", "POST"])
def add_chapter():
    title = request.args.get("title_id")
    form = ChapterForm()
    if form.validate_on_submit():
        chapter = Chapter()
        chapter.tome = form.tome.data
        chapter.chapter = form.chapter.data
        chapter.name = form.name.data
        chapter.title_id = title
        chapter.add()

        if not(os.path.exists(f"app/static/media/chapters/{chapter.id}")):
            os.makedirs(f"app/static/media/chapters/{chapter.id}")
        for page in request.files.getlist("file"):
            page.save(f"app/static/media/chapters/{chapter.id}/{page.filename}")

        return redirect(url_for("manga.manga_page", title_id=title))
    return render_template("chapters/add_chapter.html", user=current_user, form=form, mode="add")
