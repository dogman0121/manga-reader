from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, SubmitField, FileField, PasswordField


class GeneralInformationForm(FlaskForm):
    avatar = FileField()
    login = StringField()
    email = EmailField()
    submit = SubmitField()


class ChangePasswordForm(FlaskForm):
    old_password = PasswordField()
    new_password = PasswordField()
    new_password_repeat = PasswordField()
    submit = SubmitField()