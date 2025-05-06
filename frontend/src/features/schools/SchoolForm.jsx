import React, { useState, useEffect } from 'react';

/**
 * Props:
 *  - initial: { id?, name, address, city }
 *  - onSubmit: fn({ id?, name, address, city })
 *  - onCancel: fn()
 */
export default function SchoolForm({ initial = {}, onSubmit, onCancel })
{
  const [name, setName]       = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity]       = useState('');

  useEffect(() => {
    setName(initial.name || '');
    setAddress(initial.address || '');
    setCity(initial.city || '');
  }, [initial]);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ id: initial.id, name, address, city });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <label>
        Nazwa
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Adres
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </label>
      <label>
        Miasto
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Zapisz
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}