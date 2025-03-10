from app import create_app, db
from app.models import School, Teacher, Subject, Room, Class

app = create_app()
app.app_context().push()

# --- Utworzenie szkoły ---
school = School(
    name="Szkoła Podstawowa Nr 1",
    address="ul. Testowa 1",
    phone="123456789",
    email="info@szkola.pl",
    director="Dyrektor Testowy"
)
db.session.add(school)
db.session.commit()

# --- Utworzenie nauczyciela ---
teacher = Teacher(
    first_name="Jan",
    last_name="Kowalski",
    email="jan.kowalski@szkola.pl",
    availability="8,9,10",  # dostępne godziny
    school_id=school.id
)
db.session.add(teacher)
db.session.commit()

# --- Utworzenie przedmiotu ---
subject = Subject(
    name="Matematyka",
    code="MAT101",
    school_id=school.id
)
db.session.add(subject)
db.session.commit()

# Powiązanie nauczyciela z przedmiotem
teacher.subjects.append(subject)
db.session.commit()

# --- Utworzenie sali ---
room = Room(
    room_number="101",
    capacity=30,
    room_type="Klasa",
    school_id=school.id
)
db.session.add(room)
db.session.commit()

# --- Utworzenie klasy ---
class_instance = Class(
    name="1A",
    year=1,
    section="A",
    school_id=school.id
)
db.session.add(class_instance)
db.session.commit()

# Powiązanie klasy z nauczycielem i przedmiotem
class_instance.teachers.append(teacher)
class_instance.subjects.append(subject)
db.session.commit()

print("Dane testowe zostały wygenerowane.")
