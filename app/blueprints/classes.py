from flask import Blueprint, request, jsonify, abort
from app.models import Class
from app import db
from app.schemas import class_schema, classes_schema

classes_bp = Blueprint('classes', __name__)

@classes_bp.route('/', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    return jsonify(classes_schema.dump(classes)), 200

@classes_bp.route('/<int:id>', methods=['GET'])
def get_class(id):
    class_instance = Class.query.get_or_404(id)
    return jsonify(class_schema.dump(class_instance)), 200

@classes_bp.route('/', methods=['POST'])
def create_class():
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        class_instance = class_schema.load(json_data, session=db.session)
    except Exception as e:
        abort(400, str(e))
    db.session.add(class_instance)
    db.session.commit()
    return jsonify(class_schema.dump(class_instance)), 201

@classes_bp.route('/<int:id>', methods=['PUT', 'PATCH'])
def update_class(id):
    class_instance = Class.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        abort(400, "Brak danych wejściowych")
    try:
        class_instance = class_schema.load(json_data, instance=class_instance, session=db.session, partial=True)
    except Exception as e:
        abort(400, str(e))
    db.session.commit()
    return jsonify(class_schema.dump(class_instance)), 200

@classes_bp.route('/<int:id>', methods=['DELETE'])
def delete_class(id):
    class_instance = Class.query.get_or_404(id)
    db.session.delete(class_instance)
    db.session.commit()
    return jsonify({"message": "Klasa została usunięta"}), 200
