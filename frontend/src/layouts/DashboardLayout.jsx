import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import api from '../api/client';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/schools').then(res => {
      setSchools(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="ds-dashboard">
      <aside className="ds-sidebar">
        {/* Sekcja Szkoły */}
        <div className="ds-sidebar-section">
          <h4 className="ds-section-title">Szkoły</h4>
          <button
            className="ds-btn-new"
            onClick={() => navigate('/panel/schools/new')}
          >
            <i className="fa-solid fa-plus"></i>
            Utwórz szkołę
          </button>
          {loading ? (
            <p className="ds-loading">Ładowanie…</p>
          ) : schools.length === 0 ? (
            <p className="ds-empty">Brak szkół</p>
          ) : (
            <nav className="ds-school-list">
              {schools.map(s => (
                <NavLink
                  to={`/panel/schools/${s.id}/classes`}
                  key={s.id}
                  className="ds-nav-link"
                >
                  <i className="fa-solid fa-school"></i>
                  {s.name}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Inne linki panelu */}
        <div className="ds-sidebar-section">
          <h4 className="ds-section-title">Panel</h4>
          <NavLink to="/panel/profile" className="ds-nav-link">
            <i className="fa-solid fa-user-circle"></i> Profil
          </NavLink>
          <NavLink to="/panel/announcements" className="ds-nav-link">
            <i className="fa-solid fa-bullhorn"></i> Ogłoszenia
          </NavLink>
          <NavLink to="/panel/changelog" className="ds-nav-link">
            <i className="fa-solid fa-list"></i> ChangeLog
          </NavLink>
          <NavLink to="/wiki" className="ds-nav-link">
            <i className="fa-solid fa-book-open"></i> Wiki
          </NavLink>
          <NavLink to="/support" className="ds-nav-link">
            <i className="fa-solid fa-headset"></i> Support
          </NavLink>
        </div>
      </aside>

      <main className="ds-dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
