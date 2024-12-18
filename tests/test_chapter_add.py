from app.models import Team, Title, User, Chapter


def test_adding_translator(app):
    with app.app_context():
        user = User(login="qwerty", email="v@mail.ru")
        user.set_password("123456")
        user.add()

        title = Title(name_russian="qwerty")
        title.add()

        team1 = Team(name="qwerty1", leader_id=user.id)
        team1.add()

        team2 = Team(name="qwerty2", leader_id=user.id)
        team2.add()

        team3 = Team(name="qwerty3", leader_id=user.id)
        team3.add()

        assert title.check_translator(team1) == False
        assert title.check_translator(team2) == False
        assert title.check_translator(team3) == False

        title.add_translator(team1)
        title.add_translator(team2)
        title.add_translator(team3)

        assert title.translators == [team1, team2, team3]


def test_delete_translator(app):
    with app.app_context():
        user = User(login="qwerty", email="v@mail.ru")
        user.set_password("123456")
        user.add()
        title = Title(name_russian="qwerty")
        title.add()
        team = Team(name="qwerty", leader_id=user.id)
        team.add()
        chapter = Chapter(tome=1, chapter=1, title_id=title.id, team_id=team.id)
        chapter.add()

        title.add_translator(team)

        assert title.check_translator(team) == True

        team.remove()

        assert Team.get(team.id) == None
        assert title.check_translator(team) == False
