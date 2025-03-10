from flask import Blueprint, request, jsonify, abort
from app.models import School
from app import db
from app.schemas import school_schema, schools_schema

schools_bp = Blueprint('schools', __name__)

@schools_bp.route('/', methods=['GET'])
def get_schools():
    schools = School.query.all()
    return jsonify(schools_schema.dump(schools)), 200

@schools_bp.route('/<int:id>', methods=['GET'])
def get_school(id):
    school = School.query.get_or_404(id)
    return jsonify(school_schema.dump(school)), 200

@schools_bp.route('/', methods=['POST'])
def create_school():
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        school = school_schema.load(json_data, session=db.session)
    except Exception as e:
        abort(400, str(e))
    db.session.add(school)
    db.session.commit()
    return jsonify(school_schema.dump(school)), 201

@schools_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_school(id):
    school = School.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        school = school_schema.load(json_data, instance=school, session=db.session, partial=True)
    except Exception as e:
        abort(400, str(e))
    db.session.commit()
    return jsonify(school_schema.dump(school)), 200

@schools_bp.route('/<int:id>', methods=['DELETE'])
def delete_school(id):
    school = School.query.get_or_404(id)
    db.session.delete(school)
    db.session.commit()
    return jsonify({"message": "Szkoła została usunięta"}), 200
