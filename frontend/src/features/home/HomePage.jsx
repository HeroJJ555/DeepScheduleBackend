import React from "react";
 import { useNavigate } from "react-router-dom";
 import "./home.css";
 import HowItWorks from "./HowItWorks";
 import FAQSection from './FAQSection';
 import AboutSection from './AboutSection';
 import PartnersSection from './PartnersSection';
 
 export default function HomePage() {
   const nav = useNavigate();
   return (
     <div>
       <section className="hero">
         <div className="hero-content">
           <h1>DeepSchedule AI</h1>
           <p>
             Perfekcyjne plany lekcji generowane przez sztuczną inteligencję.
           </p>
           <div className="hero-buttons">
             <button className="btn-primary" onClick={() => nav("/login")}>
               Rozpocznij
             </button>
             <button
               className="btn-secondary"
               onClick={() =>
                 document
                   .getElementById("features")
                   .scrollIntoView({ behavior: "smooth" })
               }
             >
               Dowiedz się więcej
             </button>
           </div>
         </div>
         {/* fala SVG */}
         <div className="wave-container">
           <svg
             viewBox="0 0 1440 320"
             preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg"
           >
             <path
               fill="#ffffff"
               d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,160C672,171,768,213,864,213.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
             ></path>
           </svg>
         </div>
       </section>
 
       <section id="features" className="features section">
         <div className="feature-card">
           <i className="fas fa-robot feature-icon"></i>
           <h3>Automatyzacja</h3>
           <p>Generuj plan w kilka sekund, bez konfliktów.</p>
         </div>
         <div className="feature-card">
           <i className="fas fa-pencil-alt feature-icon"></i>
           <h3>Personalizacja</h3>
           <p>Przesuń lekcję w dowolny slot jednym kliknięciem.</p>
         </div>
         <div className="feature-card">
           <i className="fas fa-lock feature-icon"></i>
           <h3>Bezpieczeństwo</h3>
           <p>Dostęp tylko dla uprawnionych użytkowników.</p>
         </div>
       </section>
       <FAQSection />
       <AboutSection />
       <PartnersSection />
       {/*<HowItWorks />*/}
     </div>
     
   );
 }