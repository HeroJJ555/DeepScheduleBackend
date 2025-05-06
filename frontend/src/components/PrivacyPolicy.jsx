import React from 'react';
import './privacy.css';

export default function PrivacyPolicy()
{
  return (
    <section className="privacy section" id="privacy">
      <h2>Polityka prywatności</h2>
      <div className="privacy-content">
        <p><strong>Data wejścia w życie:</strong> 1 maja 2025</p>

        <h3>1. Administrator danych</h3>
        <p>Administratorem Twoich danych osobowych jest DeepSchedule sp. z o.o., ul. Przykładowa 1, 00-000 Warszawa.</p>

        <h3>2. Cele i podstawy przetwarzania</h3>
        <ul>
          <li>Realizacja usługi – na podstawie umowy (art. 6 ust. 1 lit. b RODO).</li>
          <li>Marketing i analiza ruchu – za Twoją zgodą (art. 6 ust. 1 lit. a RODO).</li>
        </ul>

        <h3>3. Odbiorcy danych</h3>
        <p>Dane mogą być przekazywane naszym podwykonawcom (hosting, e-mail) wyłącznie w niezbędnym zakresie.</p>

        <h3>4. Okres przechowywania</h3>
        <p>Dane logowania i pliki cookie przechowujemy do momentu cofnięcia zgody lub przez okres wymagany prawem.</p>

        <h3>5. Twoje prawa</h3>
        <ul>
          <li>Prawo dostępu do treści danych.</li>
          <li>Prawo sprostowania, usunięcia lub ograniczenia przetwarzania.</li>
          <li>Prawo wniesienia sprzeciwu i przenoszenia danych.</li>
          <li>Prawo cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z prawem przed cofnięciem).</li>
        </ul>

        <h3>6. Pliki cookies</h3>
        <p>Używamy plików cookie do niezbędnej pracy aplikacji oraz w celach analitycznych. Szczegóły w bannerze cookies.</p>

        <h3>7. Kontakt</h3>
        <p>W sprawie ochrony danych skontaktuj się: <a href="mailto:privacy@deepschedule.pl">privacy@deepschedule.pl</a></p>
      </div>
    </section>
  );
}