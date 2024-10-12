from app.models import *


def test_user_model_adding(app):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        assert user == User.get_by_login("aboba")
