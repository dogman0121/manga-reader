from flask import render_template, request, jsonify
from database import Chapter, Title, Rating, Saves
from flask_login import current_user, login_required
from app.utils import get_user_data
from app.manga import bp

@bp.route("/<int:title_id>")
def manga_page(title_id):
    Title.add_view(title_id)
    chapters = Chapter.get(title_id)
    title_info = Title.get(title_id)
    comments_count = Title.get_comments_counts(title_id)
    rating_by_user = Rating.get_title_rating_by_user(current_user.get_id(), title_id)
    saved = Saves.is_saved(current_user.get_id(), title_id)
    return render_template('manga_card.html',
                           chapters=chapters,
                           user_data=get_user_data(current_user.get_id()),
                           title=title_info,
                           comments_count=comments_count,
                           rating_by_user=rating_by_user,
                           saved=saved)


@bp.route("/add")
def add_manga():
    user_data = get_user_data(current_user.get_id())
    return render_template("add_manga.html", user_data=user_data)


@bp.route("/edit")
def edit_manga():
    pass
