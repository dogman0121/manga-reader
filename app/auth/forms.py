from flask_wtf import FlaskForm
from wtforms import EmailField, SubmitField, PasswordField


class SendEmailForm(FlaskForm):
    email = EmailField()
    submit = SubmitField("Отправить")


class RecoveryPasswordForm(FlaskForm):
    password = PasswordField()
    repeat_password = PasswordField()
    submit = SubmitField("Отправить")