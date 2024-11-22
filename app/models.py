from flask import url_for
from flask_login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_method
from sqlalchemy import exists, ForeignKey, Table, Column, Integer, Select, and_, func, insert, delete, update
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from app import db, login_manager
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
import os

saves = Table(
    "saves",
    db.metadata,
    Column("user_id", Integer(), ForeignKey("users.id"), nullable=False),
    Column("title_id", Integer(), ForeignKey("titles.id"), nullable=False)
)


class User(db.Model, UserMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True, unique=True)
    login: Mapped[str] = mapped_column(unique=True, nullable=False)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[int] = mapped_column(default=1, nullable=False)
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("teams.id"), nullable=True)
    team: Mapped[Optional["Team"]] = relationship(uselist=False, back_populates="members",
                                                  primaryjoin="User.team_id == Team.id")
    comments: Mapped["Comment"] = relationship(back_populates="user")
    saves: Mapped[list["Title"]] = relationship(uselist=True, secondary="saves")

    @staticmethod
    def get_by_id(user_id: int):
        return db.session.get(User, user_id)

    @staticmethod
    def get_by_login(login: str):
        return db.session.execute(Select(User).where(User.login == login)).scalar()

    @staticmethod
    def get_by_email(email: str):
        return db.session.execute(Select(User).where(User.email == email)).scalar()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def set_login(self, login):
        self.login = login

    def set_email(self, email):
        self.email = email

    def add_team(self, team_id):
        self.team_id = team_id
        self.update()

    def remove_team(self):
        self.team_id = None
        self.update()

    def is_team_leader(self):
        if self.team_id:
            return self.id == self.team.leader_id
        return False

    def get_avatar(self):
        if os.path.exists(f"app/static/media/avatars/{self.id}.png"):
            return url_for("static", filename=f"media/avatars/{self.id}.png", _external=True)
        else:
            return url_for("static", filename=f"media/avatars/default.png", _external=True)

    def add_save(self, title):
        db.session.execute(insert(saves).values(user_id=self.id, title_id=title.id))
        db.session.commit()

    def remove_save(self, title):
        db.session.execute(delete(saves).where(and_(saves.c.user_id == self.id, saves.c.title_id == title.id)))
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "login": self.login,
            "email": self.email,
            "team_id": self.team_id,
            "role": self.role,
            "avatar": self.get_avatar()
        }


@login_manager.user_loader
def load_user(user_id):
    return User.get_by_id(int(user_id))


class Type(db.Model):
    __tablename__ = "types"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False,
                                    unique=True)
    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    @staticmethod
    def get_all():
        return db.session.execute(Select(Type)).scalars()

    @staticmethod
    def get_by_id(type_id):
        return db.session.execute(Select(Type).where(Type.id == type_id)).scalar()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }


class Status(db.Model):
    __tablename__ = "statuses"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False, unique=True)
    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    @staticmethod
    def get_all():
        return db.session.execute(Select(Status)).scalars()

    @staticmethod
    def get_by_id(status_id):
        return db.session.execute(Select(Status).where(Status.id == status_id)).scalar()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }


titles_genres = Table(
    "titles_genres",
    db.metadata,
    Column("title_id", Integer(), ForeignKey("titles.id")),
    Column("genre_id", Integer(), ForeignKey("genres.id"))
)


class Genre(db.Model):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False, unique=True)
    name: Mapped[str] = mapped_column(nullable=False, unique=True)

    @staticmethod
    def get_all():
        return db.session.execute(Select(Genre)).scalars()

    @staticmethod
    def get_by_id(genre_id):
        return db.session.execute(Select(Genre).where(Genre.id == genre_id)).scalar()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }


ratings = Table(
    "ratings",
    db.metadata,
    Column("user_id", Integer(), ForeignKey("users.id"), nullable=False),
    Column("title_id", Integer(), ForeignKey("titles.id"), nullable=False),
    Column("rating", Integer(), nullable=False)
)


