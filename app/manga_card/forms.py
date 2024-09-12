from flask_wtf import FlaskForm
from wtforms import FileField, SelectMultipleField, TextAreaField, SelectField, StringField, SubmitField, validators


class AddingMangaForm(FlaskForm):
    poster = FileField()
    name_russian = StringField(validators=[validators.InputRequired()])
    name_english = StringField()
    name_languages = StringField()
    description = TextAreaField()
    status = SelectField()
    type = SelectField()
    year = StringField()
    genres = SelectMultipleField()
    author = StringField()
    translator = StringField()
    submit = SubmitField("Сохранить")