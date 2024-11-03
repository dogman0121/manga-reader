from flask import Blueprint

bp = Blueprint("manga", __name__, static_folder="static", template_folder="templates")

import app.manga_card.routes