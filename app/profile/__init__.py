from flask import Blueprint

bp = Blueprint("profile", __name__, static_folder="static", template_folder="templates")

import app.profile.routes