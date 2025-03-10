from flask import Blueprint, request, jsonify, abort
from app.models import Subject
from app import db
from app.schemas import subject_schema, subjects_schema

subjects_bp = Blueprint('subjects', __name__)

@subjects_bp.route('/', methods=['GET'])
def get_subjects():
    subjects = Subject.query.all()
    return jsonify(subjects_schema.dump(subjects)), 200

@subjects_bp.route('/<int:id>', methods=['GET'])
def get_subject(id):
    subject = Subject.query.get_or_404(id)
    return jsonify(subject_schema.dump(subject)), 200

@subjects_bp.route('/', methods=['POST'])
def create_subject():
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        subject = subject_schema.load(json_data, session=db.session)
    except Exception as e:
        abort(400, str(e))
    db.session.add(subject)
    db.session.commit()
    return jsonify(subject_schema.dump(subject)), 201

@subjects_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_subject(id):
    subject = Subject.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        subject = subject_schema.load(json_data, instance=subject, session=db.session, partial=True)
    except Exception as e:
        abort(400, str(e))
    db.session.commit()
    return jsonify(subject_schema.dump(subject)), 200

@subjects_bp.route('/<int:id>', methods=['DELETE'])
def delete_subject(id):
    subject = Subject.query.get_or_404(id)
    db.session.delete(subject)
    db.session.commit()
    return jsonify({"message": "Przedmiot został usunięty"}), 200
