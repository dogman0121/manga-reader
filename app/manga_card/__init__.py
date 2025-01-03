from flask import Blueprint
from flask_assets import Bundle

bp = Blueprint("manga", __name__, static_folder="static", template_folder="templates")

import app.manga_card.routes