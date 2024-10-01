from flask_wtf import FlaskForm
from wtforms import FileField, StringField, TextAreaField, SubmitField


class AddTeamForm(FlaskForm):
    poster = FileField()
    name = StringField()
    about = TextAreaField()
    vk_link = StringField()
    discord_link = StringField()
    telegram_link = StringField()
    submit = SubmitField("Сохранить")

