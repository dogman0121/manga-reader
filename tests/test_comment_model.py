from app.models import Comment, User, Title


def test_adding_comment(app):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="Qwerty")
        title.add()

        comment = Comment(text="хехехе", user_id=1, title_id=1)
        comment.add()

        assert comment == Comment.get(comment.id)