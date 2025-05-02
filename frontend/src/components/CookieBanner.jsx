import React, { useState, useEffect } from 'react';
import './cookieBanner.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === null) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };
  const decline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className="cookie-banner">
      <p>
        Nasza strona używa plików cookie w celu poprawy doświadczeń użytkownika.
      </p>
      <div className="cookie-actions">
        <button className="btn-primary" onClick={accept}>
          Akceptuję
        </button>
        <button className="btn-secondary" onClick={decline}>
          Odrzucam
        </button>
        <a href="/privacy" className="cookie-link">
          Polityka prywatności
        </a>
      </div>
    </div>
  );
}
