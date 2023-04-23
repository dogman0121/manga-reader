from flask import Flask, render_template, url_for, request
from database import Database

app = Flask(__name__)
db = Database()

@app.route('/manga/<int:title_id>')
def index(title_id):
    db.add_views(title_id)
    title = db.get_manga_data(title_id)
    if title != None:
        return render_template('manga-card.html', title = title)
    return '404'


if '__main__' == __name__:
    app.run()