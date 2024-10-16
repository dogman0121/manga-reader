from app import db
from app.models import User, Title, Comment, Team, Genre, Status, Type
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


admin = Admin()


class UserAdmin(ModelView):
    column_list = ('id', 'login', 'email', 'password', 'role', 'team_id')


class CommentAdmin(ModelView):
    column_list = ('id', 'text', 'date', 'user_id', 'title_id', 'root_id', 'parent_id')


admin.add_view(UserAdmin(User, db.session, endpoint="users"))
admin.add_view(ModelView(Title, db.session, endpoint="titles"))
admin.add_view(CommentAdmin(Comment, db.session, endpoint="comments"))
admin.add_view(ModelView(Team, db.session, endpoint="teams"))
admin.add_view(ModelView(Genre, db.session, endpoint="genres"))
admin.add_view(ModelView(Status, db.session, endpoint="statuses"))
admin.add_view(ModelView(Type, db.session, endpoint="types"))
