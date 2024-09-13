import sqlite3
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash
import os
from flask import url_for


connection = sqlite3.connect("database.db", check_same_thread=False)
connection.row_factory = sqlite3.Row
cursor = connection.cursor()


# ---------------- User model ----------------
class User(UserMixin):
    def __init__(self, user_id=None, login=None, email=None, password_hash=None, avatar=None, role=1):
        self.id = user_id
        self.login = login
        self.email = email
        self.password_hash = password_hash
        self.avatar = avatar
        self.role = role

    @staticmethod
    def create_from_sql(sql_row):
        user_id = sql_row["id"]
        login = sql_row["login"]
        email = sql_row["email"]
        password_hash = sql_row["password"]
        role = sql_row["role"]
        user = User(user_id=user_id, login=login, email=email, password_hash=password_hash, role=role)
        return user

    @staticmethod
    def is_login_taken(login):
        result = cursor.execute(""" SELECT * FROM users WHERE login=? """, (login,)).fetchone()
        if result is None:
            return False
        return True

    @staticmethod
    def get_by_login(login: str):
        user_row = cursor.execute(""" SELECT * FROM users WHERE login=? """,
                                (login,)).fetchone()
        user = User.create_from_sql(user_row)
        user.avatar = user.get_avatar()
        return user

    @staticmethod
    def get_by_id(user_id: int):
        user_row = cursor.execute(""" SELECT * FROM users WHERE id=? """,
                                  (user_id,)).fetchone()
        user = User.create_from_sql(user_row)
        user.avatar = user.get_avatar()
        return user

    def get_avatar(self):
        if os.path.exists(f"app/static/media/avatars/{self.id}.png"):
            return url_for("static", filename=f"media/avatars/{self.id}.png")
        else:
            return url_for("static", filename=f"media/avatars/default.png")

    def add(self):
        cursor.execute("INSERT INTO users(login, email, password_hash, role) VALUES(?, ?, ?, ?) ",
                       (self.login, self.email, self.password_hash, self.role,))
        connection.commit()

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def change_password(self, new_password):
        new_password_hash = generate_password_hash(new_password)
        cursor.execute(""" UPDATE users SET password=? WHERE id=? """,
                       (new_password_hash, self.id))
        connection.commit()
        self.password_hash = new_password_hash

    def change_login(self, new_login):
        cursor.execute(""" UPDATE users SET login=? WHERE id=? """,
                       (new_login, self.id,))
        connection.commit()
        self.login = new_login

    def change_email(self, new_email):
        cursor.execute(""" UPDATE users SET email=? WHERE id=? """,
                       (new_email, self.id,))
        connection.commit()
        self.login = new_email

    def change_role(self, role):
        cursor.execute(""" UPDATE users SET role=? WHERE id=? """, (role, self.id,))
        self.role = role

    def get_saves(self):
        result = cursor.execute(""" SELECT * FROM saves WHERE user_id=? """, (self.id,)).fetchall()
        return result


