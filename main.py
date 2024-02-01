import json
from flask import Flask, request, render_template, jsonify, redirect, flash, url_for
from database import User, Comment, Chapter, Title, Rating, Saves, Genres, Types, Tags, Statuses
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from user_login import UserLogin


app = Flask(__name__)
app.config['SECRET_KEY'] = "x#g@LauJd*tTbH&fZX5Cc4tBSW&Vu#s@"
app.config['JSON_AS_ASCII'] = False

login_manager = LoginManager(app)


@login_manager.user_loader
def load_user(user_id):
    return UserLogin().create(User.get_by_id(user_id))


@app.route("/")
def index():
    return render_template('manga_card.html')


@app.route("/login", methods=["GET"])
def login_form():
    if request.headers.get("Referer") is None and request.args.get("section") is None:
        return redirect(url_for("login") + "?section=login")

    if request.headers.get("Referer") and request.args.get("section") is None:
        return redirect(url_for('login_form') + "?section=login&from=" + request.headers.get("Referer"))

    if request.args.get("section") == "register":
        return render_template("register.html")
    return render_template("login.html")


@app.route("/login", methods=["POST"])
def login():
    if request.args.get("section") == "register":
        if not (User.is_login_taken(request.form.get("login"))):
            user_data = request.form
            User.add(user_data["login"], user_data["email"], generate_password_hash(user_data["password"]))
            if request.args.get("from") is None:
                return redirect(url_for("index"))
            if request.args.get("from"):
                return redirect(request.args.get("from"))
            return redirect(url_for("index"))
        flash("*Данное имя пользователя занято")
        return render_template("register.html")
    else:
        user_data = User.get_by_login(request.form.get("login"))
        if user_data and check_password_hash(user_data["password"], request.form.get("password")):
            login_user(UserLogin().create(user_data), remember={"on": True, None: False}[request.form.get("remember")])
            if request.args.get("from") is None:
                return redirect(url_for("index"))
            if request.args.get("from"):
                return redirect(request.args.get("from"))
            return redirect(url_for('index'))
        flash("*Неправильный логин или пароль!")
        return render_template("login.html")


@app.route("/logout")
def logout():
    logout_user()
    if request.headers.get("Referer"):
        return redirect(request.headers.get("Referer"))
    return redirect(url_for("index"))


@app.route("/manga/<int:title_id>")
def manga_page(title_id):
    Chapter.add_view(title_id)
    chapters = Chapter.get(title_id)
    title_info = Title.get(title_id)
    comments_count = Title.get_comments_counts(title_id)
    rating_by_user = Rating.get_title_rating_by_user(current_user.get_id(), title_id)
    saved = Saves.is_saved(current_user.get_id(), title_id)
    return render_template('manga_card.html',
                           chapters=chapters,
                           user=current_user,
                           title=title_info,
                           comments_count=comments_count,
                           rating_by_user=rating_by_user,
                           saved=saved)


@app.route("/profile")
def profile():
    pass


@app.route("/get_chapters")
def get_chapters():
    title_id = request.args.get("title_id")
    chapters = Chapter.get(title_id)
    return jsonify([dict(i) for i in chapters])


def convert_from_db(comments):
    for i in range(len(comments)):
        comments[i]["user"] = dict(User.get_by_id(comments[i]["user_id"]))
        comments[i]["answers_count"] = Comment.get_answers_count(comments[i]["id"])
        del comments[i]["user_id"]
        if current_user.get_id() is None:
            continue
        user_vote = Comment.get_vote(comments[i]["id"], current_user.get_id())
        if user_vote is None:
            comments[i]["voted_by_user"] = False
        else:
            comments[i]["is_voted_by_user"] = True
            comments[i]["user_vote_type"] = user_vote["type"]
    return comments


@app.route("/get_comments")
def get_comments():
    title_id = request.args.get("title_id")
    page = int(request.args.get("page"))
    comments = list(map(dict, Comment.get(title_id, page)))
    comments_dict = convert_from_db(comments)
    return jsonify(comments_dict)


@app.route("/vote", methods=["POST"])
def vote_up():
    vote_type = request.json["type"]
    comment_id = request.json["commentId"]
    user_id = current_user.get_id()
    if user_id is None:
        return "false"
    if vote_type == 1:
        Comment.vote_up(comment_id, user_id)
        return "true"
    Comment.vote_down(comment_id, user_id)
    return "true"


@app.route("/add_comment", methods=["POST"])
@login_required
def add_comment():
    try:
        comment = Comment.add(request.json["title_id"], request.json["text"], request.json["user_id"], request.json["parent"])
    except KeyError:
        comment = Comment.add(request.json["title_id"], request.json["text"], request.json["user_id"])

    comment_dict = dict(comment)
    comment_dict["user"] = dict(User.get_by_id(comment_dict["user_id"]))
    del comment_dict["user_id"]
    return jsonify(comment_dict)


