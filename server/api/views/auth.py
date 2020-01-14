from flask import Blueprint, request, jsonify
from functools import wraps

from api.model import User
from api.app import db

auth = Blueprint('auth', __name__)


def is_logged(func):
    @wraps(func)
    def token_check(*args, **kwargs):
        json = request.json
        token = json['token']
        user = User.verify_auth_token(token)
        if user is None:
            return jsonify({'status': 'error',
                            'error': 'token not valid'}), 401
        return func(*args, **kwargs)

    return token_check


@auth.route("/check_token", methods=['POST'])
def check_token():
    json = request.get_json()
    token = json['token']
    is_valid = User.verify_auth_token(token=token) is not None
    return jsonify({'token_is_valid': is_valid}), 200


@auth.route("/login", methods=['POST'])
def user_login():
    json = request.json
    login = json['login']
    password = json['password']

    user = User.query.filter_by(login=login).first()
    if user is None:
        return jsonify({'error': 'User not found'}), 200
    if user.password != password:
        return jsonify({'error': 'Wrong password'}), 200
    return jsonify({'token': user.generate_auth_token(), 'status': 'done'}), 200


@auth.route("/logout", methods=['POST'])
def user_logout():
    return jsonify({'status': 'done'}), 200


@auth.route('/signup', methods=['POST'])
def user_signup():
    json = request.json
    login = json['login']
    email = json['email']
    password = json['password']

    user = User.query.filter_by(login=login).first()
    if user:
        return jsonify({'error': 'Login is taken', "status": "error"}), 200
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'Email is taken', "status": "error"}), 200
    user = User(login=login, email=email, password=password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'login': login,
        'email': email,
        'password': password,
        'token': user.generate_auth_token(),
        "status": "done"
    }), 200