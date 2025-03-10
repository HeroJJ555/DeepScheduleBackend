import random
import copy
from ortools.linear_solver import pywraplp
from app import db
from app.models import Class, Teacher, Room, Subject


def get_available_assignments(class_id):
    from app.models import Class, Room
    class_instance = Class.query.get(class_id)
    if not class_instance:
        return []

    school_id = class_instance.school_id
    teachers = class_instance.teachers
    subjects = class_instance.subjects
    rooms = Room.query.filter_by(school_id=school_id).all()

    assignments = []
    for teacher in teachers:
        if teacher.availability:
            try:
                available_hours = [int(x.strip()) for x in teacher.availability.split(',')]
            except Exception:
                available_hours = [8]
        else:
            available_hours = [8]
        teacher_subject_ids = [s.id for s in teacher.subjects]
        for subject in subjects:
            if subject.id in teacher_subject_ids:
                for room in rooms:
                    assignment = {
                        'teacher_id': teacher.id,
                        'room_id': room.id,
                        'subject_id': subject.id,
                        'available_hours': available_hours,
                        'status': 'w edycji'
                    }
                    assignments.append(assignment)
    return assignments


def ilp_schedule_generation(class_id, data):
    solver = pywraplp.Solver.CreateSolver('SCIP')
    if not solver:
        return None

    num_days = 5
    lessons_per_day = 6
    num_slots = num_days * lessons_per_day

    assignments = data['assignments']
    num_assignments = len(assignments)


    y = {}
    for i in range(num_slots):
        for j in range(num_assignments):
            y[i, j] = solver.BoolVar(f'y_{i}_{j}')


    for i in range(num_slots):
        solver.Add(sum(y[i, j] for j in range(num_assignments)) == 1)


    penalties = {}
    for i in range(num_slots):
        lesson_hour = 8 + (i % lessons_per_day)
        for j in range(num_assignments):
            available_hours = assignments[j].get('available_hours', [8])
            penalties[i, j] = 0 if lesson_hour in available_hours else 100

    objective = solver.Sum([penalties[i, j] * y[i, j] for i in range(num_slots) for j in range(num_assignments)])
    solver.Minimize(objective)

    status = solver.Solve()
    if status != pywraplp.Solver.OPTIMAL:
        return None

    base_schedule = []
    for i in range(num_slots):
        for j in range(num_assignments):
            if y[i, j].solution_value() > 0.5:
                lesson_hour = 8 + (i % lessons_per_day)
                day_of_week = i // lessons_per_day  # 0: poniedziałek, ..., 4: piątek
                entry = assignments[j].copy()
                entry['class_id'] = class_id
                entry['day_of_week'] = day_of_week
                entry['lesson_hour'] = lesson_hour
                entry['start_hour'] = lesson_hour
                base_schedule.append(entry)
                break
    return base_schedule


def evaluate_schedule(schedule, data):

    penalty = 0
    for entry in schedule:
        if entry.get('start_hour', 8) != 8:
            penalty += 10
    return penalty


def mutate_schedule(schedule):

    new_schedule = copy.deepcopy(schedule)
    if len(new_schedule) < 2:
        return new_schedule
    i, j = random.sample(range(len(new_schedule)), 2)
    new_schedule[i], new_schedule[j] = new_schedule[j], new_schedule[i]
    return new_schedule


def ga_refinement(base_schedule, data, iterations=100):
    current_schedule = base_schedule
    current_fitness = evaluate_schedule(current_schedule, data)

    for _ in range(iterations):
        candidate = mutate_schedule(current_schedule)
        candidate_fitness = evaluate_schedule(candidate, data)
        if candidate_fitness < current_fitness:
            current_schedule = candidate
            current_fitness = candidate_fitness
    return current_schedule


def generate_schedule_bobr(class_id):
    data = {}
    assignments = get_available_assignments(class_id)
    if not assignments:
        return None
    data['assignments'] = assignments

    base_schedule = ilp_schedule_generation(class_id, data)
    if base_schedule is None:
        return None

    refined_schedule = ga_refinement(base_schedule, data, iterations=100)
    return refined_schedule
