from . import db
from datetime import datetime


teacher_subject = db.Table('teacher_subject',
                           db.Column('teacher_id', db.Integer, db.ForeignKey('teachers.id'), primary_key=True),
                           db.Column('subject_id', db.Integer, db.ForeignKey('subjects.id'), primary_key=True)
                           )

teacher_class = db.Table('teacher_class',
                         db.Column('teacher_id', db.Integer, db.ForeignKey('teachers.id'), primary_key=True),
                         db.Column('class_id', db.Integer, db.ForeignKey('classes.id'), primary_key=True)
                         )

subject_class = db.Table('subject_class',
                         db.Column('subject_id', db.Integer, db.ForeignKey('subjects.id'), primary_key=True),
                         db.Column('class_id', db.Integer, db.ForeignKey('classes.id'), primary_key=True)
                         )


class School(db.Model):
    __tablename__ = 'schools'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)  # nazwa szkoły
    address = db.Column(db.String(255))  # adres
    phone = db.Column(db.String(50))  # telefon
    email = db.Column(db.String(255))  # e-mail
    director = db.Column(db.String(255))  # dyrektor

    # Relacje: szkoła ma wiele nauczycieli, klas, sal i przedmiotów
    teachers = db.relationship("Teacher", backref="school", lazy=True)
    classes = db.relationship("Class", backref="school", lazy=True)
    rooms = db.relationship("Room", backref="school", lazy=True)
    subjects = db.relationship("Subject", backref="school", lazy=True)


# Model nauczyciela
class Teacher(db.Model):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(128), nullable=False)  # imię
    last_name = db.Column(db.String(128), nullable=False)  # nazwisko
    email = db.Column(db.String(255), unique=True, nullable=False)
    availability = db.Column(db.String(255))

    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)

    subjects = db.relationship("Subject", secondary=teacher_subject, back_populates="teachers")


class Subject(db.Model):
    __tablename__ = 'subjects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    code = db.Column(db.String(50), nullable=False)

    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)

    teachers = db.relationship("Teacher", secondary=teacher_subject, back_populates="subjects")

class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer)
    room_type = db.Column(db.String(100))

    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)

class Class(db.Model):
    __tablename__ = 'classes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer)
    section = db.Column(db.String(50))

    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)

    teachers = db.relationship("Teacher", secondary=teacher_class,
                               backref=db.backref("classes", lazy="dynamic"))
    subjects = db.relationship("Subject", secondary=subject_class,
                               backref=db.backref("classes", lazy="dynamic"))


class Schedule(db.Model):
    __tablename__ = 'schedules'

    id = db.Column(db.Integer, primary_key=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)

    day_of_week = db.Column(db.Integer, nullable=False)
    lesson_hour = db.Column(db.Integer, nullable=False)
    modified_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    status = db.Column(db.String(50))

    class_ = db.relationship("Class", backref="schedules")
    teacher = db.relationship("Teacher", backref="schedules")
    room = db.relationship("Room", backref="schedules")
    subject = db.relationship("Subject", backref="schedules")
