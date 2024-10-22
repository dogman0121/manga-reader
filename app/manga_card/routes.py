import json

from flask import render_template, redirect, url_for, request
from app.models import Title, Genre, Status, Type
from flask_login import current_user
from app.manga_card import bp
from app.manga_card.forms import AddMangaForm


@bp.route("/<int:title_id>")
def manga_page(title_id):
    title = Title.get_by_id(title_id)
    rating_s, rating_c = title.get_rating()
    try:
        rating = round(rating_s / rating_c, 2)
    except ZeroDivisionError:
        rating = 0
    title.add_view()
    title_json = json.dumps(title.to_dict(), ensure_ascii=False)
    user_rating = title.get_user_rating(current_user) if current_user.is_authenticated else None
    is_saved = title in current_user.saves if current_user.is_authenticated else False
    return render_template('manga_card/manga_card.html',
                           user=current_user,
                           title=title,
                           title_json=title_json,
                           rating_sum=rating_s,
                           rating_count=rating_c,
                           rating=rating,
                           user_rating=user_rating,
                           saved=is_saved)


@bp.route("/add", methods=["GET", "POST"])
def add_manga():
    adding_manga_form = AddMangaForm()

    if adding_manga_form.validate_on_submit():
        title = adding_manga_form.get_title()
        title.add()

        if request.files["poster"].filename != '':
            request.files["poster"].save(f"app/static/media/posters/{title.id}.jpg")

        return redirect(url_for("manga.manga_page", title_id=title.id))

    return render_template("manga_card/add_manga.html",
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

    title = Title.get_by_id(title_id)
    return render_template("manga_card/add_manga.html",
                           user=current_user,
                           form=adding_manga_form,
                           title=title,
                           mode="edit")
