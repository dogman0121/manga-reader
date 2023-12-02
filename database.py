import sqlite3
import json

class Database:
    def __init__(self):
        self.connection = sqlite3.connect('database.db', check_same_thread=False)
        self.cursor = self.connection.cursor()

    def get_manga_data(self, id):
        data = self.cursor.execute(""" SELECT * FROM titles WHERE id=? """, (id,)).fetchone()
        manga_info = dict()
        manga_info['id'] = str(data[0])
        manga_info['type'] = data[1]
        manga_info['status'] = data[2]
        manga_info['year'] = data[3]
        manga_info['name_russian'] = data[4]
        manga_info['name_english'] = data[5]
        manga_info['name_original'] = data[6]
        manga_info['description'] = data[7]
        manga_info['rating'] = data[8]
        manga_info['views'] = data[9]
        manga_info['saved'] = data[10]
        manga_info['genres'] = json.loads(data[11])
        manga_info['authors'] = json.loads(data[12])
        manga_info['artist'] = json.loads(data[13])
        manga_info['publisher'] = json.loads(data[14])
        manga_info['translator'] = json.loads(data[15])
        return manga_info

    def add_manga_data(self, data):
        with open('number.txt', 'r') as file:
            title_id = int(file.read())
        with open('number.txt', 'w') as file:
            file.write(str(title_id+1))

        self.cursor.execute(
            """ INSERT INTO titles (type, status, year, name_russian, name_english, name_original, description, genres, 
            author, artist, publisher, translator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (title_id, data.type.data, data.status.data, data.status.year, data.name_russian.data,
             data.name_endlish.data, data.name_original.data, data.description.data, json.loads(data.genres.data),
             json.loads(data.author.data), json.loads(data.artist.data), json.loads(data.publisher.data),
             json.loads(data.translator.data,))
        )
        self.connection.commit()

    def get_chapters_by_title(self, title_id):
        return self.cursor.execute(""" SELECT id, title_id, tome, chapter FROM chapters WHERE title_id=? """, (title_id,)).fetchall()

    def get_chapter_by_id(self, chapter_id):
        return self.cursor.execute(""" SELECT id, title_id, tome, chapter FROM chapters WHERE id=? """, (chapter_id,)).fetchone()

    def get_type_by_id(self, title_id):
        return self.cursor.execute(""" SELECT type FROM titles WHERE id=? """, (title_id,)).fetchone()

    def add_views(self, id):
        self.cursor.execute(""" UPDATE titles SET views=views+1 WHERE id=?""", (id,))
        self.connection.commit()

    def get_genres(self):
        return self.cursor.execute(""" SELECT * from genres """).fetchall()

