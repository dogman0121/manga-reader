from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_assets import Environment
from flask_minify import Minify


login_manager = LoginManager()
migrate = Migrate()
db = SQLAlchemy()
mail = Mail()
assets = Environment()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    login_manager.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    assets.init_app(app)

    from . import main
    app.register_blueprint(main.bp, url_prefix="/")

    from . import auth
    app.register_blueprint(auth.bp, url_prefix="/auth")

    from . import catalog
    app.register_blueprint(catalog.bp, url_prefix="/catalog")

    from . import profile
    app.register_blueprint(profile.bp, url_prefix="/profile")

    from . import chapters
    app.register_blueprint(chapters.bp, url_prefix="/chapters")

    from . import manga
    app.register_blueprint(manga.bp, url_prefix="/manga")

    from . import api
    app.register_blueprint(api.bp, url_prefix="/api")

    from . import team
    app.register_blueprint(team.bp, url_prefix="/team")

    from . import search
    app.register_blueprint(search.bp, url_prefix="/search")

    from .admin import admin
    admin.init_app(app)

    from .error import register_error_handlers
    register_error_handlers(app)

    from . import posts
    app.register_blueprint(posts.bp, url_prefix="/posts")

    Minify(app=app, js=True, cssless=True, html=True)

    return app
