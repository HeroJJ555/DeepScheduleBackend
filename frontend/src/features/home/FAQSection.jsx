import React, { useState, useRef, useEffect } from 'react';
import './faq.css';

const faqs = [
  {
    q: 'Czy mogę wygenerować plan dla wielu szkół?',
    a: 'Tak! DeepSchedule pozwala przypisać do Twojego konta dowolną liczbę szkół. Dla każdej placówki możesz w dowolnym momencie wygenerować osobny, zoptymalizowany plan lekcji – bez konfliktów i ręcznego sprawdzania.'
  },
  {
    q: 'Jak często mogę zmieniać wygenerowany plan?',
    a: 'Plan możesz edytować w każdej chwili, korzystając z sekcji „Entries” lub po prostu wygenerować go od nowa. Nie ma ograniczeń czasowych – wykorzystaj DeepSchedule tak często, jak potrzebujesz aktualizacji.'
  },
  {
    q: 'Czy mogę eksportować plan do PDF/CSV?',
    a: 'Tak – wkrótce dodamy bezpośrednią funkcję eksportu planu do formatu PDF i CSV. Dzięki temu łatwo udostępnisz harmonogram online rodzicom, nauczycielom lub wstawisz go na stronę szkoły.'
  },
  {
    q: 'Czy dane są bezpieczne?',
    a: 'Oczywiście. Cały ruch odbywa się po protokole HTTPS, dostęp jest chroniony za pomocą bezpiecznego tokenu JWT, a hasła użytkowników są hashowane algorytmem bcrypt. Twoje plany lekcji są przechowywane w szyfrowanej bazie danych.'
  },
  {
    q: 'Czy mogę ręcznie edytować lekcje w planie?',
    a: 'Tak! Po wygenerowaniu planu możesz swobodnie przeciągać i upuszczać lekcje, zmieniać ich miejsce oraz przeglądać szczegóły nauczycieli i klas bez konieczności ponownego generowania planu.'
  },
  {
    q: 'Czy aplikacja wykrywa konflikty w planie?',
    a: 'Tak – system automatycznie wykrywa konflikty typu „nauczyciel w dwóch klasach jednocześnie” lub „brak sali” i ich unika podczas generowania planu.'
  },
  {
    q: 'Czy można ustawić ograniczenia dla nauczycieli lub klas?',
    a: 'Tak – możesz ustawić preferencje dotyczące dostępności nauczycieli, liczby godzin dziennie dla klas, a także blokady czasowe np. na zajęcia WF czy religii.'
  },
  {
    q: 'Jak długo trwa wygenerowanie planu?',
    a: 'W zależności od liczby klas i złożoności danych – zazwyczaj kilka do kilkunastu sekund. Informujemy na bieżąco o postępie i wyniku.'
  },
  {
    q: 'Czy muszę instalować coś na komputerze?',
    a: 'Nie, DeepSchedule działa w pełni online. Wystarczy przeglądarka internetowa – logujesz się i możesz korzystać z aplikacji z dowolnego urządzenia.'
  }
];

export default function FAQSection()
{
  return (
    <section
      className="faq section"
      id="faq"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h2>FAQ</h2>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <FaqItem key={i} question={item.q} answer={item.a} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ question, answer })
{
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current)
    {
      setMaxHeight(open
        ? `${contentRef.current.scrollHeight}px`
        : '0px'
      );
    }
  }, [open]);

  return (
    <div
      className="faq-item"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        className="faq-question"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        itemProp="name"
      >
        {question}
        <span className={`faq-icon ${open ? 'open' : ''}`}>
          {open ? '−' : '+'}
        </span>
      </button>
      <div
        className="faq-answer-wrapper"
        style={{ maxHeight }}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <p
          ref={contentRef}
          className="faq-answer"
          itemProp="text"
        >
          {answer}
        </p>
      </div>
    </div>
  );
}
