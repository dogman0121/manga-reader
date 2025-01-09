from app.models import Title, User
from app.comments.models import Comment


def test_adding_full_params_comments(app, client):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="Qwerty")
        title.add()

        response = client.post("/api/comments", json={
            "title": 1,
            "root": 1,
            "parent": 1,
            "text": "хехехе"
        })

        assert response.status_code == 401


def test_adding_semi_params_comments(app, client):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="Qwerty")
        title.add()

        response = client.post("/api/comments", json={
            "user": 1,
            "title": 1,
            "text": "хехехе"
        })

        assert response.status_code == 401


def test_parse_comment_data(app):
    with app.app_context():
        user = User(login="aboba", email="a@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="Qwerty")
        title.add()

        dct = {
            "user": 1,
            "title": 1,
            "root": 1,
            "parent": 1,
            "text": "хехехе"
        }

        text = dct.get("text")
        title_id = int(dct.get("title"))
        user_id = int(dct.get("user"))
        parent_id = int(dct.get("parent"))
        root_id = int(dct.get("root"))

        comment = Comment(text=text, user_id=user_id, parent_id=parent_id, root_id=root_id)
        comment.add()

        assert text == "хехехе"
        assert title_id == 1
        assert user_id == 1
        assert parent_id == 1
        assert root_id == 1
        assert comment == Comment.get(comment.id)


def test_get_title_comment(app, client):
    with app.app_context():
        user = User(login="qwerty", email="e@mail.com")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="abaga")
        title.add()

        comment = Comment(text="123456", user_id=user.id)
        comment.add_for_title(title)

        answer = Comment(text="654321", user_id=user.id, root_id=comment.id, parent_id=comment.id)
        answer.add()

        response = client.get("/api/comments", query_string={"title": title.id, "page": 1})

        assert response.json == [comment.to_dict()]


def test_get_answer_comment(app, client):
    with app.app_context():
        user = User(login="qwerty", email="e@mail.com")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="abaga")
        title.add()

        comment = Comment(text="123456", user_id=user.id)
        comment.add()

        answer = Comment(text="654321", user_id=user.id, root_id=comment.id, parent_id=comment.id)
        answer.add()

        response = client.get("/api/comments", query_string={"root": title.id, "page": 1})

        assert response.json == [answer.to_dict()]