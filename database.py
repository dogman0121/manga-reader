import sqlite3


class Title:
    def __init__(self, data):
        self.id = data[0]
        self.type = data[1]
        self.status = data[2]
        self.year = data[3]
        self.name_russian = data[4]
        self.name_translation = data[5]
        self.poster_url = data[6]
        self.description = data[7]
        self.rating = data[8]
        self.views = f'{round(data[9]/1e6, 2)}М' if data[9] >= 1e6 else f'{round(data[9]/1e3, 2)}K' if data[9] >= 1e3 else data[9]
        self.saved = f'{round(data[10]/1e6, 2)}М' if data[10] >= 1e6 else f'{round(data[10]/1e3, 2)}K' if data[10] >= 1e3 else data[10]
        self.genres = data[11]
        self.author = data[12]
        self.artist = data[13]
        self.publisher = data[14]
        self.translator = data[15]

class Database:
    def __init__(self):
        self.connection = sqlite3.connect('database.db', check_same_thread=False)
        self.cursor = self.connection.cursor()

    def get_manga_data(self, id):
        data = self.cursor.execute(""" SELECT * FROM titles WHERE id=? """, (id,)).fetchone()
        if data is None: return None
        return Title(data)

    def add_views(self, id):
        self.cursor.execute(""" UPDATE titles SET views=views+1 WHERE id=?""", (id,))
        self.connection.commit()