# ---------------- Comment model ----------------
class Comment:
    def __init__(self, comment_id=None, text=None, date=None, user=None, title_id=None, root=None, parent=None,
                 up_votes=0, down_votes=0, answers_count=0):
        self.id = comment_id
        self.text = text
        self.date = date
        self.user = user
        self.title_id = title_id
        self.root = root
        self.parent = parent
        self.up_votes = up_votes
        self.down_votes = down_votes
        self.answers_count = answers_count

    @staticmethod
    def create_from_sql(sql_row):
        comment = Comment()
        comment.id = sql_row["id"]
        comment.text = sql_row["text"]
        comment.date = sql_row["date"]
        comment.user = User.get_by_id(sql_row["user_id"])
        comment.title_id = sql_row["title_id"]
        comment.root = sql_row["root"]
        comment.parent = sql_row["parent"]
        comment.up_votes = comment.get_up_votes()
        comment.down_votes = comment.get_down_votes()
        comment.answers_count = comment.get_answers_count()
        return comment

    @staticmethod
    def get_by_id(comment_id):
        comment = Comment.create_from_sql(
            cursor.execute(""" SELECT * FROM comments WHERE id=? """, (comment_id,)).fetchone())
        return comment

    def get_up_votes(self):
        result = cursor.execute(""" SELECT COUNT(*) AS up_votes FROM votes WHERE comment_id=? AND type=1 """,
                                (self.id,)).fetchone()
        return result["up_votes"]

    def get_down_votes(self):
        result = cursor.execute(""" SELECT COUNT(*) AS down_votes FROM votes WHERE comment_id=? AND type=0 """,
                                (self.id,)).fetchone()
        return result["down_votes"]

    def get_user_vote(self, user):
        vote_row = cursor.execute(""" SELECT * FROM votes WHERE comment_id=? AND user_id=? """,
                                  (self.id, user.id,)).fetchone()
        if vote_row:
            vote = Vote.create_from_sql(vote_row)
            return vote

    def add(self):
        date = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]
        cursor.execute(""" 
            INSERT INTO comments(text, date, user_id, title_id, root, parent) 
            VALUES(?, ?, ?, ?, ?, ?) """,
                       (self.text, date, self.user.id, self.title_id, self.root, self.parent))
        connection.commit()
        self.id = cursor.lastrowid
        self.date = date

    def add_answer(self, text, user, title):
        date = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]
        if self.root is None:
            cursor.execute(""" 
            INSERT INTO comments(text, date, user_id, title_id, root, parent) VALUES(?, ?, ?, ?, ?, ?) 
            """, (text, date, user.id, title.id, self.id, self.id))
        else:
            cursor.execute(
                """ INSERT INTO comments(text, date, user_id, title_id, root, parent) VALUES(?, ?, ?, ?, ?, ?) """,
                (text, date, user.id, title.id, self.root, self.id))
        connection.commit()

    def get_answers(self):
        result = cursor.execute(""" SELECT * FROM comments WHERE root=? """, (self.id,)).fetchall()
        return [Comment.create_from_sql(answer) for answer in result]

    def get_answers_count(self):
        result = cursor.execute(""" SELECT COUNT(*) as answers_count FROM comments WHERE root=? """,
                                (self.id,)).fetchone()
        return result["answers_count"]

    def delete(self):
        cursor.execute(""" DELETE from comments WHERE id=? """, (self.id,))
        connection.commit()

    def add_vote(self, user, vote_type):
        cursor.execute(""" INSERT INTO votes(user_id, comment_id, type) VALUES(?, ?, ?) """,
                       (user.id, self.id, vote_type,))
        connection.commit()

    def delete_vote(self, user):
        cursor.execute(""" DELETE FROM votes WHERE user_id=? AND comment_id=? """, (user.id, self.id,))
        connection.commit()

    def update_vote(self, user, vote_type):
        cursor.execute(""" UPDATE votes SET type=? WHERE user_id=? AND comment_id=? """, (vote_type, user.id, self.id))
        connection.commit()


# ---------------- Chapter model ----------------
class Chapter:
    def __init__(self, chapter_id=None, name=None, title_id=None, chapter=None, date=None):
        self.id = chapter_id
        self.name = name
        self.title_id = title_id
        self.chapter = chapter
        self.date = date

    @staticmethod
    def create_from_sql(sql_row):
        chapter = Chapter()
        chapter.id = sql_row["id"]
        chapter.name = sql_row["name"]
        chapter.title_id = sql_row["title_id"]
        chapter.chapter = sql_row["chapter"]
        chapter.date = sql_row["date"]
        return chapter

    @staticmethod
    def get_by_id(chapter_id):
        result = cursor.execute(""" SELECT * FROM chapters WHERE id=? """, (chapter_id,)).fetchone()
        return Chapter.create_from_sql(result)

    def add(self):
        cursor.execute(""" INSERT INTO chapters(name, title_id, chapter, date) VALUES(?, ?, ?) """,
                       (self.name, self.title_id, self.chapter, self.date))
        connection.commit()


