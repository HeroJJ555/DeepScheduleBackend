import React, { useState, useEffect } from 'react';
import { FaClock, FaSave } from 'react-icons/fa';
import './manageLessonSettingsModal.css';
import { useUpdateLessonSettings } from './useLessonSettings';
import { toast } from 'react-toastify';

export default function ManageLessonSettingsModal({schoolId, settings, loading, isOpen, onClose})
{
  const update = useUpdateLessonSettings(schoolId);
  const [form, setForm] = useState({
    lessonDuration: 45,
    shortBreakDuration: 10,
    longBreakDuration: 20,
    longBreakAfter: 4,
    periodsPerDay: 6
  });

  // gdy się otworzy modal i przyjdą dane, zaczytaj do form
  useEffect(() => {
    if (isOpen && settings) {
      const { lessonDuration, shortBreakDuration, longBreakDuration, longBreakAfter, periodsPerDay } = settings;
      setForm({ lessonDuration, shortBreakDuration, longBreakDuration, longBreakAfter, periodsPerDay });
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;
  return (
    <div className="mls-overlay" onClick={onClose}>
      <div className="mls-modal" onClick={e => e.stopPropagation()}>
        <header className="mls-header">
          <h3><FaClock /> Ustawienia lekcji & przerw</h3>
          <button className="mls-close" onClick={onClose}>×</button>
        </header>

        <form
          className="mls-form"
          onSubmit={e => {
            e.preventDefault();
            update.mutate(form, {
              onSuccess: () => toast.success('Zapisano ustawienia'),
              onError:   () => toast.error('Błąd zapisu')
            });
          }}
        >
          <label>
            Czas lekcji (min)
            <input
              type="number"
              min="1"
              value={form.lessonDuration}
              onChange={e => setForm(f=>({ ...f, lessonDuration:+e.target.value }))}
            />
          </label>

          <label>
            Czas krótkiej przerwy (min)
            <input
              type="number" min="0"
              value={form.shortBreakDuration}
              onChange={e => setForm(f=>({ ...f, shortBreakDuration:+e.target.value }))}
            />
          </label>

          <label>
            Czas długiej przerwy (min)
            <input
              type="number" min="0"
              value={form.longBreakDuration}
              onChange={e => setForm(f=>({ ...f, longBreakDuration:+e.target.value }))}
            />
          </label>

          <label>
            Po której lekcji dłuższa przerwa? (1–{form.periodsPerDay})
            <input
              type="number" min="1" max={form.periodsPerDay}
              value={form.longBreakAfter + 1}
              onChange={e => setForm(f=>({ ...f, longBreakAfter: +e.target.value -1 }))}
            />
          </label>

          <label>
            Ilość lekcji na dzień
            <input
              type="number" min="1"
              value={form.periodsPerDay}
              onChange={e => setForm(f=>({ ...f, periodsPerDay:+e.target.value }))}
            />
          </label>

          <div className="mls-actions">
            <button type="submit" className="btn btn-primary">
              <FaSave /> Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}