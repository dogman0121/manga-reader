from flask import render_template, redirect, url_for, flash, request
from app.profile.forms import GeneralInformationForm, ChangePasswordForm
from werkzeug.security import check_password_hash
from app.models import User
from flask_login import current_user, login_required
from app.profile import bp


@bp.route("/<int:profile_id>")
def get_profile(profile_id):
    return render_template("profile/profile.html",
                           profile=User.get_by_id(profile_id),
                           user=current_user)


@bp.route("/edit", methods=["GET", "POST"])
@login_required
def edit_profile():
    section = request.args.get("section")
    general_information_form = GeneralInformationForm()
    change_password_form = ChangePasswordForm()
    return render_template("profile/edit_profile.html",
                           general_settings=general_information_form,
                           password_settings=change_password_form,
                           user=current_user,
                           section=section)


@bp.route("/change_password", methods=["POST"])
@login_required
def change_password():
    password_settings = ChangePasswordForm()
    if password_settings.validate_on_submit():
        if (check_password_hash(current_user.password_hash, password_settings.old_password.data)
                and password_settings.new_password.data == password_settings.new_password_repeat.data):
            if password_settings.new_password.data == password_settings.new_password_repeat.data:
                current_user.change_password(password_settings.new_password.data)
            else:
                flash("Пароли не совпадают", "passwords_not_matches")
                return redirect(url_for("profile.edit_profile", section="password"))
        else:
            flash("Неправильный пароль", "wrong_password")
            return redirect(url_for("profile.edit_profile", section="password"))
        return redirect(url_for('profile.get_profile', profile_id=current_user.id))
    else:
        return redirect(url_for("profile.edit_profile", section="password"))


@bp.route("/change_data", methods=["POST"])
@login_required
def change_data():
    general_settings = GeneralInformationForm()
    if general_settings.validate_on_submit():
        new_avatar = request.files["avatar"]
        new_login = general_settings.login.data
        new_email = general_settings.email.data

        if new_login != current_user.login and User.is_login_taken(new_login):
            flash("Данное имя пользователя уже занято", "login_taken")
            return redirect(url_for("profile.edit_profile", section="general"))

        if new_avatar.filename != '':
            new_avatar.save(f"app\\static\\media\\avatars\\{current_user.get_id()}.png")
        current_user.change_login(new_login)
        current_user.change_email(new_email)
        return redirect(url_for('profile.get_profile', profile_id=current_user.id))
    else:
        return redirect(url_for("profile.edit_profile", section="general"))
