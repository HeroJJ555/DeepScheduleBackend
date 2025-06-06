import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import "./Navbar.css";

export default function Navbar()
{
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();    //animacja wylogowania???
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="nav-logo">
          {" "}
          <img
            src="/logo.png" // ← używamy pliku z public/
            alt="DeepSchedule Logo"
            className="nav-logo-img"
          />
        </NavLink>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className="nav-link">
            Strona Główna
          </NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to="/login" className="nav-link">
                Logowanie
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="nav-link">
                Rejestracja
              </NavLink>
            </li>
          </>
        )}
        {user && (
          <>
            <li>
              <NavLink to="/panel" className="nav-link">
                Panel
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link btn-logout">
                Wyloguj
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
