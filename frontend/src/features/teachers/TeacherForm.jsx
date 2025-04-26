import React, { useState, useEffect } from 'react';

export default function TeacherForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setName(initial.name || '');
    setEmail(initial.email || '');
  }, [initial]);

  const handle = e => {
    e.preventDefault();
    onSubmit({ id: initial.id, name, email });
  };

  return (
    <form className="form-card" onSubmit={handle}>
      <label>
        Imię i nazwisko
        <input
          type="text"
          value={name}
          onChange={e=>setName(e.target.value)}
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
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
