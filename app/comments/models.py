from app import db
from sqlalchemy import *
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from typing import Optional
from datetime import datetime

comment_votes = Table(
    "comment_votes",
    db.metadata,
    Column("user_id", Integer(), ForeignKey("users.id")),
    Column("comment_id", Integer(), ForeignKey("comments.id", ondelete="CASCADE")),
    Column("type", Integer()),
)

titles_comments = Table(
    "titles_comments",
    db.metadata,
    Column("title_id", Integer(), ForeignKey("titles.id")),
    Column("comment_id", Integer(), ForeignKey("comments.id"))
)

posts_comments = Table(
    "posts_comments",
    db.metadata,
    Column("post_id", Integer(), ForeignKey("posts.id")),
    Column("comment_id", Integer(), ForeignKey("comments.id"))
)


class Comment(db.Model):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, unique=True, autoincrement=True)
    text: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(nullable=False,
                                           default=lambda: datetime.utcnow())
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship()
    root_id: Mapped[Optional[int]] = mapped_column(nullable=True)
    parent_id: Mapped[Optional[int]] = mapped_column(nullable=True)

    @hybrid_property
    def up_votes(self):
        return db.session.execute(
            Select(func.count(comment_votes.c.type).filter(and_(comment_votes.c.comment_id == self.id, comment_votes.c.type == 1)))
        ).scalar()

    @hybrid_property
    def down_votes(self):
        return db.session.execute(
            Select(func.count(comment_votes.c.type).filter(and_(comment_votes.c.comment_id == self.id, comment_votes.c.type == 0)))
        ).scalar()

    @staticmethod
    def get(comment_id):
        return db.session.get(Comment, comment_id)

    def add(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        self.verified = True
        db.session.commit()

    def remove(self):
        db.session.delete(self)
        db.session.commit()

    def add_vote(self, user, vote_type):
        db.session.execute(insert(comment_votes).values(comment_id=self.id, user_id=user.id, type=vote_type))
        db.session.commit()

    def remove_vote(self, user):
        db.session.execute(delete(comment_votes).where(and_(comment_votes.c.comment_id == self.id, comment_votes.c.user_id == user.id)))
        db.session.commit()

    def update_vote(self, user, new_vote_type):
        db.session.execute(update(comment_votes).where(
            and_(comment_votes.c.comment_id == self.id, comment_votes.c.user_id == user.id)).values(type=new_vote_type)
                           )
        db.session.commit()

    def get_vote(self, user):
        return db.session.execute(
            Select(comment_votes.c.type).where(and_(comment_votes.c.comment_id == self.id, comment_votes.c.user_id == user.id))
        ).scalar()

    def get_answers(self):
        return db.session.execute(Select(Comment).where(Comment.parent_id == self.id)).scalars().all()

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "date": self.date.strftime("%Y-%m-%dT%H:%M:%S"),
            "user": self.user.to_dict(),
            "root_id": self.root_id,
            "parent_id": self.parent_id,
            "up_votes": self.up_votes,
            "down_votes": self.down_votes,
            "answers_count": len(self.get_answers()),
            "user_vote": self.get_vote(self.user)
        }

    def add_for_title(self, title):
        self.add()
        db.session.execute(insert(titles_comments).values(title_id=title.id, comment_id=self.id))
        db.session.commit()

    def add_for_post(self, post):
        self.add()
        db.session.execute(insert(posts_comments).values(post_id=post.id, comment_id=self.id))
        db.session.commit()

    @staticmethod
    def get_post_comments(post, page):
        return db.session.execute(Select(Comment)
            .join(posts_comments, posts_comments.c.comment_id == Comment.id)
            .filter(posts_comments.c.post_id == post.id)
            .limit(20).offset(20 * (page - 1))).scalars().all()

    @staticmethod
    def get_title_comments(title, page):
        return db.session.execute(Select(Comment)
            .join(titles_comments, titles_comments.c.comment_id == Comment.id)
            .filter(titles_comments.c.title_id == title.id)
            .limit(20).offset(20 * (page - 1))).scalars().all()