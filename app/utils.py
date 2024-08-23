from database import User, Comment, Chapter
from flask import url_for
from flask_login import current_user
import os


def get_user_data(user_id):
    user_data = {}
    if User().get_by_id(user_id):
        user_data["authorized"] = True
        user_data = user_data | dict(User().get_by_id(user_id))
    else:
        user_data["authorized"] = False

    if os.path.exists(f"app/static/media/avatars/{user_id}.png"):
        user_data["avatar"] = url_for('static', filename=f"media/avatars/{user_id}.png")
    else:
        user_data["avatar"] = url_for('static', filename='manga_card/images/user1.svg')

    return user_data


def get_comment_as_dict(comment):
    comment_dict = dict()
    comment_dict["user"] = get_user_data(comment["user_id"])
    comment_dict["answers_count"] = Comment.get_answers_count(comment["id"])
    comment_dict["text"] = comment["text"]
    comment_dict["user_id"] = comment["user_id"]
    comment_dict["title_id"] = comment["title_id"]
    comment_dict["parent"] = comment["parent"]
    comment_dict["root"] = comment["root"]
    comment_dict["date"] = comment["date"]
    comment_dict["id"] = comment["id"]
    comment_dict["vote_up"] = comment["vote_up"]
    comment_dict["vote_down"] = comment["vote_down"]

    if current_user.get_id() is None:
        return comment_dict
    user_vote = Comment.get_vote(comment["id"], current_user.get_id())
    if user_vote is None:
        comment_dict["voted_by_user"] = False
    else:
        comment_dict["is_voted_by_user"] = True
        comment_dict["user_vote_type"] = user_vote["type"]
    return comment_dict


def get_title_chapters(title_id):
    chapters = list()
    chapters_raw = Chapter.get(title_id)
    for i in chapters_raw:
        chapter = dict()
        chapter["id"] = i["id"]
        chapter["tome"] = i["tome"]
        chapter["chapter"] = i["chapter"]
        chapter["author"] = i["author"]
        chapter["date"] = i["date"]
        chapters.append(chapter)
    return chapters