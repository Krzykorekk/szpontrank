import { useSeo } from './useSeo'

export default function BezpieczenstwoDzieci() {
  useSeo({
    tytul: 'Standardy bezpieczeństwa dzieci — SzpontRank',
    opis: 'Zasady SzpontRank dotyczące zapobiegania wykorzystywaniu seksualnemu dzieci i naruszaniu ich praw (CSAE).',
    canonical: 'https://szpontrank.eu/bezpieczenstwo-dzieci',
  })
  return (
    <div className="tresc">
      <div className="dokument-prawny card">
        <h1>Standardy bezpieczeństwa dzieci</h1>
        <p className="hint">Ostatnia aktualizacja: wrzesień 2026</p>

        <h2>1. Zero tolerancji</h2>
        <p>
          SzpontRank stosuje politykę <strong>zero tolerancji</strong> wobec wszelkich treści
          przedstawiających wykorzystywanie seksualne dzieci (Child Sexual Abuse and Exploitation, CSAE),
          w tym materiałów przedstawiających seksualizację, wykorzystywanie lub krzywdzenie osób
          niepełnoletnich w jakiejkolwiek formie. Dotyczy to zdjęć, tekstu, linków i wszelkich innych
          treści przesyłanych przez użytkowników w aplikacji (np. wiadomości w czacie ze znajomymi).
        </p>
        <p>
          Zasada ta obowiązuje niezależnie od kontekstu, intencji czy zgody rzekomo wyrażonej przez
          osobę niepełnoletnią — nie istnieją żadne wyjątki.
        </p>

        <h2>2. Kto może korzystać z SzpontRank</h2>
        <p>
          Aplikacja jest przeznaczona dla osób od <strong>13. roku życia</strong>. Zakładanie kont
          w imieniu osób młodszych, oraz wykorzystywanie aplikacji do kontaktowania się z osobami
          niepełnoletnimi w sposób nieodpowiedni, jest surowo zabronione.
        </p>

        <h2>3. Jak zgłosić naruszenie</h2>
        <p>
          Obecnie jedynym kanałem zgłaszania treści związanych z wykorzystywaniem seksualnym dzieci
          jest bezpośredni kontakt mailowy:{' '}
          <a href="mailto:kontakt@szpontrank.eu">kontakt@szpontrank.eu</a>. Zgłoszenia tego typu
          traktujemy priorytetowo i rozpatrujemy w pierwszej kolejności, zwykle w ciągu 24 godzin.
        </p>
        <p>
          Pracujemy nad wbudowanym w aplikację przyciskiem zgłaszania pojedynczych wiadomości i
          użytkowników — do czasu jego wdrożenia zgłoszenia przyjmujemy wyłącznie mailowo.
        </p>

        <h2>4. Jak reagujemy</h2>
        <ul>
          <li>Każde zgłoszenie mailowe jest weryfikowane ręcznie, priorytetowo, zwykle w ciągu 24 godzin</li>
          <li>Potwierdzone naruszenia skutkują natychmiastowym, trwałym usunięciem konta — bez ostrzeżenia</li>
          <li>Materiały przedstawiające wykorzystywanie seksualne dzieci są zgłaszane odpowiednim organom ścigania oraz, w Polsce, do{' '}
            <a href="https://dyzurnet.pl" target="_blank" rel="noopener noreferrer">Dyżurnet.pl</a>{' '}
            — polskiego punktu kontaktowego do zgłaszania nielegalnych treści w internecie, prowadzonego przez NASK</li>
          <li>Współpracujemy z Policją i innymi właściwymi organami ścigania, w Polsce i za granicą, w zakresie wymaganym przez prawo</li>
        </ul>

        <h2>5. Osoba kontaktowa</h2>
        <p>
          Za politykę bezpieczeństwa dzieci w SzpontRank odpowiada Krzysztof Bochenek, prowadzący
          aplikację jako osoba prywatna. Kontakt w sprawach dotyczących tej polityki i jej egzekwowania:{' '}
          <a href="mailto:kontakt@szpontrank.eu">kontakt@szpontrank.eu</a>.
        </p>

        <h2>6. Powiązane dokumenty</h2>
        <p>
          Ta strona uzupełnia <a href="/regulamin">Regulamin</a> oraz{' '}
          <a href="/polityka-prywatnosci">Politykę Prywatności</a> SzpontRank.
        </p>
      </div>
    </div>
  )
}
