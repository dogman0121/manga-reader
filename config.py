import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config:
    SECRET_KEY = "x#g@LauJd*tTbH&fZX5Cc4tBSW&Vu#s@"
    JSON_AS_ASCII = False

    SQLALCHEMY_DATABASE_URI = 'postgresql://admin:123456@217.144.189.150:5432/manga-reader'

    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT"))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS") is not None
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")


class TestConfig:
    SECRET_KEY = "x#g@LauJd*tTbH&fZX5Cc4tBSW&Vu#s@"
    JSON_AS_ASCII = False

    SQLALCHEMY_DATABASE_URI = 'postgresql://test:123456@217.144.189.150:5433/manga-reader_test'

    SERVER_NAME = "127.0.0.1:8000"
    APPLICATION_ROOT = "/"
    PREFERRED_URL_SCHEME = "http"

    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'giachetti101@gmail.com'
    MAIL_DEFAULT_SENDER = 'giachetti101@gmail.com'
    MAIL_PASSWORD = 'dcnm jflp femx yuev'