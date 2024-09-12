from flask import Flask
from flask_mail import Mail
from app.models import User
from flask_login import LoginManager


login_manager = LoginManager()
mail = Mail()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    login_manager.init_app(app)
    mail.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp, url_prefix="/auth")

    from . import catalog
    app.register_blueprint(catalog.bp, url_prefix="/catalog")

    from . import profile
    app.register_blueprint(profile.bp, url_prefix="/profile")

    from . import chapters
    app.register_blueprint(chapters.bp, url_prefix="/chapters")

    from . import manga_card
    app.register_blueprint(manga_card.bp, url_prefix="/manga")

    from . import api
    app.register_blueprint(api.bp, url_prefix="/api")

    return app


@login_manager.user_loader
def load_user(user_id):
    return User.get_by_id(user_id)

