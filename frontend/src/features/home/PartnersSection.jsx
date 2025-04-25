import React from 'react';
import './partners.css';

const partners = [
  '/partners/partner1.png',
  '/partners/partner2.png',
  '/partners/partner3.png',
  '/partners/partner4.png'
];

export default function PartnersSection() {
  return (
    <section className="partners section" id="partners">
      <h2>Zaufali nam (prawie)</h2>
      <div className="partners-grid">
        {partners.map((src, i) => (
          <div key={i} className="partner-logo">
            <img src={src} alt={`Partner ${i + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
