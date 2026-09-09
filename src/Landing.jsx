import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { IkonaKorona, IkonaOgien, IkonaSzkola, IkonaGlobus, IkonaMoneta, IkonaCzat } from './Ikony'

const KROKI = [
  { tytul: 'Zagłosuj', opis: 'Codzienne Pytanie Dnia, Pojedynek 1 na 1 albo Ranking Prywatny — jedno kliknięcie dziennie wystarczy.' },
  { tytul: 'Zbieraj Coiny', opis: 'Za każdy głos, streak i otwartą Skrzynkę Dnia — Coiny lecą same.' },
  { tytul: 'Pnij się w Rangach', opis: 'Brąz, Srebro, Złoto, Diament, Legenda — Twoja pozycja rośnie z każdym dniem.' },
]

const FUNKCJE = [
  { Ikona: IkonaMoneta, tytul: 'Coiny i Ranga', opis: 'Zdobywaj Coiny za codzienną aktywność i pnij się od Brązu do Legendy.' },
  { Ikona: IkonaKorona, tytul: 'Pojedynek Dnia', opis: 'Codziennie losowe starcie 1 na 1 z całej appki — Ty wybierasz zwycięzcę.' },
  { Ikona: IkonaGlobus, tytul: 'Pytanie Dnia', opis: 'Jedno pytanie wyboru dla całej społeczności — zobacz jak wypadasz na tle wszystkich.' },
  { Ikona: IkonaOgien, tytul: 'Streaki i Misje', opis: 'Codzienne zadania z nagrodami — nie zapomnij, bo Zamrożenie Streaka Cię uratuje.' },
  { Ikona: IkonaCzat, tytul: 'Znajomi i Czat', opis: 'Dodaj znajomych po nicku i piszcie do siebie — dostępne w appce mobilnej.' },
  { Ikona: IkonaSzkola, tytul: 'Zero Hejtu', opis: 'Same systemowe, pozytywne pytania — bez miejsca na złośliwości.' },
]

export default function Landing({ zalogowany, profilGotowy }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (Capacitor.isNativePlatform() && !zalogowany) {
      navigate('/rejestracja', { replace: true })
      return
    }
    if (zalogowany && !profilGotowy) {
      navigate('/rejestracja', { replace: true })
    }
  }, [zalogowany, profilGotowy, navigate])

  return (
    <>
      <section className="hero-sekcja">
        <div className="hero-polka">
          <div className="ekran-startowy-odznaka ekran-startowy-odznaka--ogien hero-odznaka-ogien">
            <IkonaOgien rozmiar={26} />
          </div>
          <div className="ekran-startowy-odznaka ekran-startowy-odznaka--korona hero-odznaka-korona">
            <IkonaKorona rozmiar={38} />
          </div>
          <div className="ekran-startowy-odznaka ekran-startowy-odznaka--moneta hero-odznaka-moneta">
            <IkonaMoneta rozmiar={26} />
          </div>
        </div>
        <h1 className="hero-tytul">Zdobądź rangę.</h1>
        <p className="hero-motto">Twoja ekipa, Twój król.</p>
        <p className="hero-opis">
          Codzienne Pytanie Dnia, Pojedynki 1 na 1, Rankingi Prywatne dla klasy i znajomych —
          za każdy głos zbierasz Coiny i pniesz się od Brązu do Legendy.
        </p>
        <div className="hero-cta">
          {zalogowany && profilGotowy ? (
            <Link to="/panel" className="hero-cta-btn">
              Przejdź do appki
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          ) : (
            <Link to="/rejestracja" className="hero-cta-btn">
              Zaloguj się / Zarejestruj się
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          )}
        </div>
        <div className="staty">
          <span><IkonaMoneta rozmiar={15} /> System Coinów i Rang</span>
          <span><IkonaKorona rozmiar={15} /> Zero hejtu</span>
          <span><IkonaOgien rozmiar={15} /> 100% za darmo</span>
        </div>
        <Link to="/portfolio" className="hero-portfolio-link">
          Poznaj twórcę SzpontRank →
        </Link>
      </section>

      <section className="kroki-sekcja">
        <h2 className="sekcja-naglowek">Jak to działa</h2>
        <div className="kroki">
          {KROKI.map((k, i) => (
            <div className="krok" key={k.tytul}>
              <span className="krok-numer">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{k.tytul}</h3>
                <p>{k.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="funkcje-sekcja">
        <h2 className="sekcja-naglowek">Co znajdziesz w środku</h2>
        <div className="funkcje">
          {FUNKCJE.map((f) => (
            <div className="funkcja-wiersz" key={f.tytul}>
              <span className="funkcja-ikona">
                <f.Ikona rozmiar={20} />
              </span>
              <div>
                <h3>{f.tytul}</h3>
                <p>{f.opis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
