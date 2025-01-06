from app import db
from sqlalchemy import *
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime


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


class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False, autoincrement=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    author: Mapped["User"] = relationship()
    text: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(nullable=False, default=lambda x: datetime.utcnow())

    def __repr__(self):
        return f"Post[id={self.id}, author_id={self.author_id}, text={self.text}, date={self.date}]"

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
            "date": self.date.strftime("%Y-%m-%dT%H:%M:%S")
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