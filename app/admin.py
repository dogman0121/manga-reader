from app import db
from app.models import User, Title, Team
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


admin = Admin()


admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Title, db.session))
admin.add_view(ModelView(Team, db.session))
