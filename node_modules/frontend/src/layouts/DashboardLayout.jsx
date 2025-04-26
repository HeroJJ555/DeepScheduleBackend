import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import api from '../api/client';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/schools').then(res => {
      setSchools(res.data);
      setLoading(false);
      if (res.data.length > 0) {
        setSelectedSchoolId(res.data[0].id);
      }
    });
  }, []);

  const handleSchoolChange = e => {
    const id = Number(e.target.value);
    setSelectedSchoolId(id);
    navigate(`/schools/${id}/classes`);
  };

  return (
    <div className="ds-dashboard">
      <aside className="ds-sidebar">
        {/* Fala SVG */}
        <div className="ds-sidebar-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path
              fill="#1f1f3f"
              d="M0,32 C360,80 1080,0 1440,48 L1440,0 L0,0 Z"
            />
          </svg>
        </div>

        {loading ? (
          <p className="ds-loading">Ładowanie szkół…</p>
        ) : schools.length === 0 ? (
          <div className="ds-no-schools">
            <p>Nie masz jeszcze żadnej szkoły.</p>
            <button
              className="ds-btn-primary"
              onClick={() => navigate('/schools')}
            >
              Utwórz szkołę
            </button>
          </div>
        ) : (
          <>
            <div className="ds-school-select-wrapper">
              <i className="fa-solid fa-school ds-school-icon"></i>
              <select
                id="ds-school-select"
                className="ds-school-select"
                value={selectedSchoolId}
                onChange={handleSchoolChange}
              >
                {schools.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <nav className="ds-sidebar-nav">
              <NavLink
                to={`/schools/${selectedSchoolId}/classes`}
                className="ds-nav-link"
              >
                <i className="fa-solid fa-chalkboard-user"></i>
                Klasy
              </NavLink>
              <NavLink
                to={`/schools/${selectedSchoolId}/teachers`}
                className="ds-nav-link"
              >
                <i className="fa-solid fa-user-tie"></i>
                Nauczyciele
              </NavLink>
              <NavLink
                to={`/schools/${selectedSchoolId}/rooms`}
                className="ds-nav-link"
              >
                <i className="fa-solid fa-door-open"></i>
                Sale
              </NavLink>
              <NavLink
                to={`/schools/${selectedSchoolId}/timeslots`}
                className="ds-nav-link"
              >
                <i className="fa-solid fa-clock"></i>
                Sloty
              </NavLink>
              <button
                className="ds-nav-action"
                onClick={() => navigate('/generate')}
              >
                <i className="fa-solid fa-gear"></i>
                Generuj plan
              </button>
              <NavLink to="/timetable" className="ds-nav-link">
                <i className="fa-solid fa-calendar-alt"></i>
                Zobacz plan
              </NavLink>
            </nav>
          </>
        )}
      </aside>

      <main className="ds-dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
