from flask_wtf import FlaskForm
from wtforms import FileField, SelectField, SelectMultipleField, StringField, SubmitField, TextAreaField, IntegerField


class MangaForm(FlaskForm):
    name_russian = StringField('Название (на русском языке)')
    name_english = StringField('Название (на английском языке)')
    name_original = StringField('Название (на языке оригинала)')
    description = TextAreaField('Описание')
    poster = FileField('Постер', render_kw={'style': 'display:none', 'accept': 'image/jpeg, image/png, image/jpg'})
    type = SelectField('Тип тайтла', choices=[(1, 'Манга'), (2, 'Манхва'), (3, 'Маньхуа')])
    status = SelectField('Тип тайтла', choices=[(1, 'Выпускается'), (2, 'Завершен'), (3, 'Заброшен')])
    year = IntegerField('Год создание')
    genres = SelectMultipleField('Жанры', choices=[], validate_choice=False, render_kw={'style': 'display:none'})
    authors = StringField('Авторы')
    artists = StringField('Художники')
    publishers = StringField('Издательство')
    translators = StringField('Переводчики')
    submit = SubmitField("Добавить")