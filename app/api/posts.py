from flask import request, jsonify
from flask_login import login_required, current_user
from app.api import bp
from app.posts.models import Post
from app.models import User, Team


@bp.route("/posts", methods=["POST"])
@login_required
def add_post():
    post = Post(author_id=current_user.id, text=request.json["text"])
    if "team" in request.json:
        post.add_for_team(Team.get(request.json["team"]))
    else:
        post.add_for_user(current_user)

    return jsonify(post.to_dict())


@bp.route("/posts", methods=["GET"])
def get_posts():
    user = request.args.get("user")
    team = request.args.get("team")
    page = int(request.args.get("page") or 1)

    if user:
        posts = Post.get_user_posts(User.get_by_id(user), page)
        return jsonify([i.to_dict() for i in posts])

    return jsonify([])