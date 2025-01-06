from app.posts import bp
from app.posts.models import Post


@bp.route("/<int:post_id>")
def get_post(post_id):
    return "1"