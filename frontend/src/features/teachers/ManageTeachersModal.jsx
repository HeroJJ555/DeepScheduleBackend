// src/features/teachers/ManageTeachersModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  FaUserTie,
  FaBook,
  FaClock,
  FaTrash,
  FaSave,
  FaPlus,
} from "react-icons/fa";
import Select from "react-select";
import "./manageTeachersModal.css";
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "./useTeachers";
import { toast } from "react-toastify";

export default function ManageTeachersModal({
  schoolId,
  subjects = [],
  timeslots = [],
  lessonSettings,
  isOpen,
  onClose,
}) {
  // pobieramy nauczycieli i sloty zawsze
  const { data: teachers = [], isLoading } = useTeachers(schoolId);
  const createT = useCreateTeacher(schoolId);
  const updateT = useUpdateTeacher(schoolId);
  const deleteT = useDeleteTeacher(schoolId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    subjectIds: [],
    workload: 0,
    timeslotIds: [],
  });

  // generujemy etykiety okresów na podstawie lessonSettings
  const periodLabels = useMemo(() => {
    if (!lessonSettings) return [];
    const {
      lessonDuration,
      shortBreakDuration,
      longBreakDuration,
      longBreakAfter,
      periodsPerDay,
    } = lessonSettings;

    let labels = [];
    let current = 8 * 60; // start o 08:00
    for (let i = 0; i < periodsPerDay; i++) {
      const h1 = Math.floor(current / 60),
        m1 = current % 60;
      const end = current + lessonDuration;
      const h2 = Math.floor(end / 60),
        m2 = end % 60;
      labels.push(
        `${String(h1).padStart(2, "0")}:${String(m1).padStart(2, "0")}` +
          "–" +
          `${String(h2).padStart(2, "0")}:${String(m2).padStart(2, "0")}`
      );
      current =
        end + (i === longBreakAfter ? longBreakDuration : shortBreakDuration);
    }
    return labels;
  }, [lessonSettings]);

  // debug – zobacz co mamy za dane
  useEffect(() => {
    if (isOpen) {
      console.log("🕒 periodLabels:", periodLabels);
      console.log("🕒 timeslots:", timeslots);
      setEditing(false);
      setForm({
        id: null,
        name: "",
        subjectIds: [],
        workload: 0,
        timeslotIds: [],
      });
    }
  }, [isOpen, periodLabels, timeslots]);

  const startEdit = (t) => {
    setEditing(true);
    setForm({
      id: t.id,
      name: t.name,
      workload: t.workload || 0,
      subjectIds: t.teacherSubjects.map((ts) => ts.subject.id),
      timeslotIds: t.availabilities.map((a) => a.timeslot.id),
    });
  };

  const toggleSlot = (slotId) => {
    setForm((f) => {
      const has = f.timeslotIds.includes(slotId);
      return {
        ...f,
        timeslotIds: has
          ? f.timeslotIds.filter((x) => x !== slotId)
          : [...f.timeslotIds, slotId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fn = editing ? updateT : createT;
    fn.mutate(form, {
      onSuccess: () => {
        toast.success(editing ? "Zapisano zmiany" : "Dodano nauczyciela");
        setEditing(false);
        setForm({
          id: null,
          name: "",
          subjectIds: [],
          workload: 0,
          timeslotIds: [],
        });
      },
      onError: (err) => toast.error(err.response?.data?.error || "Błąd"),
    });
  };

  const handleDelete = () => {
    deleteT.mutate(form.id, {
      onSuccess: () => {
        toast.success("Usunięto nauczyciela");
        setEditing(false);
        setForm({
          id: null,
          name: "",
          subjectIds: [],
          workload: 0,
          timeslotIds: [],
        });
      },
      onError: (err) => toast.error(err.response?.data?.error || "Błąd"),
    });
  };

  if (!isOpen) return null;
  return (
    <div className="mtm-overlay" onClick={onClose}>
      <div className="mtm-modal" onClick={(e) => e.stopPropagation()}>
        <header className="mtm-header">
          <h3>
            <FaUserTie /> {editing ? "Edytuj nauczyciela" : "Dodaj nauczyciela"}
          </h3>
          <button className="mtm-close" onClick={onClose}>
            ×
          </button>
        </header>
        <form className="mtm-form" onSubmit={handleSubmit}>
          {/* Imię */}
          <div className="mtm-row">
            <label>
              <FaUserTie /> Imię i nazwisko
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Przedmioty */}
          <div className="mtm-row">
            <label>
              <FaBook /> Przedmioty
            </label>
            <Select
              isMulti
              options={subjects.map((s) => ({
                label: s.name,
                value: s.id,
              }))}
              value={subjects
                .filter((s) => form.subjectIds.includes(s.id))
                .map((s) => ({ label: s.name, value: s.id }))}
              onChange={(opts) =>
                setForm((f) => ({
                  ...f,
                  subjectIds: opts.map((o) => o.value),
                }))
              }
            />
          </div>

          {/* Etat */}
          <div className="mtm-row">
            <label>
              <FaClock /> Etat (godz./tydz.)
            </label>
            <input
              type="number"
              min="0"
              value={form.workload}
              onChange={(e) =>
                setForm((f) => ({ ...f, workload: +e.target.value }))
              }
            />
          </div>

          {/* Tabela dostępności */}
          <div className="mtm-availability">
            <span>Dostępność w tygodniu</span>
            <table className="mtm-table">
              <thead>
                <tr>
                  <th>Okres</th>
                  {["Pn", "Wt", "Śr", "Cz", "Pt"].map((d, i) => (
                    <th key={i}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periodLabels.map((label, idx) => (
                  <tr key={idx}>
                    <td className="mtm-time">{label}</td>
                    {[0, 1, 2, 3, 4].map((day) => {
                      const slot = timeslots.find(
                        (t) => t.day === day && t.hour === idx
                      );
                      const selected =
                        slot && form.timeslotIds.includes(slot.id);
                      const cellCls = !slot
                        ? "disabled"
                        : selected
                        ? "selected"
                        : "";
                      return (
                        <td
                          key={day}
                          className={cellCls}
                          onClick={() => slot && toggleSlot(slot.id)}
                          title={
                            slot
                              ? selected
                                ? "Kliknij, aby odznaczyć"
                                : "Kliknij, aby zaznaczyć"
                              : "Brak slotu"
                          }
                        >
                          {selected && <span className="mtm-check">✓</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Przyciski */}
          <div className="mtm-actions">
            <button type="submit" className="btn btn-primary">
              {editing ? (
                <>
                  <FaSave /> Zapisz
                </>
              ) : (
                <>
                  <FaPlus /> Dodaj
                </>
              )}
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

        {/* Lista nauczycieli */}
        <footer className="mtm-footer">
          <h4>Lista nauczycieli</h4>
          <ul className="mtm-list">
            {isLoading ? (
              <li>Ładowanie…</li>
            ) : (
              teachers.map((t) => (
                <li key={t.id} onClick={() => startEdit(t)}>
                  {t.name} ({t.workload}h)
                </li>
              ))
            )}
          </ul>
        </footer>
      </div>
    </div>
  );
}
