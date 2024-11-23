from flask import render_template, request, redirect, url_for, flash, jsonify
from werkzeug.security import check_password_hash
from app.models import User
from flask_login import login_user, logout_user
from app.auth import bp
from app.email import send_password_recovery_mail, check_password_recovery_token
from app.auth.forms import SendEmailForm, RecoveryPasswordForm, RegisterForm, LoginForm
import requests


@bp.route("/", methods=["GET", "POST"])
def auth():
    if request.args.get("section") == "register":
        return register()

    if request.args.get("section") == "login":
        return login()

    return redirect(url_for(".auth", section="login"))


def register():
    form = RegisterForm()
    if request.method == "GET":
        return render_template("register.html", form=form)
    elif request.method == "POST":
        if form.validate_on_submit():
            user = User()
            user.set_login(form.login.data)
            user.set_email(form.email.data)
            user.set_password(form.password.data)
            user.add()

            return redirect(url_for("index.index"))

    return render_template("register.html", form=form)


def login():
    form = LoginForm()
    if request.method == "GET":
        return render_template("login.html", form=form)
    elif request.method == "POST":
        if form.validate_on_submit():
            user = User.get_by_login(form.login.data)
            if check_password_hash(user.password, form.password.data):
                login_user(user, remember=form.remember.data)
                return redirect(url_for("index.index"))
            flash("Неправильный логин или пароль!", "error")
    return render_template("login.html", form=form)


@bp.route("/logout")
def logout():
    logout_user()
    if request.headers.get("Referer"):
        return redirect(request.headers.get("Referer"))
    return redirect(url_for("index"))


@bp.route("/recovery", methods=["GET", "POST"])
def recovery():
    send_email_form = SendEmailForm()
    if send_email_form.validate_on_submit():
        email = send_email_form.email.data
        user = User.get_by_email(email)
        if user:
            flash("На ваш адрес электронной почты было отправлено письмо с инструкциями о том, как сбросить пароль.",
                  "info")
            send_password_recovery_mail(user.id, email)
        else:
            flash("Пользователь с такой почтой не найден!", "error")
    return render_template("send_recovery_message.html", email_form=send_email_form)


@bp.route("/recovery/<token>", methods=["GET", "POST"])
def recovery_password(token):
    user_id = check_password_recovery_token(token)
    if not user_id:
        return redirect(url_for("auth.recovery"))
    recovery_password_form = RecoveryPasswordForm()
    if recovery_password_form.validate_on_submit():
        password = recovery_password_form.password.data
        repeat_password = recovery_password_form.repeat_password.data
        if password != repeat_password:
            flash("Пароли не совпадают!", "error")
        else:
            user = User.get_by_id(user_id)
            user.set_password(password)
            user.update()
            return redirect(url_for(".login", section="login"))
    return render_template("recovery_password.html", password_form=recovery_password_form)


@bp.route("/oauth/yandex", methods=["GET"])
def oauth_yandex():
    return render_template("oauth_yandex.html")


@bp.route("/oauth/yandex", methods=["POST"])
def handle_yandex():
    user_token = request.json["access_token"]
    user_data = requests.get("https://login.yandex.ru/info?format=json",
                             headers={"Authorization": f"OAuth {user_token}"}).json()

    user = User.get_by_oauth("ya", user_data["id"])
    if user:
        login_user(user)
    else:
        new_user = User(login=user_data["login"], email=user_data["default_email"])
        new_user.add()
        new_user.add_oauth("ya", user_data["id"])
        login_user(new_user)
    return jsonify({"status": "ok"})
