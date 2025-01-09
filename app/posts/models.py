from app import db
from app.comments.models import Comment
from sqlalchemy import *
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from flask_login import current_user


users_posts = Table(
    "users_posts",
    db.metadata,
    Column("user_id", Integer(), ForeignKey("users.id")),
    Column("post_id", Integer(), ForeignKey("posts.id"))
)

teams_posts = Table(
    "teams_posts",
    db.metadata,
    Column("user_id", Integer(), ForeignKey("teams.id")),
    Column("post_id", Integer(), ForeignKey("posts.id"))
)

posts_votes = Table(
    "posts_votes",
    db.metadata,
    Column("user_id", Integer(), ForeignKey("users.id")),
    Column("post_id", Integer(), ForeignKey("posts.id")),
    Column("type", Integer())
)


class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    author: Mapped["User"] = relationship()
    text: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(nullable=False, default=lambda x: datetime.utcnow())

    def __repr__(self):
        return f"Post[id={self.id}, author_id={self.author_id}, text={self.text}, date={self.date}]"

    @hybrid_property
    def up_votes(self):
        return db.session.execute(
            Select(func.count(posts_votes.c.type).filter(and_(posts_votes.c.post_id == self.id,
                                                              posts_votes.c.type == 1)))
        ).scalar()

    @hybrid_property
    def down_votes(self):
        return db.session.execute(
            Select(func.count(posts_votes.c.type).filter(and_(posts_votes.c.post_id == self.id, posts_votes.c.type == 0)))
        ).scalar()

    @staticmethod
    def get(post_id):
        return db.session.get(Post, post_id)

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def remove(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "author": self.author.to_dict(),
            "text": self.text,
            "date": self.date.strftime("%Y-%m-%dT%H:%M:%S"),
            "up_votes": self.up_votes,
            "down_votes": self.down_votes,
            "user_vote": self.get_vote(current_user)
        }

    def add_for_team(self, team):
        self.add()
        db.session.execute(insert(teams_posts).values(team_id=team.id, post_id=self.id))
        db.session.commit()

    def add_for_user(self, user):
        self.add()
        db.session.execute(insert(users_posts).values(user_id=user.id, post_id=self.id))
        db.session.commit()

    @staticmethod
    def get_user_posts(user, page=1):
        return db.session.execute(select(Post)
            .join(users_posts, users_posts.c.post_id == Post.id)
            .filter(users_posts.c.user_id==user.id).order_by(desc(Post.date))
            .limit(20).offset(20 * (page-1))).scalars().all()

    def add_vote(self, user, vote_type):
        db.session.execute(insert(posts_votes).values(post_id=self.id, user_id=user.id, type=vote_type))
        db.session.commit()

    def remove_vote(self, user):
        db.session.execute(delete(posts_votes).where(and_(posts_votes.c.post_id == self.id,
                                                          posts_votes.c.user_id == user.id)))
        db.session.commit()

    def update_vote(self, user, type):
        db.session.execute(update(posts_votes).where(
            and_(posts_votes.c.post_id == self.id, posts_votes.c.user_id == user.id)).values(type=type))
        db.session.commit()

    def get_vote(self, user):
        return db.session.execute(
            Select(posts_votes.c.type).where(and_(posts_votes.c.post_id == self.id, posts_votes.c.user_id == user.id))
        ).scalar()
