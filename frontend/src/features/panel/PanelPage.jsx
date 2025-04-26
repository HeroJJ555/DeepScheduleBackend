import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PanelPage.css';

export default function PanelPage() {
  const nav = useNavigate();

  const cards = [
    {
      title: 'Profil',
      icon: 'fa-solid fa-user-circle',
      action: () => nav('/panel/profile')
    },
    {
      title: 'Ogłoszenia',
      icon: 'fa-solid fa-bullhorn',
      action: () => nav('/panel/announcements')
    },
    {
      title: 'ChangeLog',
      icon: 'fa-solid fa-list',
      action: () => nav('/panel/changelog')
    },
    {
      title: 'Wiki',
      icon: 'fa-solid fa-book-open',
      action: () => nav('/wiki')
    }
  ];

  return (
    <section className="panel section">
      <h2>Panel użytkownika</h2>
      <div className="panel-grid">
        {cards.map((c, i) => (
          <div
            key={i}
            className="panel-card"
            onClick={c.action}
            role="button"
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' && c.action())}
          >
            <i className={`${c.icon} panel-icon`}></i>
            <h3>{c.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
