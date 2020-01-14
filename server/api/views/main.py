from flask import Blueprint, request, jsonify
from api.views.auth import is_logged
from api.model import User
from api.app import db

main = Blueprint('main', __name__)


@main.route("/profile", methods=['POST'])
@is_logged
def profile():
    json = request.get_json()
    token = json['token']
    user = User.verify_auth_token(token)

    return jsonify({
        'login': user.login,
        'email': user.email,
        'status': 'done'
    })


@main.route('/update_user', methods=['POST'])
@is_logged
def update_user():
    json = request.get_json()
    user = User.verify_auth_token(json['token'])
    check_users = User.query.filter(User.email == json['email']).all()
    check_users = [check_user for check_user in check_users if check_user.id != user.id]
    if check_users:
        return jsonify({"error": "Email is already taken"})
    user.email = json['email']
    db.session.commit()
    return jsonify({"status": "Information updated"})


@main.route('/change_password', methods=['POST'])
@is_logged
def change_password():
    json = request.get_json()
    token = json['token']
    user = User.verify_auth_token(token)
    if user.password != json['password_old']:
        return jsonify({"error": "Wrong password"})
    user.password = json['password']
    db.session.commit()
    return jsonify({"status": "Password updated"})
