from flask import Blueprint, request, jsonify
from api.views.auth import is_logged
from api.model import User, Drone, Model
from api.app import db

drones = Blueprint('drones', __name__)


@drones.route('/delete_drone', methods=['POST', 'DELETE'])
@is_logged
def delete_drone():
    json = request.get_json()
    user = User.verify_auth_token(json['token'])
    drone = Drone.query.filter(Drone.id == int(json['id']), Drone.user_id == user.id).first()
    if len(drone.flights) != 0:
        return jsonify({'status': 'error', 'error': 'delete forbidden'}), 400
    if not drone:
        return jsonify({'status': "error", "error": 'drone not found'}), 400
    db.session.delete(drone)
    db.session.commit()
    return jsonify({'status': "deleted"}), 200


@drones.route('/update_drone', methods=['POST', 'PUT'])
@is_logged
def update_drone():
    json = request.get_json()
    user = User.verify_auth_token(json['token'])
    drone = Drone.query.filter(Drone.user_id == user.id, Drone.id == int(json['id'])).first()
    if not drone:
        return jsonify({'status': 'error', 'error': 'drone by id not found'}), 400
    drone_code = Drone.query.filter(Drone.user_id == user.id, Drone.code == int(json['code'])).all()
    drone_code = [drone for drone in drone_code if drone.id != int(json['id'])]
    if drone_code:
        return jsonify({"status": 'error', 'error': 'duplicate code'}), 400
    if drone.code != int(json['code']):
        drone.synced = False
    drone.code = int(json['code'])
    drone.name = json['name']
    model_id = int(json['model_id'])
    model = db.session.query(Model).filter(Model.id == model_id).first()
    drone.model_id = model.id
    db.session.commit()
    return jsonify({
        "status": "updated",
        "drone": {
            "id": drone.id,
            "name": drone.name,
            "model": {
                "id": drone.model.id,
                "name": drone.model.name
            },
            "code": drone.code,
            "sync": drone.synced,
            "last_synced": drone.last_synced
        }
    }), 200


@drones.route('/add_drone', methods=['POST'])
@is_logged
def add_drone():
    json = request.get_json()
    name = json['name']
    code = int(json['code'])
    model_id = int(json['model_id'])
    user = User.verify_auth_token(json['token'])
    model = db.session.query(Model).filter(Model.id == model_id).first()
    drone_code = Drone.query.filter(Drone.user_id == user.id, Drone.code == code).first()
    if drone_code:
        return jsonify({"error": "duplicate code"}), 400
    drone = Drone(name=name, model_id=model.id, code=code, user_id=user.id)
    db.session.add(drone)
    db.session.commit()

    return jsonify({
        'status': 'created'
    }), 200


@drones.route('/models', methods=['GET'])
def get_models():
    models = db.session.query(Model).all()
    obj = [{
        "id": model.id,
        "name": model.name
    } for model in models]
    return jsonify(obj), 200


@drones.route('/drones', methods=['POST'])
@is_logged
def get_drones():
    json = request.get_json()
    token = json['token']
    user = User.verify_auth_token(token)
    drones = user.drones
    data = [{
                "id": drone.id,
                "name": drone.name,
                "model": {
                    "id": drone.model.id,
                    "name": drone.model.name
                },
                "code": drone.code,
                "sync": drone.synced,
                "last_synced": drone.last_synced
            } for drone in drones]
    response = jsonify(data)
    return response, 200
