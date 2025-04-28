import React from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import './SchoolDashboardPage.css';

export default function SchoolDashboardPage() {
  const { schoolId } = useParams();
  const nav = useNavigate();

  const cards = [
    { title: 'Nauczyciele',       icon: 'fa-solid fa-user-tie',      path: `teachers` },
    { title: 'Przedmioty',        icon: 'fa-solid fa-book-open',     path: `subjects` },
    { title: 'Sale',              icon: 'fa-solid fa-door-open',     path: `rooms` },
    { title: 'Klasy',             icon: 'fa-solid fa-chalkboard',    path: `classes` },
    { title: 'Generuj plan',      icon: 'fa-solid fa-cogs',          path: `/panel/schools/${schoolId}/generate` },
    { title: 'Podgląd planu',     icon: 'fa-solid fa-calendar-alt',  path: `/panel/schools/${schoolId}/timetable` },
  ];

  return (
    <div className="school-dashboard">
      <h2>Szkoła #{schoolId}</h2>
      <div className="sd-card-grid">
        {cards.map((c, i) => (
          <div
            key={i}
            className="sd-card"
            onClick={() => {
              // ścieżki względne dla CRUD:
              if (!c.path.startsWith('/')) {
                nav(`/panel/schools/${schoolId}/${c.path}`);
              } else {
                nav(c.path);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && (
              c.path.startsWith('/') ? nav(c.path)
              : nav(`/panel/schools/${schoolId}/${c.path}`)
            )}
          >
            <i className={`${c.icon} sd-icon`}></i>
            <h3>{c.title}</h3>
          </div>
        ))}
      </div>

      {/* Tutaj zagnieżdżone trasy np. /teachers, /classes, /generate */}
      <Outlet />
    </div>
  );
}
