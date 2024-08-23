from flask import render_template, redirect, url_for, flash, request
from app.profile.forms import GeneralInformation, PasswordChanging
from werkzeug.security import generate_password_hash, check_password_hash
from database import User
from flask_login import current_user, login_required
from app.utils import get_user_data
from app.profile import bp


@bp.route("/<int:profile_id>")
def get_profile(profile_id):
    return render_template("profile.html", user_data=get_user_data(current_user.get_id()),
                           profile_data=get_user_data(profile_id))


@bp.route("/edit", methods=["GET", "POST"])
@login_required
def edit_profile():
    section = request.args.get("section")
    general_settings = GeneralInformation()
    password_settings = PasswordChanging()
    user_data = get_user_data(current_user.get_id())
    return render_template("edit_profile.html", general_settings=general_settings,
                           password_settings=password_settings, user_data=user_data, section=section)


@bp.route("/change_password", methods=["POST"])
@login_required
def change_password():
    password_settings = PasswordChanging()
    if password_settings.validate_on_submit():
        user_id = current_user.get_id()
        user_data = User().get_by_id(current_user.get_id(), root=True)
        if (check_password_hash(user_data["password"], password_settings.old_password.data)
                and password_settings.new_password.data == password_settings.new_password_repeat.data):
            if password_settings.new_password.data == password_settings.new_password_repeat.data:
                User().change_password(user_id, generate_password_hash(password_settings.new_password.data))
            else:
                flash("Пароли не совпадают", "passwords_not_matches")
                return redirect(url_for("edit_profile", section="password"))
        else:
            flash("Неправильный пароль", "wrong_password")
            return redirect(url_for("edit_profile", section="password"))
        return redirect(url_for('profile.get_profile', profile_id=current_user.get_id()))
    else:
        return redirect(url_for("profile.edit_profile", section="password"))


@bp.route("/change_data", methods=["POST"])
@login_required
def change_data():
    general_settings = GeneralInformation()
    if general_settings.validate_on_submit():
        user_id = current_user.get_id()
        user_data = get_user_data(user_id)
        new_avatar = request.files["avatar"]
        new_login = general_settings.login.data
        new_email = general_settings.email.data

        if new_login != user_data["login"] and User().is_login_taken(new_login):
            flash("Данное имя пользователя уже занято", "login_taken")
            return redirect(url_for("edit_profile", section="general"))

        if new_avatar.filename != '':
            new_avatar.save(f"static\\media\\avatars\\{current_user.get_id()}.png")
        User().change_login(user_id, new_login)
        User().change_email(user_id, new_email)
        return redirect(url_for('profile.get_profile', profile_id=current_user.get_id()))
    else:
        return redirect(url_for("profile.edit_profile", section="general"))
