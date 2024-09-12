from flask import Blueprint

bp = Blueprint("manga", __name__)

import app.manga_card.routes