FROM python:3.10-bullseye

RUN mkdir -p /flask-app/
WORKDIR /flask-app/

COPY . /flask-app/

RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=manage.py

RUN flask db upgrade

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "manage:app"]
