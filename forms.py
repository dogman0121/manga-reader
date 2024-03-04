from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField, SubmitField, FileField, SelectMultipleField, IntegerField, SelectField


class EditProfileForm(FlaskForm):
    file = FileField()
    login = StringField()
    email = EmailField()
    status = StringField()
    old_password = PasswordField()
    new_password = PasswordField()
    new_password_repeat = PasswordField()
    submit = SubmitField()


class MangaForm(FlaskForm):
    file = FileField()
    name_original = StringField()
    name_russian = StringField()
    name_english = StringField()
    type = SelectField(choices=[("1", "Манхва"), ("2", "Манга"), ("3", "Маньхуа")])
    tags = SelectMultipleField()
    genres = SelectMultipleField()
    year = IntegerField()
    author = StringField()
    artist = StringField()
    publisher = StringField()
    translator = StringField()
    submit = SubmitField()
