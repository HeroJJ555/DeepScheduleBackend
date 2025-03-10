from flask import Blueprint, request, jsonify, abort
from app.models import Teacher
from app import db
from app.schemas import teacher_schema, teachers_schema

teachers_bp = Blueprint('teachers', __name__)

@teachers_bp.route('/', methods=['GET'])
def get_teachers():
    teachers = Teacher.query.all()
    return jsonify(teachers_schema.dump(teachers)), 200

@teachers_bp.route('/<int:id>', methods=['GET'])
def get_teacher(id):
    teacher = Teacher.query.get_or_404(id)
    return jsonify(teacher_schema.dump(teacher)), 200

@teachers_bp.route('/', methods=['POST'])
def create_teacher():
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        teacher = teacher_schema.load(json_data, session=db.session)
    except Exception as e:
        abort(400, str(e))
    db.session.add(teacher)
    db.session.commit()
    return jsonify(teacher_schema.dump(teacher)), 201

@teachers_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_teacher(id):
    teacher = Teacher.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        teacher = teacher_schema.load(json_data, instance=teacher, session=db.session, partial=True)
    except Exception as e:
        abort(400, str(e))
    db.session.commit()
    return jsonify(teacher_schema.dump(teacher)), 200

@teachers_bp.route('/<int:id>', methods=['DELETE'])
def delete_teacher(id):
    teacher = Teacher.query.get_or_404(id)
    db.session.delete(teacher)
    db.session.commit()
    return jsonify({"message": "Nauczyciel został usunięty"}), 200