class Chapter(db.Model):
    __tablename__ = "chapters"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False, unique=True)
    name: Mapped[str] = mapped_column(nullable=True)
    title_id: Mapped[int] = mapped_column(ForeignKey("titles.id"), nullable=False)
    title: Mapped["Title"] = relationship(back_populates="chapters")
    tome: Mapped[int] = mapped_column(nullable=False)
    chapter: Mapped[int] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=True)
    team: Mapped["Team"] = relationship(back_populates="chapters")

    @staticmethod
    def get_by_id(chapter_id):
        return db.session.execute(Select(Chapter).where(Chapter.id == chapter_id)).scalar()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def get_pages(self) -> list[str]:
        images_list = []
        for i in range(len(os.listdir(f"app/static/media/chapters/{self.id}"))):
            images_list.append(url_for("static", filename=f"media/chapters/{self.id}/{i + 1}.jpeg"))
        return images_list

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "title_id": self.title_id,
            "tome": self.tome,
            "chapter": self.chapter,
            "date": self.date.strftime("%Y-%m-%d")
        }


class Title(db.Model):
    __tablename__ = "titles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False, unique=True)
    type_id: Mapped[int] = mapped_column(ForeignKey("types.id"), nullable=True)
    type: Mapped["Type"] = relationship()
    status_id: Mapped[int] = mapped_column(ForeignKey("statuses.id"), nullable=True)
    status: Mapped["Status"] = relationship()
    name_russian: Mapped[str] = mapped_column(nullable=False)
    name_english: Mapped[str] = mapped_column(nullable=True)
    name_languages: Mapped[str] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(nullable=True)
    year: Mapped[int] = mapped_column(nullable=True)
    views: Mapped[int] = mapped_column(default=0)
    genres: Mapped[list["Genre"]] = relationship(secondary="titles_genres")
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    author: Mapped[User] = relationship("User")
    chapters: Mapped[list["Chapter"]] = relationship(uselist=True, back_populates="title")
    comments: Mapped[list["Comment"]] = relationship(uselist=True, back_populates="title")
    translators: Mapped[list["Team"]] = relationship(uselist=True, secondary="titles_translators", back_populates="titles")

    @staticmethod
    def get_by_id(title_id):
        return db.session.get(Title, title_id)

    @hybrid_method
    def validate_types(self, type_ids: list[int]):
        if not type_ids:
            return True

        return self.type_id.in_(type_ids)

    @hybrid_method
    def validate_statuses(self, status_ids: list[int]):
        if not status_ids:
            return True

        return self.status_id.in_(status_ids)

    @hybrid_method
    def validate_genres(self, genres: list[int]):
        if not genres:
            return True

        title_genres = db.session.execute(Select(titles_genres.c.genre_id).where(
            titles_genres.c.title_id == self.id)).scalars()

        title_genres_list = list(title_genres)

        if not title_genres_list:
            return False

        return all(genre in title_genres_list for genre in genres)

    @hybrid_method
    def validate_year(self, year_from: int, year_to: int):
        return and_(year_from <= self.year, self.year <= year_to)

    @hybrid_method
    def validate_rating(self, rating_from: int, rating_to: int):
        rating_sum, rating_len = self.get_rating()
        if rating_len == 0:
            return False
        rating = rating_sum / rating_len
        return and_(rating_from <= rating, rating <= rating_to)

    @staticmethod
    def get_with_filters(types: list[int] = (), statuses: list[int] = (), genres: list[int] = (),
                         year_from: int = 0, year_to: int = 10000, rating_from: int = 0, rating_to: int = 10,
                         page: int = 1):
        return db.session.execute(Select(Title).filter(
                Title.validate_types(types),
                Title.validate_statuses(statuses),
                Title.validate_year(year_from, year_to),
                Title.validate_genres(genres),
                Title.validate_rating(rating_from, rating_to)
            ).limit(20).offset(20 * (page - 1))).scalars().all()

    @staticmethod
    def search(query):
        return db.session.execute(
            Select(Title).filter(func.lower(Title.name_russian).like(f"%{query.lower()}%"))
        ).scalars().all()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def add_view(self):
        self.views += 1
        self.update()

    def add_translator(self, team):
        db.session.execute(insert(titles_translators).values(title_id=self.id, team_id=team.id))
        db.session.commit()

    def check_translator(self, team):
        return db.session.execute(
            Select(exists(titles_translators).where(and_(titles_translators.c.title_id == self.id,
                                                  titles_translators.c.team_id == team.id)))
        ).scalar()

    # ----- Rating -----
    @hybrid_method
    def get_rating(self):
        rating = db.session.execute(Select(ratings.c.rating).where(ratings.c.title_id == self.id)).scalars().all()
        return sum(rating), len(rating)

    @hybrid_method
    def add_rating(self, user, rating):
        db.session.execute(insert(ratings).values(user_id=user.id, title_id=self.id, rating=rating))
        db.session.commit()

    @hybrid_method
    def remove_rating(self, user):
        db.session.execute(delete(ratings).where(and_(ratings.c.user_id == user.id, ratings.c.title_id == self.id)))
        db.session.commit()

    @hybrid_method
    def update_rating(self, user, new_rating):
        db.session.execute(
            update(ratings).where(and_(ratings.c.user_id == user.id, ratings.c.title_id == self.id)).values(
                rating=new_rating))
        db.session.commit()

    @hybrid_method
    def get_user_rating(self, user):
        user_rating = db.session.execute(Select(ratings.c.rating).where(and_(
            ratings.c.user_id == user.id, self.id == ratings.c.title_id))).scalar()
        return user_rating

    def get_chapters(self):
        return self.chapters

    def get_comments(self, page):
        comments = db.session.execute(
            Select(Comment).where(and_(Comment.title_id == self.id, Comment.root_id == None)
                                  ).offset(20 * (page - 1)).limit(20)
        ).scalars()
        return comments

    def get_comments_count(self):
        return db.session.execute(Select(func.count(Comment.id).filter(
            and_(Comment.title_id == self.id, Comment.root_id == None)))).scalar()

    def get_saves_count(self):
        return db.session.execute(Select(func.count(saves.c.title_id).filter(saves.c.title_id == self.id))).scalar()

    def get_poster(self):
        if os.path.exists(f"app/static/media/posters/{self.id}.jpg"):
            return url_for("static", filename=f"media/posters/{self.id}.jpg", _external=True)

    def to_dict(self):
        dct = {
            "id": self.id,
            "type": self.type.to_dict(),
            "status": self.status.to_dict(),
            "name_russian": self.name_russian,
            "name_english": self.name_english,
            "name_languages": self.name_languages,
            "description": self.description,
            "poster": self.get_poster(),
            "year": self.year,
            "genres": [i.to_dict() for i in self.genres],
            "views": self.views,
            "saves": self.get_saves_count(),
        }

        translators = self.translators
        translators_lst = []
        for i in translators:
            translator_dct = i.to_dict()
            translator_dct["chapters"] = [i.to_dict() for i in sorted(i.get_title_chapters(self),
                                                                      key=lambda c: c.tome * 1000 + c.chapter)]
            translators_lst.append(translator_dct)

        dct["translators"] = translators_lst
        return dct


