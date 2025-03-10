from flask import Blueprint, request, jsonify, abort
from app.models import Room
from app import db
from app.schemas import room_schema, rooms_schema

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify(rooms_schema.dump(rooms)), 200

@rooms_bp.route('/<int:id>', methods=['GET'])
def get_room(id):
    room = Room.query.get_or_404(id)
    return jsonify(room_schema.dump(room)), 200

@rooms_bp.route('/', methods=['POST'])
def create_room():
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        room = room_schema.load(json_data, session=db.session)
    except Exception as e:
        abort(400, str(e))
    db.session.add(room)
    db.session.commit()
    return jsonify(room_schema.dump(room)), 201

@rooms_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_room(id):
    room = Room.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        room = room_schema.load(json_data, instance=room, session=db.session, partial=True)
    except Exception as e:
        abort(400, str(e))
    db.session.commit()
    return jsonify(room_schema.dump(room)), 200

@rooms_bp.route('/<int:id>', methods=['DELETE'])
def delete_room(id):
    room = Room.query.get_or_404(id)
    db.session.delete(room)
    db.session.commit()
    return jsonify({"message": "Sala została usunięta"}), 200
