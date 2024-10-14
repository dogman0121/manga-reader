"""empty message

Revision ID: 50927695990e
Revises: e44803e1f613
Create Date: 2024-10-15 00:43:47.554272

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '50927695990e'
down_revision = 'e44803e1f613'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.alter_column('root_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('parent_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('titles', schema=None) as batch_op:
        batch_op.alter_column('type_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('status_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('name_english',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.alter_column('name_languages',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.alter_column('description',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.alter_column('year',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('author_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(),
               nullable=True)

    with op.batch_alter_table('titles', schema=None) as batch_op:
        batch_op.alter_column('author_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('year',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('description',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('name_languages',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('name_english',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('status_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('type_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.alter_column('parent_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('root_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
