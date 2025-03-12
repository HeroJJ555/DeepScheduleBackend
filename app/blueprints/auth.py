from flask import Blueprint, request, jsonify, abort
from app import db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(key in data for key in ('username', 'email', 'password')):
        abort(400, "Brak wymaganych danych: username, email, password")

    if User.query.filter((User.username == data['username']) | (User.email == data['email'])).first():
        abort(400, "Użytkownik o podanej nazwie lub emailu już istnieje")

    new_user = User(
        username=data['username'],
        email=data['email']
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Użytkownik zarejestrowany"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(key in data for key in ('username', 'password')):
        abort(400, "Brak wymaganych danych: username, password")

    user = User.query.filter_by(username=data['username']).first()
    if user is None or not user.check_password(data['password']):
        abort(401, "Nieprawidłowe dane logowania")

    return jsonify({
        "message": "Zalogowano pomyślnie",
        "user_id": user.id,
        "username": user.username
    }), 200
