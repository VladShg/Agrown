from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

secret_key = 's\xbc\x85\xb6\xcd1\xf4\x98Fp\xc1\xd7y#\xc9k\xdaZ\x98\xf0'

app = Flask(__name__)
CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost/agrown'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secret_key
db = SQLAlchemy(app)

from api.views.main import main
from api.views.auth import auth

from api.views.drones import drones
from api.views.flights import flights
from api.views.areas import areas

app.register_blueprint(main, url_prefix='/api')
app.register_blueprint(auth, url_prefix='/api')
app.register_blueprint(drones, url_prefix='/api')
app.register_blueprint(areas, url_prefix='/api')
app.register_blueprint(flights, url_prefix='/api')

if __name__ == '__main__':
    app.run()
