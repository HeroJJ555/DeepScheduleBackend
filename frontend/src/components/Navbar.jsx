import React from 'react';
 import { NavLink, useNavigate } from 'react-router-dom';
 import useAuth from '../auth/useAuth';
 import './Navbar.css';
 
 export default function Navbar() {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
 
   const handleLogout = () => {
     logout();
     navigate('/');
   };
 
   return (
     <nav className="navbar">
       <div className="navbar-brand">
         <NavLink to="/" className="nav-logo">DeepSchedule</NavLink>
       </div>
       <ul className="nav-links">
         <li>
           <NavLink to="/" className="nav-link">Home</NavLink>
         </li>
         {!user && (
           <>
             <li>
               <NavLink to="/login" className="nav-link">Login</NavLink>
             </li>
             <li>
               <NavLink to="/register" className="nav-link">Sign Up</NavLink>
             </li>
           </>
         )}
         {user && (
           <>
             <li>
               <NavLink to="/panel" className="nav-link">Panel</NavLink>
             </li>
             <li>
               <button onClick={handleLogout} className="nav-link btn-logout">
                 Logout
               </button>
             </li>
           </>
         )}
       </ul>
     </nav>
   );
 }