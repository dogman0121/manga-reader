from flask import Blueprint, request, jsonify

bp = Blueprint("search", __name__, template_folder="templates", static_folder="static")

import app.search.routes



