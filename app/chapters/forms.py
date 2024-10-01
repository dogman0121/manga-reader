from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired
from wtforms import FileField, StringField, IntegerField, SubmitField
from wtforms.validators import NumberRange


class ChapterForm(FlaskForm):
    tome = IntegerField(validators=[NumberRange(min=1)])
    chapter = IntegerField(validators=[NumberRange(min=1)])
    name = StringField()
    file = FileField(validators=[FileRequired()])
    save = SubmitField("Сохранить")