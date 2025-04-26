import React, { useState } from 'react';
 import { useNavigate, NavLink } from 'react-router-dom';
 import useAuth from './useAuth';
 import './Auth.css';
 
 export default function LoginPage() {
   const { login } = useAuth();
   const navigate = useNavigate();
 
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
 
   const handleSubmit = async e => {
     e.preventDefault();
     setError('');
     try {
       await login(email, password);
       navigate('/panel');
     } catch (err) {
       setError(err.response?.data?.error || 'Błąd logowania');
     }
   };
 
   return (
     <div className="auth-container">
       <form className="auth-form" onSubmit={handleSubmit}>
         <h2>Logowanie</h2>
         {error && <div className="auth-error">{error}</div>}
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
             required
           />
         </label>
         <button type="submit" className="btn-primary">
           Zaloguj się
         </button>
         <p className="auth-switch">
           Nie masz konta? <NavLink to="/register">Zarejestruj się</NavLink>
         </p>
       </form>
     </div>
   );
 }