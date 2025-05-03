import React, { useState, useEffect } from 'react';
import { FaUserTie, FaBook, FaClock, FaTrash, FaSave, FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import './manageTeachersModal.css';
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from './useTeachers';
import { toast } from 'react-toastify';

export default function ManageTeachersModal({ schoolId, subjects, timeslots, isOpen, onClose }) {
  const { data: teachers = [], isLoading } = useTeachers(schoolId, { enabled: isOpen });
  const createT = useCreateTeacher(schoolId);
  const updateT = useUpdateTeacher(schoolId);
  const deleteT = useDeleteTeacher(schoolId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: '',
    subjectIds: [],
    workload: 0,
    timeslotIds: []
  });

  const uniqueHours = Array.from(new Set(timeslots.map(t => t.hour))).sort((a, b) => a - b);
  const periodLabels = [
    '08:00–08:45',
    '08:55–09:40',
    '09:50–10:35',
    '10:45–11:30',
    '11:50–12:35',
    '12:45–13:30',
    '13:40–14:25'
  ];

  useEffect(() => {
    if (!isOpen) {
      setEditing(false);
      setForm({ id: null, name:'', subjectIds:[], workload:0, timeslotIds:[] });
    }
  }, [isOpen]);

  const startEdit = t => {
    setEditing(true);
    setForm({
      id: t.id,
      name: t.name,
      workload: t.workload || 0,
      subjectIds: t.teacherSubjects.map(ts => ts.subject.id),
      timeslotIds: t.availabilities.map(a => a.timeslot.id)
    });
  };

  const toggleSlot = id => {
    setForm(f => {
      const has = f.timeslotIds.includes(id);
      return {
        ...f,
        timeslotIds: has
          ? f.timeslotIds.filter(x => x !== id)
          : [...f.timeslotIds, id]
      };
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = { ...form };
    const fn = editing ? updateT : createT;
    fn.mutate(payload, {
      onSuccess: () => {
        toast.success(editing ? 'Zaktualizowano nauczyciela' : 'Dodano nauczyciela');
        setEditing(false);
        setForm({ id:null, name:'', subjectIds:[], workload:0, timeslotIds:[] });
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd operacji')
    });
  };

  const handleDelete = () => {
    deleteT.mutate(form.id, {
      onSuccess: () => {
        toast.success('Usunięto nauczyciela');
        setEditing(false);
        setForm({ id:null, name:'', subjectIds:[], workload:0, timeslotIds:[] });
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd usuwania')
    });
  };

  if (!isOpen) return null;
  return (
    <div className="mtm-overlay" onClick={onClose}>
      <div className="mtm-modal" onClick={e => e.stopPropagation()}>
        <header className="mtm-header">
          <h3>
            <FaUserTie /> {editing ? 'Edytuj nauczyciela' : 'Dodaj nowego nauczyciela'}
          </h3>
          <button className="mtm-close" onClick={onClose}>×</button>
        </header>

        <form className="mtm-form" onSubmit={handleSubmit}>
          <div className="mtm-row">
            <label><FaUserTie /> Imię i nazwisko</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="mtm-row">
            <label><FaBook /> Przedmioty</label>
            <Select
              isMulti
              options={subjects.map(s => ({ label: s.name, value: s.id }))}
              value={subjects
                .filter(s => form.subjectIds.includes(s.id))
                .map(s => ({ label: s.name, value: s.id }))}
              onChange={opts =>
                setForm(f => ({ ...f, subjectIds: opts.map(o => o.value) }))
              }
            />
          </div>

          <div className="mtm-row">
            <label><FaClock /> Etat (godz./tydz.)</label>
            <input
              type="number"
              min="0"
              value={form.workload}
              onChange={e => setForm(f => ({ ...f, workload: +e.target.value }))}
            />
          </div>

          <div className="mtm-availability">
            <span>Dostępność w tygodniu</span>
            <table className="mtm-table">
              <thead>
                <tr>
                  <th>Godzina</th>
                  {['Pn','Wt','Śr','Cz','Pt'].map((d,i) =>
                    <th key={i}>{d}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {uniqueHours.map(hour => (
                  <tr key={hour}>
                    <td className="mtm-time">{periodLabels[hour]}</td>
                    {[0,1,2,3,4].map(day => {
                      const slot = timeslots.find(t => t.day === day && t.hour === hour);
                      const sel = slot && form.timeslotIds.includes(slot.id);
                      return (
                        <td
                          key={day}
                          className={sel ? 'selected' : slot ? '' : 'disabled'}
                          onClick={() => slot && toggleSlot(slot.id)}
                          title={slot ? (sel ? 'Odznacz' : 'Zaznacz') : 'Niedostępne'}
                        >
                          {sel && '✓'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mtm-actions">
            <button type="submit" className="btn btn-primary">
              {editing ? <><FaSave /> Zapisz</> : <><FaPlus /> Dodaj</>}
            </button>
            {editing && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <FaTrash /> Usuń
              </button>
            )}
          </div>
        </form>

        <footer className="mtm-footer">
          <h4>Lista nauczycieli</h4>
          <ul className="mtm-list">
            {isLoading
              ? <li>Ładowanie…</li>
              : teachers.map(t => (
                <li
                  key={t.id}
                  onClick={() => startEdit(t)}
                  title="Kliknij, aby edytować"
                >
                  {t.name} ({t.workload}h)
                </li>
              ))
            }
          </ul>
        </footer>
      </div>
    </div>
  );
}
