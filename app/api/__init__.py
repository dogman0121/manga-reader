from flask import Blueprint

bp = Blueprint("api", __name__)

import app.api.comments
import app.api.votes
import app.api.saves
import app.api.rating