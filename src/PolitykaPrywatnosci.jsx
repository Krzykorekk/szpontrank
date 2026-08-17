export default function PolitykaPrywatnosci() {
  return (
    <div className="tresc">
      <div className="dokument-prawny card">
        <h1>Polityka Prywatności SzpontRank</h1>
        <p className="hint">Ostatnia aktualizacja: sierpień 2026</p>

        <h2>1. Kto jest administratorem danych</h2>
        <p>
          Administratorem danych osobowych zbieranych w aplikacji SzpontRank jest Krzysztof Bochenek,
          działający jako osoba prywatna (nie w ramach zarejestrowanej działalności gospodarczej).
          Kontakt w sprawach danych osobowych: <strong>[ADRES E-MAIL KONTAKTOWY — do uzupełnienia]</strong>.
        </p>

        <h2>2. Dla kogo jest ta usługa</h2>
        <p>
          SzpontRank jest przeznaczony dla osób, które ukończyły <strong>13 lat</strong>. Zakładając
          konto, potwierdzasz, że spełniasz ten warunek.
        </p>

        <h2>3. Jakie dane zbieramy</h2>
        <ul>
          <li>Adres e-mail i hasło (albo dane z logowania Google) — do założenia i obsługi konta</li>
          <li>Imię, pseudonim (nick) i wybrany awatar (gotowa ikona — nie zdjęcie) — widoczne dla innych w Twoich Topkach</li>
          <li>Informacje o głosach oddanych w Topkach i Quersach — do liczenia rankingów</li>
          <li>Treść Quersów, które sam tworzysz w trybie „Własny”</li>
          <li>Podstawowe dane techniczne zbierane automatycznie przez naszych dostawców usług (np. adres IP, znaczniki czasu) — wyłącznie w celach bezpieczeństwa i utrzymania działania serwisu</li>
        </ul>
        <p>Nie zbieramy zdjęć profilowych, danych o lokalizacji ani numeru telefonu.</p>

        <h2>4. Po co przetwarzamy te dane</h2>
        <ul>
          <li>Żeby założyć i obsłużyć Twoje konto</li>
          <li>Żeby działały Topki, głosowania i Quersy — czyli podstawowa funkcja appki</li>
          <li>Żeby moderować treści (wykrywanie niedozwolonych słów, obsługa zgłoszeń)</li>
          <li>Żeby appka działała stabilnie i bezpiecznie</li>
        </ul>
        <p>
          Nie sprzedajemy Twoich danych, nie wyświetlamy reklam i nie udostępniamy danych podmiotom
          trzecim w celach marketingowych.
        </p>

        <h2>5. Komu powierzamy dane (podwykonawcy)</h2>
        <p>Korzystamy z kilku zewnętrznych dostawców usług technicznych, którzy przechowują lub przetwarzają dane w naszym imieniu:</p>
        <ul>
          <li><strong>Supabase</strong> (baza danych i logowanie) — serwery w UE (Frankfurt)</li>
          <li><strong>Vercel</strong> (hosting samej aplikacji)</li>
          <li><strong>Resend</strong> (wysyłka e-maili systemowych, np. potwierdzenie rejestracji)</li>
          <li><strong>Google</strong> — jeśli logujesz się przez Google (opcjonalnie)</li>
        </ul>

        <h2>6. Twoje prawa</h2>
        <ul>
          <li><strong>Dostęp do danych</strong> — możesz zobaczyć swoje dane w Ustawieniach</li>
          <li><strong>Poprawianie danych</strong> — imię, nick i awatar zmienisz sam w Ustawieniach</li>
          <li>
            <strong>Usunięcie konta i danych</strong> — w Ustawieniach jest przycisk „Usuń konto na
            stałe”, który trwale kasuje Twoje konto i powiązane dane
          </li>
          <li>
            <strong>Sprzeciw / skarga</strong> — możesz napisać do nas na adres kontaktowy powyżej, a
            jeśli uznasz, że coś jest nie tak, masz prawo złożyć skargę do Prezesa Urzędu Ochrony Danych
            Osobowych (UODO)
          </li>
        </ul>

        <h2>7. Bezpieczeństwo</h2>
        <p>
          Dostęp do danych w bazie jest ograniczony regułami bezpieczeństwa (Row Level Security) — każdy
          użytkownik widzi tylko dane, do których faktycznie ma być uprawniony (np. członków własnych
          Topek). Hasła nie są nigdzie przechowywane jawnym tekstem.
        </p>

        <h2>8. Zmiany tej polityki</h2>
        <p>
          Jeśli coś tu zmienimy, zaktualizujemy datę na górze strony. Przy istotnych zmianach
          postaramy się to zakomunikować w aplikacji.
        </p>
      </div>
    </div>
  )
}
