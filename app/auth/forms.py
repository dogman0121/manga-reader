from flask_wtf import FlaskForm
from wtforms import SubmitField, PasswordField, StringField, EmailField, BooleanField
from wtforms.validators import ValidationError
from app.models import User


class RegisterForm(FlaskForm):
    login = StringField()
    email = EmailField()
    password = PasswordField()

    def validate_login(self, login):
        if not login.data:
            raise ValidationError("Имя пользователя не должно быть пустым!")
        if len(login.data) > 16:
            raise ValidationError("Имя дользователя должно быть меньше 32 символов!")
        if User.get_by_login(login.data):
            raise ValidationError("Пользователь с таким именем уже существует!")

    def validate_email(self, email):
        if not email.data:
            raise ValidationError("Почта не должна быть пустой!")
        if len(email.data) > 256:
            raise ValidationError("Почта должна быть меньше 256 символов")
        if User.get_by_email(email.data):
            raise ValidationError("Пользователь с такой почтой уже существует!")

    def validate_password(self, password):
        if not password.data or 8 > len(password.data) or len(password.data) > 16:
            raise ValidationError("Пароль должен содержать от 8 до 16 символов!")


class LoginForm(FlaskForm):
    login = StringField()
    password = PasswordField()
    remember = BooleanField()

    def validate_login(self, login):
        if not User.get_by_login(login.data):
            raise ValidationError("Пользователя с таким именем не существует!")


class SendEmailForm(FlaskForm):
    email = EmailField()
    submit = SubmitField("Отправить")


class RecoveryPasswordForm(FlaskForm):
    password = PasswordField()
    repeat_password = PasswordField()
    submit = SubmitField("Отправить")