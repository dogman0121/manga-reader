from flask import Blueprint

bp = Blueprint("chapters", __name__, static_folder="static", template_folder="templates")

import app.chapters.routes