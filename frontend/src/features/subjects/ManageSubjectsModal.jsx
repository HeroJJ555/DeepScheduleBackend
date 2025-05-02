import React, { useState, useEffect, useRef } from 'react';
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject
} from './useSubjects';
import './manageSubjectsModal.css';
import { toast } from 'react-toastify';

export default function ManageSubjectsModal({ schoolId, isOpen, onClose }) {
  // fetchujemy tylko jeśli isOpen === true
  const { data: subjects = [], isLoading } = useSubjects(schoolId, { enabled: isOpen });
  const createSubject = useCreateSubject(schoolId);
  const updateSubject = useUpdateSubject(schoolId);
  const deleteSubject = useDeleteSubject(schoolId);

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef(null);

  // focusujemy input dopiero, gdy modal się otworzy
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setNewName('');
      setEditingId(null);
      setEditingName('');
    }
  }, [isOpen]);

  const handleAdd = e => {
    e.preventDefault();
    if (!newName.trim()) return toast.error('Podaj nazwę przedmiotu');
    createSubject.mutate(
      { name: newName.trim() },
      {
        onSuccess: () => {
          toast.success('Przedmiot dodany');
          setNewName('');
        },
        onError: err => {
          toast.error(err.response?.data?.error || 'Błąd dodawania');
        }
      }
    );
  };

  const startEdit = subj => {
    setEditingId(subj.id);
    setEditingName(subj.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleEdit = id => {
    if (!editingName.trim()) return toast.error('Nazwa nie może być pusta');
    updateSubject.mutate(
      { id, name: editingName.trim() },
      {
        onSuccess: () => {
          toast.success('Przedmiot zaktualizowany');
          cancelEdit();
        },
        onError: err => {
          toast.error(err.response?.data?.error || 'Błąd aktualizacji');
        }
      }
    );
  };

  const handleDelete = id => {
    if (window.confirm('Usunąć ten przedmiot?')) {
      deleteSubject.mutate(id, {
        onSuccess: () => toast.success('Przedmiot usunięty'),
        onError: err => toast.error(err.response?.data?.error || 'Błąd usuwania')
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="msm-overlay" onClick={onClose}>
      <div className="msm-modal" onClick={e => e.stopPropagation()}>
        <header className="msm-header">
          <h3>Zarządzaj przedmiotami</h3>
          <button className="msm-close" onClick={onClose}>×</button>
        </header>

        <form className="msm-add-form" onSubmit={handleAdd}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Nowy przedmiot"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            <i className="fa-solid fa-plus"></i>
          </button>
        </form>

        {isLoading ? (
          <p className="msm-loading">Ładowanie…</p>
        ) : (
          <ul className="msm-list">
            {subjects.map(subj => (
              <li key={subj.id} className="msm-item">
                {editingId === subj.id ? (
                  <>
                    <input
                      className="msm-edit-input"
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                    />
                    <button
                      className="icon-button"
                      onClick={() => handleEdit(subj.id)}
                      title="Zapisz"
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button
                      className="icon-button"
                      onClick={cancelEdit}
                      title="Anuluj"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="msm-name">{subj.name}</span>
                    <div className="msm-actions">
                      <button
                        className="icon-button"
                        onClick={() => startEdit(subj)}
                        title="Edytuj"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => handleDelete(subj.id)}
                        title="Usuń"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
