import { useSeo } from './useSeo'

export default function Regulamin() {
  useSeo({
    tytul: 'Regulamin — SzpontRank',
    opis: 'Regulamin korzystania z aplikacji SzpontRank — zasady, prawa i obowiązki użytkowników.',
    canonical: 'https://szpontrank.eu/regulamin',
  })
  return (
    <div className="tresc">
      <div className="dokument-prawny card">
        <h1>Regulamin SzpontRank</h1>
        <p className="hint">Ostatnia aktualizacja: wrzesień 2026</p>

        <h2>1. Czym jest SzpontRank</h2>
        <p>
          SzpontRank to darmowa aplikacja do codziennych, pozytywnych głosowań w gronie znajomych albo
          klasy („Topki”), listy znajomych i czatu ze znajomymi.
          Usługę prowadzi Krzysztof Bochenek jako osoba prywatna.
        </p>

        <h2>2. Kto może korzystać z SzpontRank</h2>
        <p>
          Z aplikacji może korzystać każdy, kto ukończył <strong>13 lat</strong>. Zakładając konto,
          oświadczasz, że spełniasz ten warunek.
        </p>

        <h2>3. Zasada „Zero Hejtu”</h2>
        <p>SzpontRank istnieje po to, żeby budować, nie żeby ranić. Dlatego obowiązują twarde zasady:</p>
        <ul>
          <li>Pytania w Topkach są zawsze systemowe, z góry ustalone — nikt nie wpisuje własnych</li>
          <li>Nie wolno używać SzpontRank do nękania, obrażania, ani ośmieszania innych osób — złamanie tej zasady może skończyć się usunięciem konta, bez ostrzeżenia</li>
          <li>W wiadomościach na czacie ze znajomymi zabronione są treści nielegalne, wulgarne, nawołujące do przemocy oraz jakiekolwiek treści związane z wykorzystywaniem seksualnym osób niepełnoletnich — szczegóły w naszych <a href="/bezpieczenstwo-dzieci">Standardach bezpieczeństwa dzieci</a></li>
        </ul>

        <h2>4. Twoje konto</h2>
        <ul>
          <li>Jedno konto na osobę</li>
          <li>Odpowiadasz za bezpieczeństwo swojego hasła</li>
          <li>Możesz usunąć konto w dowolnym momencie w Ustawieniach — to działanie jest nieodwracalne</li>
          <li>Zastrzegamy sobie prawo do zawieszenia albo usunięcia konta, które łamie zasady tego regulaminu</li>
        </ul>

        <h2>5. Awatary i treści</h2>
        <p>
          Zdjęcia profilowe nie są obsługiwane — do wyboru jest zestaw gotowych ikon.
        </p>

        <h2>6. Brak gwarancji</h2>
        <p>
          SzpontRank to projekt hobbystyczny, prowadzony i utrzymywany bez gwarancji ciągłości
          działania. Staramy się, żeby appka działała stabilnie, ale nie możemy zagwarantować braku
          przerw technicznych czy utraty danych w wyniku awarii.
        </p>

        <h2>7. Zmiany regulaminu</h2>
        <p>
          Możemy aktualizować ten regulamin — data u góry strony zawsze pokazuje ostatnią zmianę.
          Dalsze korzystanie z aplikacji po zmianie oznacza akceptację nowej wersji.
        </p>

        <h2>8. Kontakt i zgłaszanie naruszeń</h2>
        <p>
          Pytania dotyczące regulaminu, oraz zgłoszenia naruszeń (w tym treści niebezpiecznych dla
          osób niepełnoletnich): <strong>kontakt@szpontrank.eu</strong>. Więcej o tym, jak reagujemy
          na zgłoszenia, w <a href="/bezpieczenstwo-dzieci">Standardach bezpieczeństwa dzieci</a>.
        </p>
      </div>
    </div>
  )
}
