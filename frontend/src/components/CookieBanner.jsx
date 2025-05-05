import React, { useState, useEffect } from 'react';
import './cookieBanner.css';

export default function CookieBanner()
{
  const [visible, setVisible] = useState(false);
  //Hook zdefiniowany w celu animacji panelu z ciasteczkami
  const [render, setRender] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === null)
    {
      setRender(true);
      setTimeout(() => setVisible(true), 50);
    }
  }, []);

  const handleClose = (type) => {
    localStorage.setItem('cookieConsent', type);
    setVisible(false);
    setTimeout(() => setRender(false), 400);
  };

  if (!render) return null;

  return (
    <div className={`cookie-banner ${visible ? 'show' : 'hide'}`}>
      <p>
        Nasza strona używa plików cookie w celu poprawy doświadczeń użytkownika.
      </p>
      <div className="cookie-actions">
        <button className="btn-primary" onClick={() => handleClose('accepted')}>
          Akceptuję
        </button>
        <button className="btn-secondary" onClick={() => handleClose('declined')}>
          Odrzucam
        </button>
        <a href="/privacy" className="cookie-link">
          Polityka prywatności
        </a>
      </div>
    </div>
  );
}