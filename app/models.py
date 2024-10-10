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
    email: Mapped[str] = mapped_column(nullable=True, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    role: Mapped[int] = mapped_column(default=1, nullable=False)
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("teams.id"), nullable=True)
    team: Mapped["Team"] = relationship(uselist=False, back_populates="members", primaryjoin="User.team_id == Team.id")
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

    @staticmethod
    def is_login_taken(login):
        return db.session.execute(Select(exists().where(User.login == login))).scalar()

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

    def change_password(self, password):
        self.set_password(password)
        self.update()

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def set_login(self, login):
        self.login = login

    def set_email(self, email):
        self.email = email

    def add_team(self, team_id):
        pass

    def remove_team(self):
        self.team_id = None
        self.update()

    def is_team_leader(self):
        if self.team_id:
            return self.id == self.team.leader_id
        return False

    def get_avatar(self):
        if os.path.exists(f"app/static/media/avatars/{self.id}.png"):
            return url_for("static", filename=f"media/avatars/{self.id}.png")
        else:
            return url_for("static", filename=f"media/avatars/default.png")

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
            "name": self.name,
            "title_id": self.title_id,
            "tome": self.tome,
            "chapter": self.chapter,
            "date": self.date
        }


class Title(db.Model):
    __tablename__ = "titles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, nullable=False, unique=True)
    type_id: Mapped[int] = mapped_column(ForeignKey("types.id"))
    type: Mapped["Type"] = relationship()
    status_id: Mapped[int] = mapped_column(ForeignKey("statuses.id"))
    status: Mapped["Status"] = relationship()
    name_russian: Mapped[str] = mapped_column(nullable=False)
    name_english: Mapped[str]
    name_languages: Mapped[str]
    description: Mapped[str]
    year: Mapped[int]
    views: Mapped[int] = mapped_column(default=0)
    genres: Mapped[list["Genre"]] = relationship(secondary="titles_genres")
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped[User] = relationship("User")
    chapters: Mapped[list["Chapter"]] = relationship(uselist=True, back_populates="title")
    comments: Mapped[list["Comment"]] = relationship(uselist=True, back_populates="title")

    @staticmethod
    def get_by_id(title_id):
        print(title_id)
        return db.session.get(Title, title_id)

    @hybrid_method
    def validate_types(self, types: list[Type]):
        if not types:
            return True

        return self.type in types

    @hybrid_method
    def validate_statuses(self, statuses: list[Status]):
        if not statuses:
            return True

        return self.status in statuses

    @hybrid_method
    def validate_genres(self, genres: list[Genre]):
        if not genres:
            return True
        return all(genre in self.genres for genre in genres)

    @hybrid_method
    def validate_year(self, year_from: int, year_to: int):
        return and_(year_from <= self.year, self.year <= year_to)

    @staticmethod
    def get_with_filters(types: list[Type] = (), statuses: list[Status] = (), genres: list[Genre] = (),
                         year_from: int = 0, year_to: int = 10000, rating_from: int = 0, rating_to: int = 10,
                         page: int = 1):
        return db.session.execute(Select(Title).filter(
            and_(
                Title.validate_types(types),
                Title.validate_statuses(statuses),
                Title.validate_genres(genres),
                Title.validate_year(year_from, year_to)
            )
        ).limit(20).offset(20 * (page-1))).scalars().all()

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

    def add_rating(self, user, rating):
        db.session.execute(insert(ratings).values(user_id=user.id, title_id=self.id, rating=rating))
        db.session.remove()

    def remove_rating(self, user):
        db.session.execute(delete(ratings).where(and_(ratings.c.user_id == user.id, ratings.c.title_id == self.id)))
        db.session.commit()

    def update_rating(self, user, new_rating):
        db.session.execute(update(ratings).where(and_(ratings.c.user_id == user.id, ratings.c.title_id == self.id)).values(rating=new_rating))
        db.session.commit()

    def get_rating(self):
        rating = db.session.execute(Select(ratings.c.rating).where(ratings.c.title_id == self.id)).scalars().all()
        return sum(rating), len(rating)

    def get_user_rating(self, user):
        user_rating = db.session.execute(Select(ratings.c.rating).where(and_(
            ratings.c.user_id == user.id, self.id == ratings.c.title_id))).scalar()
        return user_rating

    def get_chapters(self):
        return self.chapters

    def get_comments(self, page):
        return self.comments

    def is_saved_by_user(self, user):
        saved = db.session.execute(Select(
            exists().where(user.id == saves.c.user_id and self.id == saves.c.titles_id))).scalar()
        return saved

    def get_saves_count(self):
        return db.session.execute(func.count(Select(saves.c.title_id).where(saves.c.title_id == self.id))).fetchone()[0]

    def get_poster(self):
        if os.path.exists(f"app/static/media/posters/{self.id}.jpg"):
            return url_for("static", filename=f"media/posters/{self.id}.jpg")

    def to_dict(self):
        return {
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
            "saves": self.get_saves_count()

        }


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
    root_id: Mapped[int]
    parent_id: Mapped[int]

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
            func.count(Select(votes.c.type).where(and_(votes.c.comment_id == self.id, votes.c.type == 1)))
        ).fetchone()[0]

    def get_down_votes(self):
        return db.session.execute(
            func.count(Select(votes.c.type).where(and_(votes.c.comment_id == self.id, votes.c.type == 0)))
        ).fetchone()[0]

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
        return db.session.execute(Select(Comment).where(Comment.root_id == self.id)).scalars().all()

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
    name: Mapped[str] = mapped_column()
    about: Mapped[str] = mapped_column()
    leader_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    leader: Mapped[User] = relationship(primaryjoin="Team.leader_id == User.id")
    vk_link: Mapped[str] = mapped_column()
    discord_link: Mapped[str] = mapped_column()
    telegram_link: Mapped[str] = mapped_column()
    members: Mapped[list["User"]] = relationship(uselist=True, back_populates="team",
                                                 primaryjoin="Team.id == User.team_id")
    translations: Mapped[list["Title"]] = relationship(uselist=True, secondary="titles_translators")

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
        db.session.delete(self)
        db.session.commit()

    def get_poster(self):
        if os.path.exists(f"app/static/media/teams/{self.id}.jpg"):
            return url_for("static", filename=f"media/teams/{self.id}.jpg")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "about": self.about,
            "vk_link": self.vk_link,
            "discord_link": self.discord_link,
            "telegram_link": self.telegram_link,
            "leader": self.leader.to_dict(),
            "poster": self.get_poster()
        }
