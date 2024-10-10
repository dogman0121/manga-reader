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
    user_rating = title.get_user_rating(current_user) if current_user.is_authenticated else None
    is_saved = title.is_saved_by_user(current_user) if current_user.is_authenticated else False
    return render_template('manga_card/manga_card.html',
                           user=current_user,
                           title=title,
                           rating_sum=rating_s,
                           rating_count=rating_c,
                           rating=rating,
                           user_rating=user_rating,
                           saved=is_saved)


@bp.route("/add", methods=["GET", "POST"])
def add_manga():
    adding_manga_form = AddMangaForm()
    adding_manga_form.genres.choices = [[i.id, i.name] for i in Genre.get_all()]
    adding_manga_form.status.choices = [[i.id, i.name] for i in Status.get_all()]
    adding_manga_form.type.choices = [[i.id, i.name] for i in Type.get_all()]

    if adding_manga_form.validate_on_submit():
        title = Title()
        title.name_russian = adding_manga_form.name_russian.data
        title.name_english = adding_manga_form.name_english.data
        title.name_languages = adding_manga_form.name_languages.data
        title.description = adding_manga_form.description.data
        title.status = Status(adding_manga_form.status.data)
        title.type = Type(adding_manga_form.type.data)
        title.year = int(adding_manga_form.year.data)
        title.genres = [Genre(int(i)) for i in adding_manga_form.genres.data]
        title.author = adding_manga_form.author.data
        title.translator = adding_manga_form.translator.data
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
    title = Title.get_by_id(title_id)
    adding_manga_form = AddMangaForm()
    adding_manga_form.genres.choices = [[i.id, i.name] for i in Genre.get_all()]
    adding_manga_form.status.choices = [[i.id, i.name] for i in Status.get_all()]
    adding_manga_form.type.choices = [[i.id, i.name] for i in Type.get_all()]

    if adding_manga_form.validate_on_submit():
        title.name_russian = adding_manga_form.name_russian.data
        title.name_english = adding_manga_form.name_english.data
        title.name_languages = adding_manga_form.name_languages.data
        title.description = adding_manga_form.description.data
        title.status = Status(adding_manga_form.status.data)
        title.type = Type(adding_manga_form.type.data)
        title.year = int(adding_manga_form.year.data)
        title.genres = [Genre(int(i)) for i in adding_manga_form.genres.data]
        title.author = adding_manga_form.author.data
        title.translator = adding_manga_form.translator.data
        title.update()

        if request.files["poster"].filename != '':
            request.files["poster"].save(f"app/static/media/posters/{title.id}.jpg")
        return redirect(url_for("manga.manga_page", title_id=title.id))

    adding_manga_form.name_russian.data = title.name_russian
    adding_manga_form.name_english.data = title.name_english
    adding_manga_form.name_languages.data = title.name_languages
    adding_manga_form.description.data = title.description
    adding_manga_form.year.data = title.year
    adding_manga_form.genres.data = [str(i.id) for i in title.get_genres()]
    adding_manga_form.status.data = str(title.status.id)
    adding_manga_form.type.data = str(title.type.id)

    return render_template("manga_card/add_manga.html",
                           user=current_user,
                           form=adding_manga_form,
                           title=title,
                           mode="edit")
