import os


class Config:
    SECRET_KEY = "x#g@LauJd*tTbH&fZX5Cc4tBSW&Vu#s@"
    JSON_AS_ASCII = False

    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.getcwd() + "\\database\\database.db"
    print(SQLALCHEMY_DATABASE_URI)

    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'giachetti101@gmail.com'
    MAIL_DEFAULT_SENDER = 'giachetti101@gmail.com'
    MAIL_PASSWORD = 'dcnm jflp femx yuev'