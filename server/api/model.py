from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired
from .app import db, secret_key


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text)
    login = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)

    flights = db.relation('Flight', lazy='select', backref=db.backref('user'))
    drones = db.relation('Drone', lazy='select', backref=db.backref('user'))
    areas = db.relation('Area', lazy='select', backref=db.backref('user'))

    def generate_auth_token(self, expiration=604800):  # 604 800 - one week
        s = Serializer(secret_key, expires_in=expiration)
        auth_token = s.dumps({'id': self.id, "login": self.login})
        return auth_token.decode("utf-8")

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(secret_key)
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None
        except BadSignature:
            return None
        return User.query.filter(User.login == data['login'], User.id == data['id']).first()


class Area(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    crops_type = db.Column(db.Text, nullable=True)
    square = db.Column(db.Float)  # in square meters

    flights = db.relationship('Flight', backref='area', lazy=True, cascade='all')
    points = db.relationship('RectanglePoint', backref='area', lazy=True, cascade='all')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Drone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Integer)
    name = db.Column(db.Text)
    synced = db.Column(db.Boolean, default=False)
    last_synced = db.Column(db.DateTime, default=None)

    flights = db.relationship('Flight', backref='drone', lazy=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    model_id = db.Column(db.Integer, db.ForeignKey('model.id'), nullable=False)


class Model(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    drones = db.relation('Drone', lazy='select', backref=db.backref('model'))


class FlightEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # active = db.Column(db.Boolean)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    resources_spent = db.Column(db.Integer)
    resources_loaded = db.Column(db.Integer)
    # resources_name = db.Column(db.String)
    # measurement_unit = db.Column(db.Text)
    successful = db.Column(db.Boolean, default=True)

    # status_id = db.Column(db.Integer, db.ForeignKey("status.id"), nullable=False)
    flight_id = db.Column(db.Integer, db.ForeignKey("flight.id"), nullable=False)


class Flight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    begin_at = db.Column(db.Time)
    day_interval = db.Column(db.Integer)
    active = db.Column(db.Boolean, default=True)

    drone_id = db.Column(db.Integer, db.ForeignKey('drone.id'), nullable=False)
    area_id = db.Column(db.Integer, db.ForeignKey('area.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    flight_events = db.relationship('FlightEvent', backref='flight', lazy=True)


class Status(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    description = db.Column(db.Text)
    is_successful = db.Column(db.Boolean, default=True)

    # flight_events = db.relationship('FlightEvent', backref='status', lazy=True)


class RectanglePoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column('latitude', db.Float)
    longitude = db.Column('longitude', db.Float)

    area_id = db.Column(db.Integer, db.ForeignKey('area.id'), nullable=False)
