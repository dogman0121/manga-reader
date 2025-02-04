from flask import request, url_for, redirect
from flask_login import current_user
from app.models import Chapter, Title, Team
from os import listdir
from app.chapters import bp
from app.chapters.forms import ChapterForm
import os
import shutil
from app.utils import render


def clean_folder(path):
    try:
        shutil.rmtree(os.path.join(os.getcwd(), path))
        os.makedirs(os.path.join(os.getcwd(), path))
    except:
        for file in listdir(os.path.join(os.getcwd(), path)):
            os.remove(os.path.join(os.getcwd(), path, file))


@bp.route("/<int:chapter_id>")
def get_chapter(chapter_id):
    jsn = {}
    chapter = Chapter.get(chapter_id)
    title = chapter.title

    if current_user.is_authenticated and title.get_progress(current_user) is None:
        title.add_progress(current_user, chapter, 0)

    jsn["chapter"] = chapter.to_dict()

    pages = chapter.get_pages()
    jsn["pages"] = pages

    if chapter.title.type.name == "манга":
        template_url = "chapter_manga.html"
    else:
        template_url = "chapter_manhwa.html"

    return render(template_url,
                           chapter=chapter,
                           pages=pages,
                           user=current_user,
                           json=jsn
                           )


@bp.route("/<int:chapter_id>/edit", methods=["GET", "POST"])
def edit_chapter(chapter_id):
    chapter = Chapter.get(chapter_id)
    form = ChapterForm()
    if form.validate_on_submit():
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
    return render("add_chapter.html", user=current_user, form=form, chapter=chapter,
                           mode="edit")


@bp.route("/<int:chapter_id>/delete")
def delete_chapter(chapter_id):
    chapter = Chapter.get(chapter_id)
    chapter.delete()
    clean_folder(f"app/static/media/chapters/{chapter.id}")
    return redirect(url_for("manga.manga_page", title_id=chapter.title_id))


@bp.route("/add", methods=["GET", "POST"])
def add_chapter():
    title_id = request.args.get("title_id")
    title = Title.get(title_id)
    team = Team.get(current_user.team_id)
    form = ChapterForm()
    if form.validate_on_submit():
        chapter = Chapter()
        chapter.tome = form.tome.data
        chapter.chapter = form.chapter.data
        chapter.name = form.name.data
        chapter.title_id = title_id
        chapter.team_id = current_user.team_id
        chapter.add()

        if not title.check_translator(team):
            title.add_translator(team)

        if not(os.path.exists(f"app/static/media/chapters/{chapter.id}")):
            os.makedirs(f"app/static/media/chapters/{chapter.id}")
        for page in request.files.getlist("file"):
            page.save(f"app/static/media/chapters/{chapter.id}/{page.filename}")

        return redirect(url_for("manga.manga_page", title_id=title_id))
    return render("add_chapter.html", user=current_user, form=form, mode="add")