# ---------------- Title model ----------------
class Title:
    def __init__(self, title_id=None, title_type=None, status=None, name_russian=None, name_english=None,
                 name_languages=None, poster=None, description=None, genres=[], tags=[], year=None, views=None,
                 saves=None, rating=None, rating_votes=None, author=None, translator=None):
        self.id = title_id
        self.type = title_type
        self.status = status
        self.name_russian = name_russian
        self.name_english = name_english
        self.name_languages = name_languages
        self.poster = poster
        self.description = description
        self.genres = genres
        self.tags = tags
        self.year = year
        self.views = views
        self.saves = saves
        self.rating = rating
        self.rating_votes = rating_votes
        self.author = author
        self.translator = translator

    @staticmethod
    def create_from_sql(sql_row):
        title = Title()
        title.id = sql_row["id"]
        title.type = Type.get_by_id(sql_row["type_id"])
        title.status = Status.get_by_id(sql_row["status_id"])
        title.name_russian = sql_row["name_russian"]
        title.name_english = sql_row["name_english"]
        title.name_languages = sql_row["name_languages"]
        title.poster = title.get_poster()
        title.description = sql_row["description"]
        title.genres = title.get_genres()
        title.tags = title.get_tags()
        title.year = sql_row["year"]
        title.views = sql_row["views"]
        title.saves = sql_row["saves"] if sql_row["saves"] else 0
        title.rating = sql_row["rating"] if sql_row["rating"] else 0
        title.rating_votes = sql_row["rating_votes"] if sql_row["rating_votes"] else 0
        title.author = sql_row["author"]
        title.translator = sql_row["translator"]
        return title

    @staticmethod
    def get_by_id(title_id):
        title_row = cursor.execute("""
                SELECT titles.id, name_russian, name_english, name_languages, description, type_id, status_id, year, 
                views, saves, AVG(rating) AS rating, COUNT(rating) AS rating_votes, author, translator
                FROM titles
                LEFT JOIN rating
                ON titles.id = rating.title_id
                LEFT JOIN
                (SELECT title_id, COUNT(*) AS saves FROM saves WHERE title_id=? ORDER BY title_id) as t1
                ON titles.id = t1.title_id
                WHERE titles.id=? """, (title_id, title_id,)).fetchone()
        title = Title.create_from_sql(title_row)
        return title

    @staticmethod
    def get_with_filter(title_type=None, genres=None, tags=None, status=None, adult=None, rating_from=None,
                        rating_to=None, year_from=None, year_to=None, sort=None, page=None):
        if sort is None or sort == 1:
            titles = cursor.execute(""" SELECT id FROM titles ORDER BY views DESC""").fetchall()
        elif sort == 2:
            titles = cursor.execute(
                """ SELECT id FROM titles JOIN saves ON titles.id=saves.title_id GROUP BY id ORDER BY COUNT(*) DESC"""
            ).fetchall()
        elif sort == 3:
            titles = cursor.execute(
                """ SELECT id FROM titles JOIN rating ON titles.id=rating.title_id GROUP BY id ORDER BY COUNT(*) DESC"""
            ).fetchall()
        elif sort == 4:
            titles = cursor.execute(""" SELECT id FROM titles ORDER BY year DESC""").fetchall()
        else:
            titles = cursor.execute(""" SELECT id FROM titles """).fetchall()
        answer = []
        for title in titles:
            flag = True
            title_id = title["id"]
            if title_type is not None:
                t_type = cursor.execute(
                    """ SELECT types.id as type FROM titles LEFT JOIN types ON titles.type_id = types.id 
                    WHERE titles.id=? """, (title_id,)
                ).fetchone()["type"]
                if t_type in title_type:
                    pass
                else:
                    flag = False
            if genres is not None and flag:
                g_genres = cursor.execute(
                    """ SELECT genre_id FROM titles_genres WHERE title_id=? """, (title_id,)
                ).fetchall()
                genres_list = [i["genre_id"] for i in g_genres]
                for g in genres:
                    if g in genres_list:
                        pass
                    else:
                        flag = False
                        break
            if tags is not None and flag:
                t_tags = cursor.execute(
                    """ SELECT tag_id FROM titles_tags WHERE title_id=? """, (title_id,)
                ).fetchall()
                tags_list = [i["genre_id"] for i in t_tags]
                for t in tags:
                    if t in tags_list:
                        pass
                    else:
                        flag = False
                        break
            if status is not None and flag:
                s_status = cursor.execute(
                    """ SELECT status FROM titles WHERE id=? """, (title_id,)
                ).fetchone()["status"]
                if s_status in status:
                    pass
                else:
                    flag = False
            if (rating_from is not None or rating_to is not None) and flag:
                t = Title.get_by_id(title_id)
                r_rating = t.rating
                if rating_from is not None and rating_from > r_rating:
                    flag = False
                if rating_to is not None and rating_to < r_rating:
                    flag = False
            if (year_from is not None or year_to is not None) and flag:
                y_year = cursor.execute(
                    """ SELECT year FROM titles WHERE id=? """, (title_id,)
                ).fetchone()["year"]
                if year_from is not None and year_from > y_year:
                    flag = False
                if year_to is not None and year_to < y_year:
                    flag = False
            if flag:
                answer.append(title_id)

        if page == 1 or page is None:
            return [Title.get_by_id(i) for i in answer[:20]]
        else:
            return [Title.get_by_id(i) for i in answer[20 * (page - 1):20 + page]]

    def add(self):
        cursor.execute(
            """
             INSERT INTO titles(type_id, status_id, name_russian, name_english, name_languages, description, year, 
             author, translator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             """,
            (self.type.id, self.status.id, self.name_russian, self.name_english, self.name_languages, self.description,
             self.year, self.author, self.translator,)
        )

        self.id = cursor.lastrowid
        for i in self.genres:
            self.add_genre(i)

        connection.commit()

    def update(self):
        cursor.execute(
            """
             UPDATE titles SET type_id=?, status_id=?, name_russian=?, name_english=?, name_languages=?, description=?, 
             year=?, author=?, translator=? WHERE id=?
             """,
            (self.type.id, self.status.id, self.name_russian, self.name_english, self.name_languages, self.description,
             self.year, self.author, self.translator, self.id,)
        )

        cursor.execute(""" DELETE FROM titles_genres WHERE title_id=? """, (self.id,))

        for i in self.genres:
            self.add_genre(i)

        connection.commit()

    def add_genre(self, genre):
        cursor.execute(""" INSERT INTO titles_genres(genre_id, title_id) VALUES(?, ?) """, (genre.id, self.id,))
        connection.commit()

    def get_genres(self):
        result = cursor.execute(""" 
            SELECT id, name 
            FROM titles_genres
            LEFT JOIN genres
            ON titles_genres.genre_id = genres.id
            WHERE titles_genres.title_id=?
            """, (self.id,)).fetchall()
        return [Genre.create_from_sql(i) for i in result]

    def get_poster(self):
        return url_for("static", filename=f"media/posters/{self.id}.jpg")

    def get_tags(self):
        result = cursor.execute(""" 
            SELECT id, name 
            FROM titles_tags
            LEFT JOIN tags
            ON titles_tags.tag_id = tags.id
            WHERE titles_tags.title_id=?
            """, (self.id,)).fetchall()
        return [Tag.create_from_sql(i) for i in result]

    def add_view(self):
        cursor.execute(""" UPDATE titles SET views=views+1 WHERE id=? """, (self.id,))
        self.views += 1
        connection.commit()

    def get_comments_count(self):
        result = cursor.execute(""" SELECT COUNT(*) as comments_count FROM comments WHERE title_id=? """,
                                (self.id,)).fetchone()
        return result["comments_count"]

    def get_chapters(self):
        result = cursor.execute(""" SELECT * FROM chapters WHERE title_id=? """, (self.id,)).fetchall()
        return [Chapter.create_from_sql(i) for i in result]

    def get_user_rating(self, user):
        result = cursor.execute(""" SELECT * FROM rating WHERE user_id=? AND title_id=? """,
                                (user.id, self.id,)).fetchone()
        if result:
            return result["rating"]

    def is_saved(self, user):
        result = cursor.execute(""" SELECT * FROM saves WHERE user_id=? AND title_id=? """,
                                (user.id, self.id)).fetchone()
        if result:
            return True
        return False

    def get_comments(self, page=1):
        result = cursor.execute(
            f""" SELECT * FROM comments WHERE title_id=? AND parent is NULL LIMIT 20 OFFSET {(page - 1) * 20} """,
            (self.id,)
        ).fetchall()
        return [Comment.create_from_sql(i) for i in result]


