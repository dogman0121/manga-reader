from flask_wtf import FlaskForm
from wtforms import (FileField, SelectMultipleField, TextAreaField, SelectField, IntegerField,
                     StringField, SubmitField, validators)
from wtforms.validators import NumberRange
from app.models import Genre, Status, Type, Title, User
from flask_login import current_user


class AddMangaForm(FlaskForm):
    poster = FileField()
    name_russian = StringField(validators=[validators.InputRequired()])
    name_english = StringField()
    name_languages = StringField()
    description = TextAreaField()
    status = SelectField()
    type = SelectField()
    year = IntegerField(validators=[NumberRange(min=1)])
    genres = SelectMultipleField()
    submit = SubmitField("Сохранить")

    def __init__(self, title_id=None):
        super().__init__()

        # init choices
        self.genres.choices = [[i.id, i.name] for i in Genre.get_all()]
        self.status.choices = [[i.id, i.name] for i in Status.get_all()]
        self.type.choices = [[i.id, i.name] for i in Type.get_all()]

        # init default values
        if title_id is None:
            self.title = Title()
            return

        self.title = Title.get_by_id(title_id)

        if self.validate_on_submit():
            return

        self.name_russian.data = self.title.name_russian
        self.name_english.data = self.title.name_english
        self.name_languages.data = self.title.name_languages
        self.description.data = self.title.description
        self.type.data = str(self.title.type_id)
        self.status.data = str(self.title.status_id)
        self.year.data = self.title.year
        self.genres.data = [str(i.id) for i in self.title.genres]

    def get_title(self):
        self.title.name_russian = self.name_russian.data
        self.title.name_english = self.name_english.data
        self.title.name_languages = self.name_languages.data
        self.title.description = self.description.data
        self.title.type_id = self.type.data
        self.title.type = Type.get_by_id(self.type.data)
        self.title.status_id = self.status.data
        self.title.status = Status.get_by_id(self.status.data)
        self.title.year = self.year.data
        self.title.genres = [Genre.get_by_id(int(i)) for i in self.genres.data]
        self.title.author_id = current_user.id
        self.title.author = User.get_by_id(current_user.id)
        return self.title
