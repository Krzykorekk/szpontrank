import { useState } from 'react'
import { IkonaKorona, IkonaGrupa, IkonaGlobus, IkonaQuersy, IkonaUstawienia } from './Ikony'

export const KLUCZ_SAMOUCZKA = 'szpontrank-samouczek-widziany'

const KROKI = [
  {
    Ikona: IkonaGrupa,
    tytul: 'Topki',
    opis:
      'Topka to grupa osób, które razem głosują — np. Twoja klasa albo znajomi. Dołączasz kodem od kogoś, kto już w niej jest, albo zakładasz własną i wysyłasz kod dalej.',
  },
  {
    Ikona: IkonaKorona,
    tytul: 'Codzienne głosowanie',
    opis:
      'Każdego dnia w Topce pojawia się jedno pytanie. Klikasz, kto Twoim zdaniem pasuje najbardziej. Kto zbierze najwięcej głosów danego dnia, nosi koronę przez 24 godziny.',
  },
  {
    Ikona: IkonaGlobus,
    tytul: 'Ogólny Ranking Apki',
    opis:
      'To nie kolejna Topka do głosowania — to automatyczne zestawienie, kto ma najwięcej głosów łącznie ze wszystkich swoich Topek. Włączasz je jednym przyciskiem, bez kodu.',
  },
  {
    Ikona: IkonaQuersy,
    tytul: 'Quersy',
    opis:
      'Krótkie, pozytywne mini-ankiety — np. "kto ma lepsze filmy: X czy Y?". Tworzysz je sam, tylko w appce na telefonie. Pytania są zawsze pozytywne albo neutralne — bez miejsca na złośliwości.',
  },
  {
    Ikona: IkonaUstawienia,
    tytul: 'Profil',
    opis:
      'Tu zmienisz awatar, nick, hasło i motyw (jasny/ciemny). Stąd też się wylogujesz i — jeśli zajdzie taka potrzeba — usuniesz konto na stałe.',
  },
]

export default function Samouczek({ onZamknij }) {
  const [krok, setKrok] = useState(0)
  const ostatni = krok === KROKI.length - 1
  const { Ikona, tytul, opis } = KROKI[krok]

  function zakoncz() {
    try {
      localStorage.setItem(KLUCZ_SAMOUCZKA, '1')
    } catch (e) {}
    onZamknij()
  }

  return (
    <div className="qr-overlay" onClick={zakoncz}>
      <div className="samouczek-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qr-zamknij" onClick={zakoncz} aria-label="Zamknij">✕</button>

        <div className="samouczek-ikona">
          <Ikona rozmiar={28} />
        </div>
        <h2>{tytul}</h2>
        <p className="hint">{opis}</p>

        <div className="samouczek-kropki">
          {KROKI.map((_, i) => (
            <span key={i} className={`samouczek-kropka ${i === krok ? 'aktywna' : ''}`} />
          ))}
        </div>

        <div className="samouczek-przyciski">
          {krok > 0 && (
            <button className="install-btn drugorzedny" onClick={() => setKrok((k) => k - 1)}>
              Wstecz
            </button>
          )}
          <button className="install-btn" onClick={ostatni ? zakoncz : () => setKrok((k) => k + 1)}>
            {ostatni ? 'Zaczynamy' : 'Dalej'}
          </button>
        </div>
      </div>
    </div>
  )
}
