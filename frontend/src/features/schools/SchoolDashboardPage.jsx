import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import ManageSubjectsModal from "../subjects/ManageSubjectsModal";
import { useSchool } from './useSchools';
import ManageSchoolModal from "./ManageSchoolModal";
import "./SchoolDashboardPage.css";

export default function SchoolDashboardPage() {
  const { schoolId } = useParams();
  const nav = useNavigate();
  const { data: school, isError, error } = useSchool(schoolId);
  useEffect(() => {
    if (isError && error?.response?.status === 404) {
      nav('/panel', { replace: true });
    }
  }, [isError, error, nav]);

  const [showSubjects, setShowSubjects] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const cards = [
    { title: "Nauczyciele", icon: "fa-solid fa-user-tie", path: "teachers" },
    { title: "Przedmioty", icon: "fa-solid fa-book-open", path: "subjects" },
    { title: "Sale", icon: "fa-solid fa-door-open", path: "rooms" },
    { title: "Klasy", icon: "fa-solid fa-chalkboard", path: "classes" },
    {
      title: "Generuj plan",
      icon: "fa-solid fa-table",
      path: `/panel/schools/${schoolId}/generate`,
    },
    {
      title: "Podgląd planu",
      icon: "fa-solid fa-calendar-alt",
      path: `/panel/schools/${schoolId}/timetable`,
    },
    {
      title: "Ustawienia szkoły",
      icon: "fa-solid fa-gears",
      path: "settings",
    },
  ];

  const handleCardClick = (card) => {
    if (card.path === "subjects") setShowSubjects(true);
    else if (card.path === "settings") setShowSettings(true);
    else {
      const to = card.path.startsWith("/")
        ? card.path
        : `/panel/schools/${schoolId}/${card.path}`;
      nav(to);
    }
  };

  return (
    <div className="school-dashboard">
      <header className="sd-header">
        <h2>Panel szkoły (ID: {schoolId})</h2>
      </header>

      <div className="sd-card-grid">
        {cards.map((c, i) => (
          <div
            key={i}
            className="sd-card"
            onClick={() => handleCardClick(c)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCardClick(c)}
          >
            <div className="sd-icon-wrapper">
              <i className={c.icon + " sd-icon"}></i>
            </div>
            <h3 className="sd-card-title">{c.title}</h3>
          </div>
        ))}
      </div>

      {/* Podstrony osadzone przez <Outlet> */}
      <Outlet />

      {/* Modal CRUD przedmiotów */}
      <ManageSubjectsModal
        schoolId={schoolId}
        isOpen={showSubjects}
        onClose={() => setShowSubjects(false)}
      />

      <ManageSchoolModal
        schoolId={schoolId}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
