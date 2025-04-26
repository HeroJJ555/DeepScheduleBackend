import React, { useState } from 'react';
import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass
} from './useClasses';
import ClassForm from './ClassForm';

export default function ClassesPage() {
  const { data: classes = [], isLoading } = useClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const [editing, setEditing]   = useState(null);
  const [creating, setCreating] = useState(false);

  if (isLoading) return <p>Ładowanie klas…</p>;

  return (
    <section className="section">
      <h2>Klasy</h2>
      <button
        className="btn-primary"
        onClick={() => { setCreating(true); setEditing(null); }}
      >
        + Nowa klasa
      </button>

      {(creating || editing) && (
        <ClassForm
          initial={editing || {}}
          onSubmit={data => {
            const fn = data.id ? updateClass.mutate : createClass.mutate;
            fn(data, { onSuccess: () => { setCreating(false); setEditing(null); } });
          }}
          onCancel={() => { setCreating(false); setEditing(null); }}
        />
      )}

      <table className="data-table">
        <thead><tr><th>Nazwa</th><th>Akcje</th></tr></thead>
        <tbody>
          {classes.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>
                <button className="btn-secondary" onClick={() => { setEditing(c); setCreating(false); }}>
                  Edytuj
                </button>
                <button className="btn-delete" onClick={() => deleteClass.mutate(c.id)}>
                  Usuń
                </button>
              </td>
            </tr>
          ))}
          {classes.length===0 && (
            <tr><td colSpan="2" style={{ textAlign:'center' }}>Brak klas</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
