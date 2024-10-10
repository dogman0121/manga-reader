"""empty message

Revision ID: 461946ca2095
Revises: 
Create Date: 2024-10-10 21:27:58.987801

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '461946ca2095'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('_alembic_tmp_chapters')
    with op.batch_alter_table('chapters', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.alter_column('tome',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('chapter',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('date',
               existing_type=sa.TEXT(),
               type_=sa.DateTime(),
               nullable=False)

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=False,
               autoincrement=True)
        batch_op.alter_column('text',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('date',
               existing_type=sa.TEXT(),
               type_=sa.DateTime(),
               existing_nullable=False)
        batch_op.alter_column('root_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('parent_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.create_unique_constraint(None, ['id'])
        batch_op.create_foreign_key(None, 'titles', ['title_id'], ['id'])
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'])

    with op.batch_alter_table('genres', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)

    with op.batch_alter_table('ratings', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('title_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('rating',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.create_foreign_key(None, 'titles', ['title_id'], ['id'])
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'])

    with op.batch_alter_table('saves', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('title_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.create_foreign_key(None, 'titles', ['title_id'], ['id'])
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'])

    with op.batch_alter_table('statuses', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=False,
               autoincrement=True)
        batch_op.alter_column('name',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.create_unique_constraint(None, ['id'])
        batch_op.create_unique_constraint(None, ['name'])

    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('about',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.alter_column('vk_link',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.alter_column('discord_link',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.alter_column('telegram_link',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.create_foreign_key(None, 'users', ['leader_id'], ['id'])

    with op.batch_alter_table('titles', schema=None) as batch_op:
        batch_op.alter_column('name_russian',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('name_english',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.alter_column('name_languages',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('description',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.alter_column('views',
               existing_type=sa.INTEGER(),
               nullable=False,
               existing_server_default=sa.text('0'))
        batch_op.create_foreign_key(None, 'statuses', ['status_id'], ['id'])
        batch_op.create_foreign_key(None, 'users', ['author_id'], ['id'])
        batch_op.create_foreign_key(None, 'types', ['type_id'], ['id'])

    with op.batch_alter_table('titles_genres', schema=None) as batch_op:
        batch_op.create_foreign_key(None, 'genres', ['genre_id'], ['id'])
        batch_op.create_foreign_key(None, 'titles', ['title_id'], ['id'])

    with op.batch_alter_table('titles_translators', schema=None) as batch_op:
        batch_op.alter_column('title_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('team_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('types', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=False,
               autoincrement=True)
        batch_op.alter_column('name',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=False)
        batch_op.create_unique_constraint(None, ['id'])
        batch_op.create_unique_constraint(None, ['name'])

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=False,
               autoincrement=True)
        batch_op.alter_column('login',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               nullable=True)
        batch_op.alter_column('password',
               existing_type=sa.TEXT(),
               type_=sa.String(),
               existing_nullable=False)
        batch_op.alter_column('team_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.create_unique_constraint(None, ['id'])
        batch_op.create_unique_constraint(None, ['email'])
        batch_op.create_unique_constraint(None, ['login'])
        batch_op.create_foreign_key(None, 'teams', ['team_id'], ['id'])

    with op.batch_alter_table('votes', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('comment_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('type',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('votes', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('type',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('comment_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.alter_column('team_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('password',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=False)
        batch_op.alter_column('login',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=True,
               autoincrement=True)

    with op.batch_alter_table('types', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.alter_column('name',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=True,
               autoincrement=True)

    with op.batch_alter_table('titles_translators', schema=None) as batch_op:
        batch_op.alter_column('team_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('title_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('titles_genres', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')

    with op.batch_alter_table('titles', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('views',
               existing_type=sa.INTEGER(),
               nullable=True,
               existing_server_default=sa.text('0'))
        batch_op.alter_column('description',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('name_languages',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('name_english',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('name_russian',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)

    with op.batch_alter_table('teams', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('telegram_link',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('discord_link',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('vk_link',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('about',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('name',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)

    with op.batch_alter_table('statuses', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.alter_column('name',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=True,
               autoincrement=True)

    with op.batch_alter_table('saves', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('title_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('ratings', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('rating',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('title_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('genres', schema=None) as batch_op:
        batch_op.alter_column('name',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='unique')
        batch_op.alter_column('parent_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('root_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('date',
               existing_type=sa.DateTime(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('text',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               existing_nullable=False)
        batch_op.alter_column('id',
               existing_type=sa.INTEGER(),
               nullable=True,
               autoincrement=True)

    with op.batch_alter_table('chapters', schema=None) as batch_op:
        batch_op.alter_column('date',
               existing_type=sa.DateTime(),
               type_=sa.TEXT(),
               nullable=True)
        batch_op.alter_column('chapter',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('tome',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('name',
               existing_type=sa.String(),
               type_=sa.TEXT(),
               nullable=True)

    op.create_table('_alembic_tmp_chapters',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.VARCHAR(), nullable=False),
    sa.Column('title_id', sa.INTEGER(), nullable=False),
    sa.Column('tome', sa.INTEGER(), nullable=False),
    sa.Column('chapter', sa.INTEGER(), nullable=False),
    sa.Column('date', sa.DATETIME(), nullable=False),
    sa.ForeignKeyConstraint(['title_id'], ['titles.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id')
    )
    # ### end Alembic commands ###