votes = Table(
    "votes",
    db.metadata,
    Column("user_id", Integer(), ForeignKey("users.id")),
    Column("comment_id", Integer(), ForeignKey("comments.id")),
    Column("type", Integer(), )
)


class Comment(db.Model):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(nullable=False, unique=True, autoincrement=True, primary_key=True)
    text: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(nullable=False,
                                           default=lambda: datetime.utcnow())
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="comments")
    title_id: Mapped[int] = mapped_column(ForeignKey("titles.id"), nullable=False)
    title: Mapped["Title"] = relationship(back_populates="comments")
    root_id: Mapped[Optional[int]] = mapped_column(nullable=True)
    parent_id: Mapped[Optional[int]] = mapped_column(nullable=True)

    @staticmethod
    def get_by_id(comment_id):
        return db.session.get(Comment, comment_id)

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def get_up_votes(self):
        return db.session.execute(
            Select(func.count(votes.c.type).filter(and_(votes.c.comment_id == self.id, votes.c.type == 1)))
        ).scalar()

    def get_down_votes(self):
        return db.session.execute(
            Select(func.count(votes.c.type).filter(and_(votes.c.comment_id == self.id, votes.c.type == 0)))
        ).scalar()

    def add_vote(self, user, vote_type):
        db.session.execute(insert(votes).values(comment_id=self.id, user_id=user.id, type=vote_type))
        db.session.commit()

    def remove_vote(self, user):
        db.session.execute(delete(votes).where(and_(votes.c.comment_id == self.id, votes.c.user_id == user.id)))
        db.session.commit()

    def update_vote(self, user, new_vote_type):
        db.session.execute(update(votes).where(
            and_(votes.c.comment_id == self.id, votes.c.user_id == user.id)).values(type=new_vote_type)
                           )
        db.session.commit()

    def get_user_vote(self, user):
        return db.session.execute(
            Select(votes.c.type).where(and_(votes.c.comment_id == self.id, votes.c.user_id == user.id))
        ).scalar()

    def get_answers(self):
        return db.session.execute(Select(Comment).where(Comment.parent_id == self.id)).scalars().all()

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "date": self.date.strftime("%Y-%m-%dT%H:%M:%S"),
            "user": self.user.to_dict(),
            "title_id": self.title_id,
            "root_id": self.root_id,
            "parent_id": self.parent_id,
            "up_votes": self.get_up_votes(),
            "down_votes": self.get_down_votes(),
            "answers_count": len(self.get_answers())
        }


