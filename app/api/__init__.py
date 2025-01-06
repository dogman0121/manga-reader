from flask import Blueprint

bp = Blueprint("api", __name__)

import app.api.comments
import app.api.votes
import app.api.saves
import app.api.rating
import app.api.catalog
import app.api.chapters
import app.api.genres
import app.api.progress
import app.api.posts