class Rating:
    def __init__(self, user_id=None, title_id=None, rating=None):
        self.user_id = user_id
        self.title_id = title_id
        self.rating = rating

    @staticmethod
    def create_from_sql(sql_row):
        rating = Rating
        rating.user_id = sql_row["user_id"]
        rating.title_id = sql_row["title_id"]
        rating.rating = sql_row["rating"]
        return rating

    def add(self):
        cursor.execute(""" INSERT INTO rating(user_id, title_id, rating) VALUES (?, ?, ?) """,
                       (self.user_id, self.title_id, self.rating))
        connection.commit()

    def delete(self):
        cursor.execute(""" DELETE FROM rating WHERE user_id=? AND title_id=? """, (self.user_id, self.title_id,))
        connection.commit()

    def update(self, new_rating):
        cursor.execute(""" UPDATE rating SET rating=? WHERE user_id=? AND title_id=? """,
                       (new_rating, self.user_id, self.title_id,))
        connection.commit()
        self.rating = new_rating


class Save:
    def __init__(self, user_id=None, title_id=None):
        self.user_id = user_id
        self.title_id = title_id

    def add(self):
        cursor.execute(""" INSERT INTO saves(user_id, title_id) VALUES(?, ?) """, (self.user_id, self.title_id,))
        connection.commit()

    def delete(self):
        cursor.execute(""" DELETE FROM saves WHERE user_id=? AND title_id=? """, (self.user_id, self.title_id,))
        connection.commit()


