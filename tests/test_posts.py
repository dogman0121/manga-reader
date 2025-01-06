from app.posts.models import Post
from app.models import User


def test_adding_post(app):
    with app.app_context():
        user = User(login="1234", email="1234")
        user.set_password("123456")
        user.add()

        post = Post(author_id=user.id, text="qwerty")
        post.add()

        assert post.id == 1


def test_adding_user_post(app):
    with app.app_context():
        user = User(login="1234", email="1234")
        user.set_password("123456")
        user.add()

        post = Post(author_id=user.id, text="qwerty")
        post.add_for_user(user)
        post.add()

        assert post.id == 1
        assert Post.get_user_posts(user, 1) == [post]