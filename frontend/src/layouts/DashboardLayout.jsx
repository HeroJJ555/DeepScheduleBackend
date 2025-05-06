// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSchools } from '../features/schools/useSchools';
import CreateSchoolModal from '../features/schools/CreateSchoolModal';
import './DashboardLayout.css';

export default function DashboardLayout()
{
  const { data: schools = [], isLoading } = useSchools();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="ds-dashboard">
      <aside className="ds-sidebar">
        {/* --- Sekcja Szkoły --- */}
        <div className="ds-sidebar-section">
          <h4 className="ds-section-title">Szkoły</h4>
          <button
            className="ds-btn-new"
            onClick={() => setShowCreate(true)}
          >
            <i className="fa-solid fa-plus"></i>
            Utwórz szkołę
          </button>

          {isLoading ? (
            <p className="ds-loading">Ładowanie szkół…</p>
          ) : schools.length === 0 ? (
            <p className="ds-empty">Brak szkół</p>
          ) : (
            <nav className="ds-school-list">
              {schools.map(s => (
                <NavLink
                  key={s.id}
                  to={`/panel/schools/${s.id}`}
                  className={({ isActive }) =>
                    isActive ? 'ds-nav-link active' : 'ds-nav-link'
                  }
                >
                  <i className="fa-solid fa-school"></i>
                  <span className="ds-nav-text">{s.name}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* --- Sekcja Panel --- */}
        <div className="ds-sidebar-section">
          <h4 className="ds-section-title">Panel</h4>
          <NavLink
            to="/panel/profile"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-user-circle"></i>
            <span className="ds-nav-text">Profil</span>
          </NavLink>
          <NavLink
            to="/panel/announcements"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-bullhorn"></i>
            <span className="ds-nav-text">Ogłoszenia</span>
          </NavLink>
          <NavLink
            to="/panel/changelog"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-list"></i>
            <span className="ds-nav-text">ChangeLog</span>
          </NavLink>
          <NavLink
            to="/wiki"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-book-open"></i>
            <span className="ds-nav-text">Wiki</span>
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-headset"></i>
            <span className="ds-nav-text">Support</span>
          </NavLink>
        </div>
      </aside>

      <main className="ds-dashboard-content">
        <Outlet />
      </main>

      <CreateSchoolModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}