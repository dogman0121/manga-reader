from flask import Blueprint

bp = Blueprint("catalog", __name__)

import app.catalog.routes