import React from 'react';
 import './Footer.css';
 
 export default function Footer() {
   return (
     <footer className="footer">
       <div className="footer-content">
         <div className="footer-links">
           <a href="/wiki" className="footer-link">
             <i className="fa-solid fa-book"></i>
             <span>Wiki</span>
           </a>
           <a href="/support" className="footer-link">
             <i className="fa-solid fa-headset"></i>
             <span>Support</span>
           </a>
         </div>
         <div className="footer-info">
           <p>© 2025 DeepSchedule. Wszelkie prawa zastrzeżone.</p>
           <p>Made with ♡ by Jan Jakubowski and Wiktor Alisch</p>
         </div>
       </div>
     </footer>
   );
 }