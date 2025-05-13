// frontend/src/features/rooms/ManageRoomsModal.jsx
import React, { useState, useEffect } from 'react';
import { FaDoorOpen, FaBook, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
} from './useRooms';
import './manageRoomsModal.css';

export default function ManageRoomsModal({ schoolId, subjects = [], isOpen, onClose }) {
  const { data: rooms = [], isLoading } = useRooms(schoolId, { enabled: isOpen });
  const createRoom = useCreateRoom(schoolId);
  const updateRoom = useUpdateRoom(schoolId);
  const deleteRoom = useDeleteRoom(schoolId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: '',
    subjectIds: [],
  });

  useEffect(() => {
    if (isOpen) {
      setEditing(false);
      setForm({ id: null, name: '', subjectIds: [] });
    }
  }, [isOpen]);

  if (!isOpen) return null;
  if (isLoading) {
    return (
      <div className="rm-overlay" onClick={onClose}>
        <div className="rm-modal" onClick={e => e.stopPropagation()}>
          <p>Ładowanie sal…</p>
        </div>
      </div>
    );
  }

  const startEdit = room => {
    setEditing(true);
    setForm({
      id: room.id,
      name: room.name,
      subjectIds: room.specialSubjects.map(s => s.id),
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      subjectIds: form.subjectIds,
    };
    if (editing) payload.id = form.id;

    const fn = editing ? updateRoom : createRoom;
    fn.mutate(payload, {
      onSuccess: resp => {
        toast.success(editing ? 'Zapisano salę' : 'Dodano salę');
        if (editing) {
          setForm({
            id: resp.id,
            name: resp.name,
            subjectIds: resp.specialSubjects.map(s => s.id),
          });
        } else {
          setForm({ id: null, name: '', subjectIds: [] });
        }
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd'),
    });
  };

  const handleDelete = () => {
    deleteRoom.mutate(form.id, {
      onSuccess: () => {
        toast.success('Usunięto salę');
        setEditing(false);
        setForm({ id: null, name: '', subjectIds: [] });
      },
      onError: err => toast.error(err.response?.data?.error || 'Błąd'),
    });
  };

  return (
    <div className="rm-overlay" onClick={onClose}>
      <div className="rm-modal" onClick={e => e.stopPropagation()}>
        <header className="rm-header">
          <h3>
            <FaDoorOpen /> {editing ? 'Edytuj salę' : 'Dodaj salę'}
          </h3>
          <button className="rm-close" onClick={onClose}>×</button>
        </header>

        <form className="rm-form" onSubmit={handleSubmit}>
          <div className="rm-row">
            <label><FaDoorOpen /> Nazwa sali</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="rm-row">
            <label><FaBook /> Przeznaczenie (przedmioty)</label>
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

          <div className="rm-actions">
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

        <footer className="rm-footer">
          <h4>Lista sal</h4>
          <ul className="rm-list">
            {rooms.map(r => (
              <li key={r.id} onClick={() => startEdit(r)}>
                {r.name} ({r.specialSubjects.map(s => s.name).join(', ') || '–'})
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}
