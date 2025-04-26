import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import './ProfilePage.css';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updateError, setUpdateError] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSchool, setInviteSchool] = useState('');
  const [inviteRole, setInviteRole] = useState('TEACHER');
  const [inviteMsg, setInviteMsg] = useState('');
  const [inviteError, setInviteError] = useState('');

  useEffect(() => {
    api.get('/users/me')
      .then(res => {
        setUser(res.data);
        setName(res.data.name);
        if (res.data.schools.length > 0) {
          setInviteSchool(res.data.schools[0].school.id);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdateMsg('');
    setUpdateError('');
    try {
      const res = await api.put('/users/me', { name, ...(password && { password }) });
      setUser(res.data);
      setUpdateMsg('Profil zaktualizowany');
      setPassword('');
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Błąd aktualizacji');
    }
  };

  const handleInvite = async e => {
    e.preventDefault();
    setInviteMsg('');
    setInviteError('');
    try {
      await api.post('/users/invite', {
        email: inviteEmail,
        role: inviteRole,
        schoolId: inviteSchool
      });
      setInviteMsg(`Zaproszenie wysłane do ${inviteEmail}`);
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.response?.data?.error || 'Błąd wysyłania zaproszenia');
    }
  };

  if (!user) {
    return <p>Ładowanie danych profilu…</p>;
  }

  return (
    <div className="profile-container">
      <section className="profile-section">
        <h2>Moje konto</h2>
        <form className="profile-form" onSubmit={handleUpdate}>
          <label>
            Email
            <input type="email" value={user.email} disabled />
          </label>
          <label>
            Imię i nazwisko
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Nowe hasło
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Pozostaw puste, by nie zmieniać"
            />
          </label>
          {updateError && <div className="profile-error">{updateError}</div>}
          {updateMsg   && <div className="profile-success">{updateMsg}</div>}
          <button type="submit" className="profile-btn">Zapisz zmiany</button>
        </form>
      </section>

      <section className="invite-section">
        <h2>Zaproszenie użytkownika</h2>
        {user.schools.length === 0 ? (
          <p>Nie masz przypisanych żadnych szkół – nie możesz zapraszać użytkowników.</p>
        ) : (
          <form className="invite-form" onSubmit={handleInvite}>
            <label>
              Email użytkownika
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Szkoła
              <select
                value={inviteSchool}
                onChange={e => setInviteSchool(e.target.value)}
              >
                {user.schools.map(s => (
                  <option key={s.school.id} value={s.school.id}>
                    {s.school.name} ({s.role.toLowerCase()})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Rola
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
              >
                <option value="TEACHER">Nauczyciel</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </label>
            {inviteError && <div className="profile-error">{inviteError}</div>}
            {inviteMsg   && <div className="profile-success">{inviteMsg}</div>}
            <button type="submit" className="profile-btn">Wyślij zaproszenie</button>
          </form>
        )}
      </section>
    </div>
  );
}
