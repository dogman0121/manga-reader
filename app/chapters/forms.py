from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired
from wtforms import FileField, StringField, IntegerField, SubmitField, DecimalField
from wtforms.validators import NumberRange, InputRequired


class ChapterForm(FlaskForm):
    tome = IntegerField()
    chapter = DecimalField()
    name = StringField()
    file = FileField(validators=[FileRequired()])
    save = SubmitField("Сохранить")