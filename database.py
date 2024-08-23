import sqlite3
from datetime import datetime


connection = sqlite3.connect("database.db", check_same_thread=False)
connection.row_factory = sqlite3.Row
cursor = connection.cursor()


class User:
    @staticmethod
    def add(login, email, password):
        cursor.execute(""" INSERT INTO users VALUES (?, ?, ?)""", (login, email, password,))
        connection.commit()

    @staticmethod
    def remove(self):
        pass

    @staticmethod
    def update(self):
        pass

    @staticmethod
    def get_by_login(login, root=False):
        if root:
            cursor.execute(""" SELECT * FROM users WHERE login=? """, (login,))
        else:
            cursor.execute(""" SELECT id, login, email FROM users WHERE login=? """, (login,))
        return cursor.fetchone()

    @staticmethod
    def get_by_id(user_id, root=False):
        if root:
            cursor.execute(""" SELECT * FROM users WHERE id=? """, (user_id,))
        else:
            cursor.execute(""" SELECT id, login, email FROM users WHERE id=? """, (user_id,))
        return cursor.fetchone()

    @staticmethod
    def is_login_taken(login):
        user = User.get_by_login(login)
        if user is None:
            return False
        return True

    @staticmethod
    def change_login(user_id, login):
        cursor.execute(""" UPDATE users SET login=? WHERE id=? """, (login, user_id,))

    @staticmethod
    def change_password(user_id, password):
        cursor.execute(""" UPDATE users SET password=? WHERE id=? """, (password, user_id,))

    @staticmethod
    def change_email(user_id, email):
        cursor.execute(""" UPDATE users SET email=? WHERE id=? """, (email, user_id,))


class Comment:
    @staticmethod
    def add(title_id, text, user_id, root, parent):
        cursor.execute(
            """ INSERT INTO comments(title_id, parent, user_id, text, date, root) VALUES(?, ?, ?, ?, ?, ?) """,
                       (title_id, parent, user_id, text,
                        datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3], root)
        )
        connection.commit()
        cursor.execute(""" SELECT * FROM comments WHERE id=? """, (cursor.lastrowid,))
        return cursor.fetchone()

    @staticmethod
    def get(title_id, page):
        cursor.execute(
            f""" SELECT * FROM comments WHERE title_id=? AND parent is NULL LIMIT 20 OFFSET {(page-1) * 20} """,
                       (title_id,)
        )
        return cursor.fetchall()


    @staticmethod
    def get_answers(comment_id):
        cursor.execute(""" SELECT * FROM comments WHERE parent=? """, (comment_id,))
        return cursor.fetchall()

    @staticmethod
    def get_answers_count(parent):
        cursor.execute(""" SELECT * FROM comments WHERE parent=? """, (parent,))
        return len(cursor.fetchall())

    @staticmethod
    def vote_up(comment_id, user_id):
        is_voted = cursor.execute(
            """ SELECT * FROM votes WHERE user_id=? AND comment_id=? """, (user_id, comment_id,)
        ).fetchone()
        if is_voted is None:
            cursor.execute(
                """ UPDATE comments SET vote_up = vote_up + 1 WHERE id = ? """, (comment_id,)
            )
            cursor.execute(
                """ INSERT INTO votes(user_id, comment_id, type) VALUES (?, ?, ?) """, (user_id, comment_id, 1,)
            )
        elif is_voted["type"] == 0:
            cursor.execute(""" UPDATE votes SET type = 1 WHERE comment_id=? """, (comment_id,))
            cursor.execute(
                """ UPDATE comments SET vote_up = vote_up + 1, vote_down = vote_down - 1 WHERE id=? """, (comment_id,)
            )
        else:
            cursor.execute(""" DELETE FROM votes WHERE comment_id=? """, (comment_id,))
            cursor.execute(""" UPDATE comments SET vote_up = vote_up - 1 WHERE id=? """, (comment_id,))
        connection.commit()

    @staticmethod
    def vote_down(comment_id, user_id):
        is_voted = cursor.execute(
            """ SELECT * FROM votes WHERE user_id=? AND comment_id=? """, (user_id, comment_id,)
        ).fetchone()
        if is_voted is None:
            cursor.execute(
                """ UPDATE comments SET vote_down = vote_down + 1 WHERE id = ? """, (comment_id,)
            )
            cursor.execute(
                """ INSERT INTO votes(user_id, comment_id, type) VALUES (?, ?, ?) """, (user_id, comment_id, 0,)
            )
        elif is_voted["type"] == 1:
            cursor.execute(""" UPDATE votes SET type = 0 WHERE comment_id=? """, (comment_id,))
            cursor.execute(
                """ UPDATE comments SET vote_up = vote_up - 1, vote_down = vote_down + 1 WHERE id=? """, (comment_id,)
            )
        else:
            cursor.execute(""" DELETE FROM votes WHERE comment_id=? """, (comment_id,))
            cursor.execute(""" UPDATE comments SET vote_down = vote_down - 1 WHERE id=? """, (comment_id,))
        connection.commit()

    @staticmethod
    def get_vote(comment_id, user_id):
        vote = cursor.execute(
            """ SELECT * FROM votes WHERE user_id=? AND comment_id=? """, (user_id, comment_id,)
        ).fetchone()
        return vote


