from flask import render_template, request, redirect, url_for, flash
from werkzeug.security import check_password_hash
from app.models import User
from flask_login import login_user, logout_user, current_user
from app.auth import bp
from app.email import send_password_recovery_mail, check_password_recovery_token
from app.auth.forms import SendEmailForm, RecoveryPasswordForm


@bp.route("/", methods=["GET"])
def login_form():
    if request.headers.get("Referer") is None and request.args.get("section") is None:
        return redirect(url_for(".login_form") + "?section=login")

    if request.headers.get("Referer") and request.args.get("section") is None:
        return redirect(url_for('.login_form') + "?section=login&from=" + request.headers.get("Referer"))

    if request.args.get("section") == "login":
        return render_template("login.html")
    elif request.args.get("section") == "register":
        return render_template("register.html")


@bp.route("/", methods=["POST"])
def login():
    if request.args.get("section") == "register":
        if not User.is_login_taken(request.form.get("login")):
            user_data = request.form
            user = User(login=user_data["login"], email=user_data["email"])
            user.set_password(user_data["password"])
            user.add()
            if request.args.get("from") is None:
                return redirect(url_for("index.index"))
            if request.args.get("from"):
                return redirect(request.args.get("from"))
            return redirect(url_for("index.index"))
        flash("*Данное имя пользователя занято", "error")
        return render_template("register.html")
    else:
        user_data = User.get_by_login(request.form.get("login"))
        if user_data and check_password_hash(user_data.password_hash, request.form.get("password")):
            login_user(user_data, remember={"on": True, None: False}[request.form.get("remember")])
            if request.args.get("from") is None:
                return redirect(url_for("index.index"))
            if request.args.get("from"):
                return redirect(request.args.get("from"))
            return redirect(url_for('index.index'))
        flash("*Неправильный логин или пароль!", "error")
        return render_template("login.html")


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
            user.change_password(password)
            return redirect(url_for(".login", section="login"))
    return render_template("recovery_password.html", password_form=recovery_password_form)
