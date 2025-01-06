from flask import Blueprint

bp = Blueprint("post", __name__, static_folder="static", template_folder="templates")

import app.posts.routes