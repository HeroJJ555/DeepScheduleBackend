import React, { useState } from 'react';
import {
  useTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher
} from './useTeachers';
import TeacherForm from './TeacherForm';

export default function TeachersPage() {
  const { data: teachers = [], isLoading } = useTeachers();
  const create = useCreateTeacher();
  const update = useUpdateTeacher();
  const remove = useDeleteTeacher();

  const [editing, setEditing]   = useState(null);
  const [creating, setCreating] = useState(false);

  if (isLoading) return <p>Ładowanie nauczycieli…</p>;

  return (
    <section className="section">
      <h2>Nauczyciele</h2>
      <button className="btn-primary" onClick={()=>{ setCreating(true); setEditing(null); }}>
        + Nowy nauczyciel
      </button>

      {(creating||editing) && (
        <TeacherForm
          initial={editing||{}}
          onSubmit={data=>{
            const fn = data.id ? update.mutate : create.mutate;
            fn(data,{ onSuccess: ()=>{ setCreating(false); setEditing(null);} });
          }}
          onCancel={()=>{ setCreating(false); setEditing(null);} }
        />
      )}

      <table className="data-table">
        <thead><tr><th>Imię i nazwisko</th><th>Email</th><th>Akcje</th></tr></thead>
        <tbody>
          {teachers.map(t=>(
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.email||'-'}</td>
              <td>
                <button className="btn-secondary" onClick={()=>{ setEditing(t); setCreating(false); }}>
                  Edytuj
                </button>
                <button className="btn-delete" onClick={()=>remove.mutate(t.id)}>
                  Usuń
                </button>
              </td>
            </tr>
          ))}
          {teachers.length===0 && (
            <tr><td colSpan="3" style={{textAlign:'center'}}>Brak nauczycieli</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
