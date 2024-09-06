from flask import render_template
from app.models import Title
from flask_login import current_user
from app.manga import bp


@bp.route("/<int:title_id>")
def manga_page(title_id):
    title = Title.get_by_id(title_id)
    title.add_view()
    chapters = title.get_chapters()
    comments_count = title.get_comments_count()
    if current_user.is_authenticated:
        user_rating = title.get_user_rating(current_user)
        saved = title.is_saved(current_user)
    else:
        user_rating = None
        saved = False
    return render_template('manga-card/manga_card.html',
                           chapters=chapters,
                           user=current_user,
                           title=title,
                           comments_count=comments_count,
                           user_rating=user_rating,
                           saved=saved)


@bp.route("/add")
def add_manga():
    return render_template("manga-card/add_manga.html", user=current_user)


@bp.route("/edit")
def edit_manga():
    pass
