import React from 'react';
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
           <details key={i} className="faq-item">
             <summary><i className="fa-solid fa-question-circle"></i> {item.q}</summary>
             <p>{item.a}</p>
           </details>
         ))}
       </div>
     </section>
   );
 }