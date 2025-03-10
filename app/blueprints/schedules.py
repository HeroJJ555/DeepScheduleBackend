from flask import Blueprint, request, jsonify, abort
from app.models import Schedule
from app import db
from app.scheduler import generate_schedule_bobr
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

@schedules_bp.route('/generate/<int:class_id>', methods=['POST'])
def generate_schedule_endpoint(class_id):
    schedule = generate_schedule_bobr(class_id)
    if schedule is None:
        abort(400, "Nie udało się wygenerować harmonogramu")

    for entry in schedule:
        new_entry = Schedule(
            class_id=entry.get('class_id'),
            teacher_id=entry.get('teacher_id'),
            room_id=entry.get('room_id'),
            subject_id=entry.get('subject_id'),
            day_of_week=entry.get('day_of_week'),
            lesson_hour=entry.get('lesson_hour'),
            status=entry.get('status', 'zatwierdzony')
        )
        db.session.add(new_entry)
    db.session.commit()

    return jsonify({
        "message": "Harmonogram wygenerowany i zapisany",
        "schedule": schedule
    }), 200


@schedules_bp.route('/', methods=['GET'])
def get_schedules():
    schedules = Schedule.query.all()
    return jsonify(schedules_schema.dump(schedules)), 200


@schedules_bp.route('/<int:id>', methods=['GET'])
def get_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    return jsonify(schedule_schema.dump(schedule)), 200


@schedules_bp.route('/<int:id>', methods=['DELETE'])
def delete_schedule(id):
    schedule = Schedule.query.get_or_404(id)
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Harmonogram został usunięty"}), 200
