// frontend/src/features/classes/ManageClassesModal.jsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaBook, FaChalkboardTeacher, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
} from './useClasses';
import './manageClassesModal.css';

export default function ManageClassesModal({
  schoolId,
  subjects = [],
  teachers = [],
  isOpen,
  onClose,
}) {
  const { data: classes = [], isLoading } = useClasses(schoolId, { enabled: isOpen });
  const createClass = useCreateClass(schoolId);
  const updateClass = useUpdateClass(schoolId);
  const deleteClass = useDeleteClass(schoolId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: '',
    subjects: subjects.map(s => ({
      subjectId: s.id,
      enabled: false,
      teacherId: null,
      extended: false,
    })),
  });

  useEffect(() => {
    if (isOpen) {
      setEditing(false);
      setForm(f => ({
        ...f,
        id: null,
        name: '',
        subjects: subjects.map(s => ({
          subjectId: s.id,
          enabled: false,
          teacherId: null,
          extended: false,
        })),
      }));
    }
  }, [isOpen, subjects]);

  if (!isOpen) return null;
  if (isLoading) {
    return (
      <div className="cm-overlay" onClick={onClose}>
        <div className="cm-modal" onClick={e => e.stopPropagation()}>
          <p>Ładowanie klas…</p>
        </div>
      </div>
    );
  }

  const startEdit = cls => {
    setEditing(true);
    // załaduj istniejące powiązania
    const subjState = subjects.map(s => {
      const cs = cls.classSubjects.find(x => x.subjectId === s.id);
      return {
        subjectId: s.id,
        enabled: Boolean(cs),
        teacherId: cs?.teacherId || null,
        extended: cs?.extended || false,
      };
    });
    setForm({ id: cls.id, name: cls.name, subjects: subjState });
  };

  const toggleEnabled = idx => {
    setForm(f => {
      const a = [...f.subjects];
      a[idx].enabled = !a[idx].enabled;
      if (!a[idx].enabled) {
        a[idx].teacherId = null;
        a[idx].extended = false;
      }
      return { ...f, subjects: a };
    });
  };
  const setTeacher = (idx, teacherId) =>
    setForm(f => {
      const a = [...f.subjects];
      a[idx].teacherId = teacherId;
      return { ...f, subjects: a };
    });
  const toggleExtended = idx =>
    setForm(f => {
      const a = [...f.subjects];
      a[idx].extended = !a[idx].extended;
      return { ...f, subjects: a };
    });

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      classSubjects: form.subjects
        .filter(s => s.enabled)
        .map(s => ({
          subjectId: s.subjectId,
          teacherId: s.teacherId,
          extended: s.extended,
        })),
    };
    if (editing) payload.id = form.id;

    const fn = editing ? updateClass : createClass;
    fn.mutate(payload, {
      onSuccess: resp => {
        toast.success(editing ? 'Zapisano klasę' : 'Dodano klasę');
        if (editing) {
          startEdit(resp);
        } else {
          // wyczyść
          setForm(f => ({
            ...f,
            id: null,
            name: '',
            subjects: subjects.map(s => ({
              subjectId: s.id,
              enabled: false,
              teacherId: null,
              extended: false,
            })),
          }));
        }
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd'),
    });
  };

  const handleDelete = () => {
    deleteClass.mutate(form.id, {
      onSuccess: () => {
        toast.success('Usunięto klasę');
        setEditing(false);
        setForm(f => ({
          ...f,
          id: null,
          name: '',
          subjects: subjects.map(s => ({
            subjectId: s.id,
            enabled: false,
            teacherId: null,
            extended: false,
          })),
        }));
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd'),
    });
  };

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-modal" onClick={e => e.stopPropagation()}>
        <header className="cm-header">
          <h3>
            <FaUsers /> {editing ? 'Edytuj klasę' : 'Dodaj klasę'}
          </h3>
          <button className="cm-close" onClick={onClose}>×</button>
        </header>

        <form className="cm-form" onSubmit={handleSubmit}>
          <div className="cm-row">
            <label><FaUsers /> Nazwa klasy</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="cm-subjects">
            <span><FaBook /> Przedmioty</span>
            <table className="cm-table">
              <thead>
                <tr>
                  <th>Przedmiot</th>
                  <th>On/Off</th>
                  <th>Nauczyciel</th>
                  <th>Rozszerzenie</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s, i) => {
                  const row = form.subjects[i];
                  return (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={row.enabled}
                          onChange={() => toggleEnabled(i)}
                        />
                      </td>
                      <td>
                        <Select
                          isDisabled={!row.enabled}
                          options={teachers.map(t => ({ label: t.name, value: t.id }))}
                          value={
                            row.teacherId
                              ? { label: teachers.find(t => t.id === row.teacherId).name, value: row.teacherId }
                              : null
                          }
                          onChange={opt => setTeacher(i, opt?.value || null)}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          disabled={!row.enabled}
                          checked={row.extended}
                          onChange={() => toggleExtended(i)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="cm-actions">
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

        <footer className="cm-footer">
          <h4>Lista klas</h4>
          <ul className="cm-list">
            {classes.map(c => (
              <li key={c.id} onClick={() => startEdit(c)}>
                {c.name}
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}