class Genre:
    def __init__(self, genre_id=None, name=None):
        self.id = genre_id
        self.name = name

    @staticmethod
    def create_from_sql(sql_row):
        genre = Genre()
        genre.id = sql_row["id"]
        genre.name = sql_row["name"]
        return genre

    @staticmethod
    def get_all():
        result = cursor.execute(""" SELECT * FROM genres """).fetchall()
        return [Genre.create_from_sql(i) for i in result]


class Tag:
    def __init__(self, tag_id=None, name=None):
        self.id = tag_id
        self.name = name

    @staticmethod
    def create_from_sql(sql_row):
        tag = Tag()
        tag.id = sql_row["id"]
        tag.name = sql_row["name"]
        return tag

    @staticmethod
    def get_all():
        result = cursor.execute(""" SELECT * FROM tags """).fetchall()
        return [Tag.create_from_sql(i) for i in result]


class Status:
    def __init__(self, status_id=None, name=None):
        self.id = status_id
        self.name = name

    @staticmethod
    def create_from_sql(sql_row):
        status = Status()
        status.id = sql_row["id"]
        status.name = sql_row["name"]
        return status

    @staticmethod
    def get_by_id(status_id):
        status_row = cursor.execute(""" SELECT * FROM statuses WHERE id=? """, (status_id,)).fetchone()
        return Status.create_from_sql(status_row)

    @staticmethod
    def get_all():
        result = cursor.execute(""" SELECT * FROM statuses """).fetchall()
        return [Status.create_from_sql(i) for i in result]


class Type:
    def __init__(self, type_id=None, name=None):
        self.id = type_id
        self.name = name

    @staticmethod
    def create_from_sql(sql_row):
        type = Status()
        type.id = sql_row["id"]
        type.name = sql_row["name"]
        return type

    @staticmethod
    def get_by_id(status_id):
        status_row = cursor.execute(""" SELECT * FROM types WHERE id=? """, (status_id,)).fetchone()
        return Type.create_from_sql(status_row)

    @staticmethod
    def get_all():
        result = cursor.execute(""" SELECT * FROM types """).fetchall()
        return [Type.create_from_sql(i) for i in result]


class Vote:
    def __init__(self, comment_id=None, user_id=None, vote_type=None):
        self.comment_id = comment_id
        self.user_id = user_id
        self.type = vote_type

    @staticmethod
    def create_from_sql(sql_row):
        vote = Vote()
        vote.comment_id = sql_row["comment_id"]
        vote.user_id = sql_row["user_id"]
        vote.type = sql_row["type"]
        return vote
