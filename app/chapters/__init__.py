from flask import Blueprint

bp = Blueprint("chapters", __name__)

import app.chapters.routes