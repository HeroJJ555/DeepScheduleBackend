// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { useSchools } from '../features/schools/useSchools';
import CreateSchoolModal from '../features/schools/CreateSchoolModal';
import ManageRoomsModal from '../features/rooms/ManageRoomsModal';
import ManageClassesModal from '../features/classes/ManageClassesModal';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const { data: schools = [], isLoading } = useSchools();
  const { schoolId } = useParams();
  const [showCreate, setShowCreate] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [showClasses, setShowClasses] = useState(false);

  const sid = Number(schoolId);

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
            <i className="fa-solid fa-plus" />
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
                  <i className="fa-solid fa-school" />
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
            <i className="fa-solid fa-user-circle" />
            <span className="ds-nav-text">Profil</span>
          </NavLink>
          <NavLink
            to="/panel/announcements"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-bullhorn" />
            <span className="ds-nav-text">Ogłoszenia</span>
          </NavLink>
          <NavLink
            to="/panel/changelog"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-list" />
            <span className="ds-nav-text">ChangeLog</span>
          </NavLink>
          <NavLink
            to="/wiki"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-book-open" />
            <span className="ds-nav-text">Wiki</span>
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              isActive ? 'ds-nav-link active' : 'ds-nav-link'
            }
          >
            <i className="fa-solid fa-headset" />
            <span className="ds-nav-text">Support</span>
          </NavLink>
        </div>

        {/* --- Sekcja Zarządzanie --- */}
        {sid > 0 && (
          <div className="ds-sidebar-section">
            <h4 className="ds-section-title">Zarządzanie</h4>
            <button
              className="ds-nav-link"
              onClick={() => setShowRooms(true)}
            >
              <i className="fa-solid fa-door-open" />
              <span className="ds-nav-text">Sale</span>
            </button>
            <button
              className="ds-nav-link"
              onClick={() => setShowClasses(true)}
            >
              <i className="fa-solid fa-chalkboard" />
              <span className="ds-nav-text">Klasy</span>
            </button>
          </div>
        )}
      </aside>

      <main className="ds-dashboard-content">
        <Outlet />
      </main>

      <CreateSchoolModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* Sale */}
      <ManageRoomsModal
        schoolId={sid}
        subjects={[]}           // TODO: przekazać prawdziwe przedmioty
        isOpen={showRooms}
        onClose={() => setShowRooms(false)}
      />

      {/* Klasy */}
      <ManageClassesModal
        schoolId={sid}
        subjects={[]}           // TODO: przekazać prawdziwe przedmioty
        teachers={[]}           // TODO: przekazać prawdziwych nauczycieli
        isOpen={showClasses}
        onClose={() => setShowClasses(false)}
      />
    </div>
  );
}
