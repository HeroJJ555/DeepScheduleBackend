import React, { useState } from 'react';
import {
  useRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom
} from './useRooms';
import RoomForm from './RoomForm';

export default function RoomsPage()
{
  const { data: rooms = [], isLoading } = useRooms();
  const create = useCreateRoom();
  const update = useUpdateRoom();
  const remove = useDeleteRoom();

  const [editing, setEditing]   = useState(null);
  const [creating, setCreating] = useState(false);

  if (isLoading) return <p>Ładowanie sal…</p>;

  return (
    <section className="section">
      <h2>Sale</h2>
      <button className="btn-primary" onClick={()=>{ setCreating(true); setEditing(null); }}>
        + Nowa sala
      </button>

      {(creating||editing) && (
        <RoomForm
          initial={editing||{}}
          onSubmit={data=>{
            const fn = data.id ? update.mutate : create.mutate;
            fn(data, { onSuccess: ()=>{ setCreating(false); setEditing(null); }});
          }}
          onCancel={()=>{ setCreating(false); setEditing(null); }}
        />
      )}

      <table className="data-table">
        <thead><tr><th>Nazwa</th><th>Pojemność</th><th>Akcje</th></tr></thead>
        <tbody>
          {rooms.map(r=>(
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.capacity ?? '-'}</td>
              <td>
                <button className="btn-secondary" onClick={()=>{ setEditing(r); setCreating(false); }}>
                  Edytuj
                </button>
                <button className="btn-delete" onClick={()=>remove.mutate(r.id)}>
                  Usuń
                </button>
              </td>
            </tr>
          ))}
          {rooms.length===0 && (
            <tr><td colSpan="3" style={{textAlign:'center'}}>Brak sal</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}