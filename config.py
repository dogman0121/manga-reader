import os
from dotenv import load_dotenv

load_dotenv(".env")


class Config:
    SECRET_KEY = "x#g@LauJd*tTbH&fZX5Cc4tBSW&Vu#s@"
    JSON_AS_ASCII = False

    SQLALCHEMY_DATABASE_URI = 'postgresql://admin:123456@217.144.189.150:5432/manga-reader'

    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = os.environ.get("MAIL_PORT")
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS")
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

    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = os.environ.get("MAIL_PORT")
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS")
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")