class Chapter:
    @staticmethod
    def get(title_id):
        cursor.execute(""" SELECT * FROM chapters WHERE title_id=? """, (title_id,))
        return cursor.fetchall()

    @staticmethod
    def get_info(chapter_id):
        cursor.execute(""" SELECT * FROM chapters WHERE id=? """, (chapter_id,))
        return cursor.fetchone()


class Title:
    @staticmethod
    def add_view(title_id):
        cursor.execute(""" UPDATE titles SET views=views+1 WHERE id=? """, (title_id,))
        connection.commit()
    @staticmethod
    def get(title_id):
        cursor.execute(""" SELECT * FROM titles WHERE id=? """, (title_id,))
        title = dict(cursor.fetchone())
        title["type"] = {1: "Манхва", 2: "Манга", 3: "Маньхуа"}[title["type"]]
        title["status"] = {1: "Выпускается", 2: "Завершено", 3: "Заброшено"}[title["status"]]
        title["genres"] = Genres.get_title_genres(title_id)
        title["rating"] = Rating.get_title_average_rating(title_id)
        title["rating_voices"] = Rating.get_rating_voices_count(title_id)
        title["saves"] = Saves.get_saves(title_id)
        return title

    @staticmethod
    def get_comments_counts(title_id):
        cursor.execute(""" SELECT * FROM comments WHERE title_id=? """, (title_id,))
        return len(cursor.fetchall())

    @staticmethod
    def get_title_with_filter(type=None, genres=None, tags=None, status=None, adult=None, rating_from=None,
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

        titles = cursor.execute(""" SELECT id FROM titles """).fetchall()
        answer = []
        for title in titles:
            flag = True
            title_id = title["id"]
            if type is not None:
                t_type = cursor.execute(
                    """ SELECT type FROM titles WHERE id=? """, (title_id,)
                ).fetchone()["type"]
                if t_type in type:
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
                r_rating = Rating.get_title_average_rating(title_id)
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
            return answer[:20]
        else:
            return answer[20*(page-1):20+page]


class Rating:
    @staticmethod
    def get_user_rating(user_id):
        cursor.execute(""" SELECT * FROM rating WHERE user_id=? """, (user_id,))
        return cursor.fetchall()

    @staticmethod
    def get_title_ratings(title_id):
        cursor.execute(""" SELECT rating FROM rating WHERE title_id=? """, (title_id,))
        return cursor.fetchall()

    @staticmethod
    def get_title_average_rating(title_id):
        title_ratings = Rating.get_title_ratings(title_id)
        ratings_sum = sum(i["rating"] for i in title_ratings)
        ratings_count = len(title_ratings)
        try:
            return round((ratings_sum / ratings_count), 2)
        except ZeroDivisionError:
            return 0

    @staticmethod
    def get_rating_voices_count(title_id):
        cursor.execute(""" SELECT COUNT(*) FROM rating WHERE title_id=? """, (title_id,))
        return cursor.fetchone()[0]

    @staticmethod
    def get_title_rating_by_user(user_id, title_id):
        cursor.execute(""" SELECT rating FROM rating WHERE user_id=? AND title_id=? """, (user_id, title_id,))
        rating = cursor.fetchone()
        if rating is None:
            return None
        return rating["rating"]

    @staticmethod
    def add_rating(user_id, title_id, rating):
        cursor.execute(
            """ INSERT INTO rating(user_id, title_id, rating) VALUES (?, ?, ?) """,
            (user_id, title_id, rating,)
        )
        connection.commit()

    @staticmethod
    def update_rating(user_id, title_id, rating):
        cursor.execute(
            """ UPDATE rating SET rating=? WHERE user_id=? AND title_id=? """,
            (rating, user_id, title_id,)
        )
        connection.commit()

    @staticmethod
    def delete_rating(user_id, title_id):
        cursor.execute(""" DELETE FROM rating WHERE user_id=? AND title_id=? """, (user_id, title_id,))
        connection.commit()


class Saves:
    @staticmethod
    def is_saved(user_id, title_id):
        cursor.execute(""" SELECT * FROM saves WHERE user_id=? AND title_id=? """, (user_id, title_id,))
        if cursor.fetchone() is not  None:
            return True
        return False

    @staticmethod
    def get_saves(title_id):
        cursor.execute(""" SELECT COUNT(*) FROM saves WHERE title_id=? """, (title_id,))
        return cursor.fetchone()[0]

    @staticmethod
    def add_save(user_id, title_id):
        cursor.execute(""" INSERT INTO saves(user_id, title_id) VALUES(?, ?) """, (user_id, title_id,))
        connection.commit()

    @staticmethod
    def delete_save(user_id, title_id):
        cursor.execute(""" DELETE FROM saves WHERE user_id=? AND title_id=? """, (user_id, title_id,))
        connection.commit()


class Genres:
    @staticmethod
    def get_genres():
        return cursor.execute(" SELECT * FROM genres ").fetchall()

    @staticmethod
    def get_title_genres(title_id):
        cursor.execute(
            """ SELECT id, name FROM titles_genres JOIN genres ON titles_genres.genre_id = genres.id WHERE title_id=? """,
            (title_id,)
        )
        ans = cursor.fetchall()
        ans = [dict(i) for i in ans]
        return ans

    @staticmethod
    def get_genre(genre_id):
        cursor.execute(""" SELECT * FROM genres WHERE id=? """, (genre_id,))
        return dict(cursor.fetchone())

    @staticmethod
    def add_genre(genre_name):
        cursor.execute(""" INSERT INTO genres(name) VALUES(?) """, (genre_name,))
        connection.commit()

    @staticmethod
    def delete_genre(genre_id):
        cursor.execute(""" DELETE FROM genres WHERE id=? """, (genre_id,))


class Types:
    @staticmethod
    def get_types():
        return cursor.execute(""" SELECT * FROM types """).fetchall()


class Tags:
    @staticmethod
    def get_tags():
        return cursor.execute(""" SELECT * FROM tags """).fetchall()


class Statuses:
    @staticmethod
    def get_statuses():
        return cursor.execute(""" SELECT * FROM statuses """).fetchall()


#Title.get_title_with_filter(type=[1, 2, 3, 5])

#print(cursor.execute(""" SELECT id FROM titles JOIN saves ON titles.id=saves.title_id GROUP BY id ORDER BY COUNT(*) DESC""").fetchall())