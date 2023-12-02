from flask import Flask, render_template, request, redirect, url_for
from PIL import Image
from database import Database
from forms import MangaForm
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = '?MJritXZS5dm06L6EyfmzQP'
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.gif']
db = Database()

@app.route('/manga/<int:title_id>')
def index(title_id):
    db.add_views(title_id)
    manga = db.get_manga_data(title_id)
    chapters = db.get_chapters_by_title(title_id)

    if manga is None:
        return '404'
    return render_template('manga-card.html', title=manga, chapters=chapters)


@app.route('/add_manga', methods=['GET', 'POST'])
def manga_form():
    form = MangaForm()
    if form.validate_on_submit():
        print(form.data)
        return '1'
    return render_template('add-manga.html', form=form, genres=db.get_genres())


@app.route('/chapters')
def manga_reader():
    chapter_id, title_id, tome, chapter = db.get_chapter_by_id(request.args.get('chapter_id'))
    title_type = db.get_type_by_id(title_id)
    if title_type[0] == 'Манга':
        return render_template('chapter_manga.html',
                               images=os.listdir(f'static\\media\\chapters\\{chapter_id}'),
                               chapter_id=chapter_id)
    else:
        return render_template('chapter_manhwa.html',
                               images=os.listdir(f'static\\media\\chapters\\{chapter_id}'),
                               chapter_id=chapter_id)

if '__main__' == __name__:
    app.run()