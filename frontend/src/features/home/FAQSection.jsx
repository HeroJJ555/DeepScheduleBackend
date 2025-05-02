import React, { useState, useRef, useEffect } from 'react';
import './faq.css';

const faqs = [
  {
    q: 'Czy mogę wygenerować plan dla wielu szkół?',
    a: 'Tak — Twoje konto może mieć przypisane wiele szkół i generować plany niezależnie dla każdej z nich.'
  },
  {
    q: 'Jak często mogę zmieniać wygenerowany plan?',
    a: 'W każdej chwili, manualnie za pomocą sekcji “entries” lub generując nowy plan od zera.'
  },
  {
    q: 'Czy mogę eksportować plan do PDF?',
    a: 'Tak — wkrótce dodamy możliwość eksportu do PDF i CSV bezpośrednio z interfejsu.'
  },
  {
    q: 'Czy dane są bezpieczne?',
    a: 'Cały ruch jest szyfrowany HTTPS, a dostęp chroniony JWT. Hasła są hashowane bcryptem.'
  }
];

export default function FAQSection() {
  return (
    <section className="faq section" id="faq">
      <h2>FAQ</h2>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <FaqItem key={i} question={item.q} answer={item.a} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(open
        ? `${contentRef.current.scrollHeight}px`
        : '0px'
      );
    }
  }, [open]);

  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <i className="fa-solid fa-question-circle" style="font-size:1.5rem"></i>
        {question}
        <span className={`faq-icon ${open ? 'open' : ''}`}>
          {open ? '−' : '+'}
        </span>
      </button>
      <div
        className="faq-answer-wrapper"
        style={{ maxHeight }}
      >
        <p ref={contentRef} className="faq-answer">
          {answer}
        </p>
      </div>
    </div>
  );
}
