from flask import request, jsonify, Blueprint
from api.model import User, Flight, Area, Drone, FlightEvent
from api.views.auth import is_logged
from api.app import db
from datetime import time
import datetime


flights = Blueprint('flights', __name__)


@flights.route('/delete_flight', methods=['POST', 'DELETE'])
@is_logged
def delete_flight():
    json = request.get_json()
    user = User.verify_auth_token(json['token'])
    flight = Flight.query.filter(Flight.id == int(json['id']), Flight.user_id == user.id).first()
    if not flight:
        return jsonify({'status': "error", "error": 'flight not found'}), 400
    db.session.delete(flight)
    db.session.commit()
    return jsonify({'status': "deleted"}), 200


@flights.route('/update_flight', methods=['POST', 'PUT'])
@is_logged
def update_flight():
    json = request.get_json()
    name = json['name']
    area_id = int(json['area_id'])
    drone_id = int(json['drone_id'])
    active = bool(json['active'])
    interval = int(json['interval'])
    time_obj = time()
    try:
        flight_time = json['time'].split(':')
        time_obj = time(hour=int(flight_time[0]), minute=int(flight_time[1]), second=0)
    except:
        return jsonify({'status': 'error', 'error': 'wrong time format'}), 400

    user = User.verify_auth_token(json['token'])
    flight = Flight.query.filter(Flight.user_id == user.id, Flight.id == int(json['id'])).first()
    if not flight:
        return jsonify({'status': 'error', 'error': 'flight not found'}), 400
    area = Area.query.filter(Area.id == area_id, Area.user_id == user.id).first()
    if not area:
        return jsonify({'status': 'error', 'error': 'area not found'})
    drone = Drone.query.filter(Drone.id == drone_id, Drone.user_id == user.id).first()
    if not drone:
        return jsonify({'status': 'error', 'error': 'drone not found'})

    flight.name = name
    flight.area_id = area.id
    flight.drone_id = drone.id
    flight.begin_at = time_obj
    flight.day_interval = interval
    flight.active = active
    db.session.commit()

    return jsonify({
        'status': 'updated',
        "flight": {
            "id": flight.id,
            "name": flight.name,
            'interval': flight.day_interval,
            'time': f'{flight.begin_at.strftime("%H:%M")}',
            'area': {
                'id': area.id,
                'name': area.name
            },
            'drone': {
                'id': drone.id,
                'name': drone.name
            }
        }
    }), 200


@flights.route('/add_flight', methods=['POST'])
@is_logged
def add_flight():
    json = request.get_json()
    name = json['name']
    area_id = int(json['area_id'])
    drone_id = int(json['drone_id'])
    interval = int(json['interval'])
    time_obj = time()
    try:
        flight_time = json['time'].split(':')
        time_obj = time(hour=int(flight_time[0]), minute=int(flight_time[1]), second=0)
    except:
        return jsonify({'status': 'error', 'error': 'wrong time format'}), 400
    user = User.verify_auth_token(json['token'])
    area = Area.query.filter(Area.id == area_id, Area.user_id == user.id).first()
    if not area:
        return jsonify({'status': 'error', 'error': 'area not found'})
    drone = Drone.query.filter(Drone.id == drone_id, Drone.user_id == user.id).first()
    if not drone:
        return jsonify({'status': 'error', 'error': 'drone not found'})
    flight = Flight(name=name, area_id=area_id, drone_id=drone_id,
                    begin_at=time_obj, day_interval=interval, user_id=user.id)
    db.session.add(flight)
    db.session.commit()
    return jsonify({
        'status': 'created',
        "flight": {
            "id": flight.id,
            "name": flight.name,
            'interval': flight.day_interval,
            'time': f'{flight.begin_at.strftime("%H:%M")}',
            'area': {
                'id': area.id,
                'name': area.name
            },
            'drone': {
                'id': drone.id,
                'name': drone.name
            }
        }
    }), 200


@flights.route('/flights', methods=['POST'])
@is_logged
def get_flights():
    json = request.get_json()
    token = json['token']
    user = User.verify_auth_token(token)
    user_flights = user.flights
    user_fights = sorted(user_flights, key=lambda f: f.id)
    data = []
    for flight in user_flights:
        data.append({
            'id': flight.id,
            'name': flight.name,
            'interval': flight.day_interval,
            'time': flight.begin_at.strftime("%H:%M"),
            'active': flight.active,
            'area': {
                'id': flight.area.id,
                'name': flight.area.name
            },
            'drone': {
                'id': flight.drone.id,
                'name': flight.drone.name
            }
        })

    return jsonify(data), 200


@flights.route('/add_flight_event', methods=['POST'])
def add_flight_event():
    json = request.get_json()
    flight_id = int(json['field_id'])
    start_time = datetime.datetime.fromtimestamp(int(json['start_time']))
    end_time = json['end_time']
    start_level = datetime.datetime.fromtimestamp(int(json['start_level']))
    end_level = json['end_level']

    flight = db.session.query(Flight).filter(Flight.id == flight_id).first()
    flight_event = FlightEvent(start_time=start_time, end_time=end_time,
                               resources_spent=end_level, resources_loaded=start_level,
                               successful=True, flight_id=flight.id)
    return jsonify({"status": f"flight for drone {flight.drone_id}({flight.drone.name}); area {flight.area_id}({flight.area.name})"}), 200