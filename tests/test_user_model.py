from app.models import *


def test_user_adding(app):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        assert user == User.get_by_login("aboba")


def test_user_login_taken(app):
    with app.app_context():
        assert not(User.get_by_login("aboba"))
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        assert User.get_by_login("aboba") is not None


def test_save_adding(app):
    with app.app_context():
        user = User(login="qwerty", email="e@mail.com")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="abaga")
        title.add()

        user.add_save(title)
        user.add_save(title)

        assert title in user.saves
        assert user.saves.count(title) == 1


def test_save_deleting(app):
    with app.app_context():
        user = User(login="qwerty", email="e@mail.com")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="abaga")
        title.add()

        user.add_save(title)
        user.remove_save(title)
        user.remove_save(title)

        assert title not in user.saves