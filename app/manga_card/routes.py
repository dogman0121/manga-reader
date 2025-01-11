import json
from flask import render_template, redirect, url_for, request
from app.models import Title, Chapter
from flask_login import current_user
from app.manga_card import bp
from app.manga_card.forms import AddMangaForm
from app.utils import render


@bp.route("/<int:title_id>")
def manga_page(title_id):
    jsn = {}
    title = Title.get(title_id)
    title.add_view()

    rating_s, rating_c = title.get_rating()
    rating_a = title.get_average_rating()

    jsn["title"] = title.to_dict()

    if current_user.is_authenticated:
        user_rating = title.get_user_rating(current_user)
        if title.get_progress(current_user):
            chapter_id, progress = title.get_progress(current_user)
            progress_chapter = Chapter.get(chapter_id)
        else:
            progress = None
            progress_chapter = None
        saved = title in current_user.saves
    else:
        user_rating = None
        progress = None
        progress_chapter = None
        saved = False

    return render('manga_card.html',
                           user=current_user,
                           title=title,
                           rating_sum=rating_s,
                           rating_count=rating_c,
                           rating=rating_a,
                           user_rating=user_rating,
                           saved=saved,
                           progress=progress,
                           progress_chapter=progress_chapter,
                           json=jsn
    )


@bp.route("/add", methods=["GET", "POST"])
def add_manga():
    adding_manga_form = AddMangaForm()

    if adding_manga_form.validate_on_submit():
        title = adding_manga_form.get_title()
        title.add()

        if request.files["poster"].filename != '':
            request.files["poster"].save(f"app/static/media/posters/{title.id}.jpg")

        return redirect(url_for("manga.manga_page", title_id=title.id))

    return render("add_manga.html",
                           user=current_user,
                           form=adding_manga_form,
                           mode="add")


@bp.route("/<int:title_id>/edit", methods=["GET", "POST"])
def edit_manga(title_id):
    adding_manga_form = AddMangaForm(title_id=title_id)

    if adding_manga_form.validate_on_submit():
        title = adding_manga_form.get_title()
        title.update()

        if request.files["poster"].filename != '':
            request.files["poster"].save(f"app/static/media/posters/{title.id}.jpg")
        return redirect(url_for("manga.manga_page", title_id=title_id))

    title = Title.get(title_id)
    return render("add_manga.html",
                           user=current_user,
                           form=adding_manga_form,
                           title=title,
                           mode="edit")
