from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from .config import Config

db = SQLAlchemy()
ma = Marshmallow()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    ma.init_app(app)

    # Rejestracja blueprintów
    from .blueprints.auth import auth_bp
    from .blueprints.schools import schools_bp
    from .blueprints.teachers import teachers_bp
    from .blueprints.subjects import subjects_bp
    from .blueprints.rooms import rooms_bp
    from .blueprints.classes import classes_bp
    from .blueprints.schedules import schedules_bp

    app.register_blueprint(schools_bp, url_prefix="/schools")
    app.register_blueprint(teachers_bp, url_prefix="/teachers")
    app.register_blueprint(subjects_bp, url_prefix="/subjects")
    app.register_blueprint(rooms_bp, url_prefix="/rooms")
    app.register_blueprint(classes_bp, url_prefix="/classes")
    app.register_blueprint(schedules_bp, url_prefix="/schedules")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    with app.app_context():
        db.create_all()

    return app
