// src/features/teachers/ManageTeachersModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { FaUserTie, FaBook, FaClock, FaTrash, FaSave, FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import './manageTeachersModal.css';
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher
} from './useTeachers';
import { toast } from 'react-toastify';

export default function ManageTeachersModal({
  schoolId,
  subjects = [],
  timeslots = [],
  lessonSettings,
  isOpen,
  onClose
}) {
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

  // 1️⃣ Oblicz etykiety okresów na podstawie lessonSettings
  const periodLabels = useMemo(() => {
    if (!lessonSettings) return [];
    const {
      lessonDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakAfter,
      periodsPerDay
    } = lessonSettings;

    let labels = [];
    // Zakładamy start o 08:00; możesz to dodać do ustawień jeśli potrzebne
    let current = 8 * 60; // w minutach

    for (let i = 0; i < periodsPerDay; i++) {
      const startH = Math.floor(current / 60);
      const startM = current % 60;
      const endMin = current + lessonDuration;
      const endH = Math.floor(endMin / 60);
      const endM = endMin % 60;
      labels.push(
        `${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')}–` +
        `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`
      );
      // wybierz przerwę
      current = endMin + (i === longBreakAfter ? longBreakDuration : shortBreakDuration);
    }

    return labels;
  }, [lessonSettings]);

  useEffect(() => {
    if (isOpen) {
      // reset do nowego stanu przy otwarciu
      setEditing(false);
      setForm({ id:null, name:'', subjectIds:[], workload:0, timeslotIds:[] });
    }
  }, [isOpen]);

  const startEdit = teacher => {
    setEditing(true);
    setForm({
      id: teacher.id,
      name: teacher.name,
      workload: teacher.workload || 0,
      subjectIds: teacher.teacherSubjects.map(ts => ts.subject.id),
      timeslotIds: teacher.availabilities.map(a => a.timeslot.id)
    });
  };

  const toggleSlot = slotId => {
    setForm(f => {
      const has = f.timeslotIds.includes(slotId);
      return {
        ...f,
        timeslotIds: has
          ? f.timeslotIds.filter(x => x !== slotId)
          : [...f.timeslotIds, slotId]
      };
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const fn = editing ? updateT : createT;
    fn.mutate(form, {
      onSuccess: () => {
        toast.success(editing ? 'Zapisano zmiany' : 'Dodano nauczyciela');
        setEditing(false);
        setForm({ id:null, name:'', subjectIds:[], workload:0, timeslotIds:[] });
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd')
    });
  };

  const handleDelete = () => {
    deleteT.mutate(form.id, {
      onSuccess: () => {
        toast.success('Usunięto nauczyciela');
        setEditing(false);
        setForm({ id:null, name:'', subjectIds:[], workload:0, timeslotIds:[] });
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd')
    });
  };

  if (!isOpen) return null;
  return (
    <div className="mtm-overlay" onClick={onClose}>
      <div className="mtm-modal" onClick={e => e.stopPropagation()}>
        <header className="mtm-header">
          <h3><FaUserTie /> {editing ? 'Edytuj nauczyciela' : 'Dodaj nauczyciela'}</h3>
          <button className="mtm-close" onClick={onClose}>×</button>
        </header>

        <form className="mtm-form" onSubmit={handleSubmit}>
          {/* Imię i nazwisko */}
          <div className="mtm-row">
            <label><FaUserTie /> Imię i nazwisko</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          {/* Przedmioty */}
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

          {/* Etat */}
          <div className="mtm-row">
            <label><FaClock /> Etat (godz./tydz.)</label>
            <input
              type="number"
              min="0"
              value={form.workload}
              onChange={e => setForm(f => ({ ...f, workload: +e.target.value }))}
            />
          </div>

          {/* Dynamiczna tabela dostępności */}
          <div className="mtm-availability">
            <span>Dostępność w tygodniu</span>
            <table className="mtm-table">
              <thead>
                <tr>
                  <th>Okres</th>
                  {['Pn','Wt','Śr','Cz','Pt'].map((d,i) =>
                    <th key={i}>{d}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {periodLabels.map((label, idx) => (
                  <tr key={idx}>
                    <td className="mtm-time">{label}</td>
                    {[0,1,2,3,4].map(day => {
                      // znajdź odpowiadający timeslot
                      const slot = timeslots.find(t => t.day === day && t.hour === idx);
                      const selected = slot && form.timeslotIds.includes(slot.id);
                      return (
                        <td
                          key={day}
                          className={[
                            !slot && 'disabled',
                            selected && 'selected'
                          ].filter(Boolean).join(' ')}
                          onClick={() => slot && toggleSlot(slot.id)}
                          title={
                            !slot
                              ? 'Brak slotu'
                              : selected
                                ? 'Odznacz dostępność'
                                : 'Zaznacz dostępność'
                          }
                        >
                          {selected && '✓'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Akcje */}
          <div className="mtm-actions">
            <button type="submit" className="btn btn-primary">
              {editing ? <><FaSave /> Zapisz</> : <><FaPlus /> Dodaj</>}
            </button>
            {editing && (
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
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
                <li key={t.id} onClick={() => startEdit(t)}>
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