@app.route("/get_answers")
def get_answers():
    answers = list(map(dict, Comment.get_answers(request.args["comment_id"])))
    answers_dict = convert_from_db(answers)
    return jsonify(answers_dict)


@app.route("/add_rating", methods=["POST"])
@login_required
def add_rating():
    title_id = request.json["title_id"]
    rating = request.json["rating"]
    Rating.add_rating(current_user.get_id(), title_id, rating)
    new_rating = Rating.get_title_average_rating(title_id)
    voices_count = Rating.get_rating_voices_count(title_id)
    return jsonify({"rating": new_rating, "voices_count": voices_count})


@app.route("/update_rating", methods=["UPDATE"])
@login_required
def update_rating():
    title_id = request.json["title_id"]
    rating = request.json["rating"]
    Rating.update_rating(current_user.get_id(), title_id, rating)
    new_rating = Rating.get_title_average_rating(title_id)
    voices_count = Rating.get_rating_voices_count(title_id)
    return jsonify({"rating": new_rating, "voices_count": voices_count})


@app.route("/delete_rating", methods=["DELETE"])
@login_required
def delete_rating():
    title_id = request.json["title_id"]
    Rating.delete_rating(current_user.get_id(), title_id)
    new_rating = Rating.get_title_average_rating(title_id)
    voices_count = Rating.get_rating_voices_count(title_id)
    return jsonify({"rating": new_rating, "voices_count": voices_count})

@app.route("/add_save", methods=["POST"])
@login_required
def add_save():
    title_id = request.json["title_id"]
    Saves.add_save(current_user.get_id(), title_id)
    saves = Saves.get_saves(title_id)
    return jsonify({"saves": saves})

@app.route("/delete_save", methods=["POST"])
@login_required
def delete_save():
    title_id = request.json["title_id"]
    Saves.delete_save(current_user.get_id(), title_id)
    saves = Saves.get_saves(title_id)
    return jsonify({"saves": saves})


@app.route("/catalog")
def catalog():
    types = [int(i) for i in request.args.getlist('types')]
    types = None if not types else types

    genres = [int(i) for i in request.args.getlist('genres')]
    genres = None if not genres else genres

    tags = [int(i) for i in request.args.getlist('tags')]
    tags = None if not tags else tags

    status = [int(i) for i in request.args.getlist('status')]
    status = None if not status else status

    adult = [int(i) for i in request.args.getlist('adult')]
    adult = None if not adult else adult

    year_by = request.args.get("year_by")
    year_by = int(year_by) if year_by else None

    year_to = request.args.get("year_to")
    year_to = int(year_to) if year_to else None

    rating_by = request.args.get("rating_by")
    rating_by = int(rating_by) if rating_by else None

    rating_to = request.args.get("rating_to")
    rating_to = int(rating_to) if rating_to else None

    sort = request.args.get("sort_by")
    sort = int(sort) if sort else None

    page = request.args.get("page")
    page = int(page) if sort else None

    ans = Title.get_title_with_filter(types, genres, tags, status, adult, rating_by, rating_to, year_by, year_to, sort, page)
    titles = [Title.get(t) for t in ans]
    titles_json = json.dumps(titles, ensure_ascii=False)
    return render_template("catalog.html", user=current_user, titles=titles, titles_json=titles_json,
                           genres=Genres.get_genres(), types=Types.get_types(), tags=Tags.get_tags(),
                           statuses=Statuses.get_statuses())


@app.route("/get_catalog")
def get_catalog():
    types = [int(i) for i in request.args.getlist('types')]
    types = None if not types else types

    genres = [int(i) for i in request.args.getlist('genres')]
    genres = None if not genres else genres

    tags = [int(i) for i in request.args.getlist('tags')]
    tags = None if not tags else tags

    status = [int(i) for i in request.args.getlist('status')]
    status = None if not status else status

    adult = [int(i) for i in request.args.getlist('adult')]
    adult = None if not adult else adult

    year_by = request.args.get("year_by")
    year_by = int(year_by) if year_by else None

    year_to = request.args.get("year_to")
    year_to = int(year_to) if year_to else None

    rating_by = request.args.get("rating_by")
    rating_by = int(rating_by) if rating_by else None

    rating_to = request.args.get("rating_to")
    rating_to = int(rating_to) if rating_to else None

    sort = request.args.get("sort_by")
    sort = int(sort) if sort else None

    page = request.args.get("page")
    page = int(page) if page else None

    ans = Title.get_title_with_filter(types, genres, tags, status, adult, rating_by, rating_to, year_by, year_to, sort, page)
    ans_titles = [Title.get(t) for t in ans]
    return jsonify(ans_titles)


if __name__ == "__main__":
    app.run(debug=True)
