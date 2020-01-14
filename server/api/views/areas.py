from flask import request, jsonify, Blueprint
from api.model import User, Area, RectanglePoint
from api.views.auth import is_logged
from api.app import db

areas = Blueprint('areas', __name__)


@areas.route('/delete_area', methods=['POST'])
@is_logged
def delete_area():
    json = request.get_json()
    user = User.verify_auth_token(json['token'])
    area = Area.query.filter(Area.id == int(json['id']), Area.user_id == user.id).first()
    if not area:
        return jsonify({'status': "error", "error": 'area not found'}), 400
    if len(area.flights) != 0:
        return jsonify({'status': 'error', 'error': 'delete forbidden'}), 400
    for point in area.points:
        db.session.delete(point)
    db.session.delete(area)
    db.session.commit()
    return jsonify({'status': "deleted"}), 200


@areas.route('/update_area', methods=['POST'])
@is_logged
def update_area():
    json = request.get_json()
    user = User.verify_auth_token(json['token'])
    area = Area.query.filter(Area.user_id == user.id, Area.id == int(json['id'])).first()
    if not area:
        return jsonify({'status': 'error', 'error': 'area not found'}), 400
    area.name = json['name']
    area.crops_type = json['crops_type']
    area.square = float(json['square'])
    db.session.query(RectanglePoint).filter(RectanglePoint.area_id == area.id).delete()
    db.session.commit()
    for point in json['points']:
        p = RectanglePoint(area_id=area.id, latitude=float(point['lat']), longitude=float(point['lng']))
        db.session.add(p)
    db.session.commit()
    area.name = json['name']
    db.session.commit()
    return jsonify({
        "status": "updated",
        "area": {
            "id": area.id,
            "name": area.name,
            'crops_type': area.crops_type,
            'square': area.square,
            "points": [{"lat": p.latitude, 'lng': p.longitude} for p in area.points]
        }
    }), 200


@areas.route('/add_area', methods=['POST'])
@is_logged
def add_area():
    json = request.get_json()
    name = json['name']
    crops_type = json['crops_type']
    square = float(json['square'])
    points = json['points']
    user = User.verify_auth_token(json['token'])
    area = Area(name=name, crops_type=crops_type, square=square, user_id=user.id)
    db.session.add(area)
    db.session.commit()
    db.session.refresh(area)
    for p in points:
        db.session.add(RectanglePoint(area_id=area.id, latitude=float(p['lat']), longitude=float(p['lng'])))
    db.session.commit()

    return jsonify({
        'status': 'created',
        "area": {
            "id": area.id,
            "name": area.name,
            'crops_type': crops_type,
            'square': square,
            'points': points
        }
    }), 200


@areas.route('/areas', methods=['POST'])
@is_logged
def get_areas():
    json = request.get_json()
    token = json['token']
    user = User.verify_auth_token(token)
    user_areas = user.areas
    data = []
    for area in user_areas:
        points = []
        for point in area.points:
            points.append({
                'lat': point.latitude,
                'lng': point.longitude
            })
        data.append({
                'id': area.id,
                'name': area.name,
                'crops_type': area.crops_type,
                'square': area.square,
                'points': points
            })

    response = jsonify(data)
    return response, 200

