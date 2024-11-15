"""empty message

Revision ID: b2d6bb346697
Revises: a621712a883f
Create Date: 2024-11-15 22:37:44.027219

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2d6bb346697'
down_revision = 'a621712a883f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chapters', schema=None) as batch_op:
        batch_op.add_column(sa.Column('team_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'teams', ['team_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chapters', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('team_id')

    # ### end Alembic commands ###
