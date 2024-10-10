FROM python:3.10-bullseye

RUN mkdir -p /flask-app/
WORKDIR /flask-app/

COPY . /flask-app/

RUN pip install --no-cache-dir -r requirements.txt

RUN flask db init
RUN flask db migrate
RUN flask dn upgrade

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "manage:app"]
