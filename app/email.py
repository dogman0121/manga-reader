from threading import Thread
from flask_mail import Message, current_app
from flask import render_template
from app import mail
from jwt import encode, decode
from time import time


def send_email(subject, sender, recipients, text, html):
    msg = Message(subject, recipients=recipients, sender=sender)
    msg.text = text
    msg.html = html
    mail.send(msg)
    Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)


def send_password_recovery_mail(user_id, email):
    token = generate_password_recovery_token(user_id)
    send_email("Восстановление пароля",
               sender=current_app.config["MAIL_DEFAULT_SENDER"],
               recipients=[email],
               text=render_template("email/recovery_password.txt", token=token),
               html=render_template("email/recovery_password.html", token=token)
               )


def generate_password_recovery_token(user_id):
    return encode(
        {"id": user_id, "exp": time() + 600},
        current_app.config["SECRET_KEY"], algorithm="HS256"
    )


def check_password_recovery_token(token):
    try:
        user_id = decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])["id"]
        return user_id
    except:
        return
