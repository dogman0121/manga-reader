from app.posts import bp
from app.posts.models import Post
from app.utils import render


@bp.route("/")
def get_post():
    return render("post.html")