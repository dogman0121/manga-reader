from manage import app
from app import db
from app.models import User, Title, Genre, Status, Type

with app.app_context():
    db.create_all()

    user = User(login="aboba", email="a@mail.ru")
    user.set_password("123456")
    user.add()

    genre = Genre(name="сёдзе")
    genre.add()

    status = Status(name="выпускается")
    status.add()

    type = Type(name="манхва")
    type.add()

