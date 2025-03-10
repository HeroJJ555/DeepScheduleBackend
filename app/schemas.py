from . import ma
from .models import School, Teacher, Subject, Room, Class, Schedule

class SchoolSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = School
        include_fk = True
        load_instance = True

school_schema = SchoolSchema()
schools_schema = SchoolSchema(many=True)

class TeacherSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Teacher
        include_fk = True
        load_instance = True

teacher_schema = TeacherSchema()
teachers_schema = TeacherSchema(many=True)

class SubjectSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Subject
        include_fk = True
        load_instance = True

subject_schema = SubjectSchema()
subjects_schema = SubjectSchema(many=True)

class RoomSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Room
        include_fk = True
        load_instance = True

room_schema = RoomSchema()
rooms_schema = RoomSchema(many=True)

class ClassSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Class
        include_fk = True
        load_instance = True

class_schema = ClassSchema()
classes_schema = ClassSchema(many=True)

class ScheduleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Schedule
        include_fk = True
        load_instance = True

schedule_schema = ScheduleSchema()
schedules_schema = ScheduleSchema(many=True)
