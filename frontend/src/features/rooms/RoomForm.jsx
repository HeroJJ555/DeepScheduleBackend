import React, { useState, useEffect } from 'react';

export default function RoomForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName]     = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    setName(initial.name || '');
    setCapacity(initial.capacity ?? '');
  }, [initial]);

  const handle = e => {
    e.preventDefault();
    onSubmit({ id: initial.id, name, capacity: capacity ? Number(capacity) : null });
  };

  return (
    <form className="form-card" onSubmit={handle}>
      <label>
        Nazwa sali
        <input type="text" value={name} onChange={e=>setName(e.target.value)} required />
      </label>
      <label>
        Pojemność
        <input type="number" value={capacity} onChange={e=>setCapacity(e.target.value)} />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn-primary">Zapisz</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
