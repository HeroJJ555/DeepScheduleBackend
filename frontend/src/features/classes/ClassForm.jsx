import React, { useState, useEffect } from 'react';

export default function ClassForm({ initial = {}, onSubmit, onCancel })
{
  const [name, setName] = useState('');

  useEffect(() => {
    setName(initial.name || '');
  }, [initial]);

  const handle = e => {
    e.preventDefault();
    onSubmit({ id: initial.id, name });
  };

  return (
    <form className="form-card" onSubmit={handle}>
      <label>
        Nazwa klasy
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
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