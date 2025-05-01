import React from 'react';
 import './about.css';
 
 export default function AboutSection() {
   return (
     <section className="about section" id="about">
       <h2>O nas</h2>
       <div className="about-content">
         <div className="about-text">
           <p style={{ textAlign: 'left' }}>
             Jesteśmy zespołem pasjonatów edukacji i technologii. Naszym celem
             jest uwolnienie nauczycieli i administratorów od żmudnego
             ręcznego układania planów lekcji — za pomocą AI automatyzujemy
             cały proces, pozwalając Wam poświęcić czas na to, co naprawdę
             ważne.
           </p>
           <p style={{ textAlign: 'left' }}>
              Założona w 2025 roku przez Jana Jakubowskiego i Wiktora
              Alischa firma DeepSchedule szybko zdobyła zaufanie szkół w całej
              Polsce.
           </p>
         </div>
         <div className="about-team">
           <div className="team-member">
             <img src="/team/jan.png" alt="Jan Jakubowski" />
             <h4>Jan Jakubowski</h4>
             <p>CTO & Cofounder</p>
           </div>
           <div className="team-member">
             <img src="/team/wiktor.png" alt="Wiktor Alisch" />
             <h4>Wiktor Alisch</h4>
             <p>CEO & Cofounder</p>
           </div>
         </div>
       </div>
     </section>
   );
 }