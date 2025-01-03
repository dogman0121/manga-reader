"""empty message

Revision ID: 619788e4fee4
Revises: d2aeba9bca87
Create Date: 2024-11-24 01:26:57.239421

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '619788e4fee4'
down_revision = 'd2aeba9bca87'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('users_login_key', type_='unique')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_unique_constraint('users_login_key', ['login'])

    # ### end Alembic commands ###
