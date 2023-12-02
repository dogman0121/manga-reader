import json

class Title:
    def from_list_to_object(self, data):
        self.id = data[0]
        self.type = data[1]
        self.status = data[2]
        self.year = data[3]
        self.name_russian = data[4]
        self.name_translation = json.loads(data[5])
        self.poster_url = data[6]
        self.description = data[7]
        self.rating = data[8]
        self.views = data[9]
        self.saved = data[10]
        self.genres = data[11]
        self.author = data[12]
        self.artist = data[13]
        self.publisher = data[14]
        self.translator = data[15]

    def from_dict_to_object(self, number, poster_url, dct):
        self.id = number
        self.type = dct['manga_type']
        self.status = dct['manga_status']
        self.year = dct['year']
        self.name_russian = dct['name_russian']
        self.name_translation = [dct['name_english'], dct['name_original']]
        self.poster_url = poster_url
        self.description = dct['description']
        self.rating = None
        self.views = None
        self.saved = None
        self.genres = dct['genres']
        self.author = dct['authors']
        self.artist = dct['artists']
        self.publisher = dct['publishers']
        self.translator = dct['translators']