from flask import Blueprint

bp = Blueprint("posts", __name__, static_folder="static", template_folder="templates")

import app.posts.routes