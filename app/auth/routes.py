from flask import render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from user_login import UserLogin
from flask_login import login_user, logout_user
from database import User
from app.auth import bp


@bp.route("/", methods=["GET"])
def login_form():
    if request.headers.get("Referer") is None and request.args.get("section") is None:
        return redirect(url_for("auth.login_form") + "?section=login")

    if request.headers.get("Referer") and request.args.get("section") is None:
        return redirect(url_for('auth.login_form') + "?section=login&from=" + request.headers.get("Referer"))

    if request.args.get("section") == "login":
        return render_template("auth/login.html")
    elif request.args.get("section") == "register":
        return render_template("auth/register.html")


@bp.route("/", methods=["POST"])
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
        flash("*Данное имя пользователя занято", "error")
        return render_template("auth/register.html")
    else:
        user_data = User.get_by_login(request.form.get("login"), root=True)
        if user_data and check_password_hash(user_data["password"], request.form.get("password")):
            login_user(UserLogin().create(user_data), remember={"on": True, None: False}[request.form.get("remember")])
            if request.args.get("from") is None:
                return redirect(url_for("index"))
            if request.args.get("from"):
                return redirect(request.args.get("from"))
            return redirect(url_for('index'))
        flash("*Неправильный логин или пароль!", "error")
        return render_template("auth/login.html")


@bp.route("/logout")
def logout():
    logout_user()
    if request.headers.get("Referer"):
        return redirect(request.headers.get("Referer"))
    return redirect(url_for("index"))


@bp.route("/recovery", methods=["GET"])
def recovery_form():
    return render_template("auth/recovery.html")


@bp.route("/recovery", methods=["POST"])
def recovery():
    flash("На ваш адрес электронной почты было отправлено письмо с инструкциями о том, как сбросить пароль.", "info")
    return render_template("auth/recovery.html")