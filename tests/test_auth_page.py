from app.models import User


def test_register_user(app, client):
    with app.app_context():
        response = client.post("/auth",
                               query_string={"section": "register"},
                               data={
                                   "login": "aboba",
                                   "email": "v@mail.ru",
                                   "password": "12345678"
                               },
                               follow_redirects=True
                               )
        assert User.get_by_login("aboba") is not None
        assert response.status_code == 200

