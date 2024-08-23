from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, SubmitField, FileField, PasswordField


class GeneralInformation(FlaskForm):
    avatar = FileField()
    login = StringField()
    email = EmailField()
    submit = SubmitField()


class PasswordChanging(FlaskForm):
    old_password = PasswordField()
    new_password = PasswordField()
    new_password_repeat = PasswordField()
    submit = SubmitField()