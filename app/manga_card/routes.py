import json
from flask import render_template, redirect, url_for, request
from app.models import Title, Chapter
from flask_login import current_user
from app.manga_card import bp
from app.manga_card.forms import AddMangaForm


@bp.route("/<int:title_id>")
def manga_page(title_id):
    title = Title.get(title_id)
    title.add_view()

    rating_s, rating_c = title.get_rating()
    rating_a = title.get_average_rating()

    title_json = json.dumps(title.to_dict(), ensure_ascii=False)

    if current_user.is_authenticated:
        user_json = json.dumps(current_user.to_dict(), ensure_ascii=False)
        user_rating = title.get_user_rating(current_user)
        if Title.get_progress(current_user):
            chapter_id, progress = Title.get_progress(current_user)
        else:
            chapter_id, progress = None, None
        progress_chapter = Chapter.get(chapter_id)
        saved = title in current_user.saves
    else:
        user_json = json.dumps({}, ensure_ascii=False)
        user_rating = None
        progress = None
        progress_chapter = None
        saved = False

    return render_template('manga_card.html',
                           user=current_user,
                           title=title,
                           title_json=title_json,
                           rating_sum=rating_s,
                           rating_count=rating_c,
                           rating=rating_a,
                           user_rating=user_rating,
                           saved=saved,
                           user_json=user_json,
                           progress=progress,
                           progress_chapter=progress_chapter
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

    return render_template("add_manga.html",
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
    return render_template("add_manga.html",
                           user=current_user,
                           form=adding_manga_form,
                           title=title,
                           mode="edit")
