import React from 'react';
import './howitworks.css';

export default function HowItWorks() {
  const steps = [
    { icon: 'fa-upload', title: 'Importuj dane', desc: 'Dodaj klasy, przedmioty i nauczycieli.' },
    { icon: 'fa-robot', title: 'Generuj plan', desc: 'Kliknij, a AI zrobi resztę.' },
    { icon: 'fa-pencil-alt', title: 'Dopasuj manualnie', desc: 'Przesuń lekcje jednym kliknięciem.' },
    { icon: 'fa-file-export', title: 'Eksportuj', desc: 'Pobierz PDF lub CSV.' }
  ];

  return (
    <section className="how-it-works section">
      <h2>Jak to działa?</h2>
      <div className="steps">
        {steps.map((s, i) => (
          <div key={i} className="step-card">
            <i className={`fa-solid ${s.icon} step-icon`}></i>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
