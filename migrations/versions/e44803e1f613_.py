"""empty message

Revision ID: e44803e1f613
Revises: 81d13fecd1b6
Create Date: 2024-10-12 11:44:56.548287

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e44803e1f613'
down_revision = '81d13fecd1b6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.alter_column('about',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.alter_column('vk_link',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.alter_column('discord_link',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.alter_column('telegram_link',
               existing_type=sa.VARCHAR(),
               nullable=True)
        batch_op.drop_constraint('teams_leader_id_fkey', type_='foreignkey')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.create_foreign_key('teams_leader_id_fkey', 'users', ['leader_id'], ['id'])
        batch_op.alter_column('telegram_link',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('discord_link',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('vk_link',
               existing_type=sa.VARCHAR(),
               nullable=False)
        batch_op.alter_column('about',
               existing_type=sa.VARCHAR(),
               nullable=False)

    # ### end Alembic commands ###