titles_translators = Table(
    "titles_translators",
    db.metadata,
    Column("title_id", Integer(), ForeignKey("titles.id"), nullable=False),
    Column("team_id", Integer(), ForeignKey("teams.id"), nullable=False)
)


class Team(db.Model):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    about: Mapped[str] = mapped_column(nullable=True)
    leader_id: Mapped[int] = mapped_column(nullable=False)
    vk_link: Mapped[str] = mapped_column(nullable=True)
    discord_link: Mapped[str] = mapped_column(nullable=True)
    telegram_link: Mapped[str] = mapped_column(nullable=True)
    members: Mapped[list["User"]] = relationship(uselist=True, back_populates="team",
                                                 primaryjoin="Team.id == User.team_id")
    translations: Mapped[list["Title"]] = relationship(uselist=True, secondary="titles_translators")
    chapters: Mapped[list["Chapter"]]= relationship(uselist=True, back_populates="team")
    titles: Mapped[list["Title"]] = relationship(secondary="titles_translators", uselist=True, back_populates="translators")

    @staticmethod
    def get_by_id(team_id):
        return db.session.get(Team, team_id)

    @staticmethod
    def search(query):
        return db.session.execute(Select(Team).filter(func.lower(Team.name).like(f"%{query.lower()}%"))).scalars().all()

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def delete(self):
        db.session.execute(delete(titles_translators).where(titles_translators.c.title_id==self.id))
        for member in self.members:
            member.remove_team()
        for chapter in self.chapters:
            chapter.delete()

        db.session.delete(self)
        db.session.commit()

    def get_poster(self):
        if os.path.exists(f"app/static/media/teams/{self.id}.jpg"):
            return url_for("static", filename=f"media/teams/{self.id}.jpg", _external=True)

    def get_title_chapters(self, title):
        return db.session.execute(
            Select(Chapter).where(and_(Chapter.team_id == self.id, Chapter.title_id == title.id))
        ).scalars()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "about": self.about,
            "vk_link": self.vk_link,
            "discord_link": self.discord_link,
            "telegram_link": self.telegram_link,
            "leader": User.get_by_id(self.leader_id).to_dict(),
            "poster": self.get_poster()
        }
