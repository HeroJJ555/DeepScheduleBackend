from flask import Blueprint, request, jsonify, abort
from app.models import Schedule
from app import db
from app.schemas import schedule_schema, schedules_schema

schedules_bp = Blueprint('schedules', __name__)

@schedules_bp.route('/', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    return jsonify(schedules_schema.dump(schedules)), 200

@schedules_bp.route('/<int:id>', methods=['GET'])
def get_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    return jsonify(schedule_schema.dump(schedule)), 200

@schedules_bp.route('/', methods=['POST'])
def create_schedule():
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        schedule = schedule_schema.load(json_data, session=db.session)
    except Exception as e:
        abort(400, str(e))
    db.session.add(schedule)
    db.session.commit()
    return jsonify(schedule_schema.dump(schedule)), 201

@schedules_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        schedule = schedule_schema.load(json_data, instance=schedule, session=db.session, partial=True)
    except Exception as e:
        abort(400, str(e))
    db.session.commit()
    return jsonify(schedule_schema.dump(schedule)), 200

@schedules_bp.route('/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Harmonogram został usunięty"}), 200
