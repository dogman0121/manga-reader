from app.models import Title, User, Comment


def test_adding_full_params_comments(app, client):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="Qwerty")
        title.add()

        response = client.post("/api/comments", json={
            "user_id": 1,
            "title_id": 1,
            "root_id": 1,
            "parent_id": 1,
            "text": "хехехе"
        })

        assert response.status_code == 200


def test_adding_semi_params_comments(app, client):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="Qwerty")
        title.add()

        response = client.post("/api/comments", json={
            "user_id": 1,
            "title_id": 1,
            "text": "хехехе"
        })

        assert response.status_code == 200


def test_parse_comment_data(app):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="Qwerty")
        title.add()

        dct = {
            "user_id": 1,
            "title_id": 1,
            "root_id": 1,
            "parent_id": 1,
            "text": "хехехе"
        }

        text = dct.get("text")
        title_id = int(dct.get("title_id"))
        user_id = int(dct.get("user_id"))
        parent_id = int(dct.get("parent_id"))
        root_id = int(dct.get("root_id"))

        comment = Comment(text=text, title_id=title_id, user_id=user_id, parent_id=parent_id, root_id=root_id)
        comment.add()

        assert text == "хехехе"
        assert title_id == 1
        assert user_id == 1
        assert parent_id == 1
        assert root_id == 1
        assert comment == Comment.get_by_id(comment.id)
