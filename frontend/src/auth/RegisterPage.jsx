import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
 
export default function RegisterPage()
{
  const navigate = useNavigate();
 
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
 
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try
    {
      await axios.post('/api/auth/register', { email, password, name });
      setSuccess('Rejestracja udana! Teraz się zaloguj.');
      setEmail(''); setPassword(''); setName('');
      // navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Błąd rejestracji');
    }
  };
 
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Rejestracja</h2>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
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
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Hasło
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="btn-primary">
          Zarejestruj się
        </button>
        <p className="auth-switch">
          Masz już konto? <NavLink to="/login">Zaloguj się</NavLink>
        </p>
      </form>
    </div>
  );
}