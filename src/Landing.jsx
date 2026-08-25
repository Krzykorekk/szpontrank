import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IkonaKorona, IkonaOgien, IkonaSzkola, IkonaGlobus, IkonaGrupa } from './Ikony'

const KROKI = [
  { tytul: 'Dołącz do Topki', opis: 'Wpisz kod od znajomych albo z klasy — albo stwórz własną Topkę w 10 sekund.' },
  { tytul: 'Głosuj codziennie', opis: 'Jedno nowe pytanie dziennie. Klikasz, kto Twoim zdaniem pasuje najbardziej.' },
  { tytul: 'Zdobądź koronę', opis: 'Najwięcej głosów danego dnia? Korona jest Twoja na 24h.' },
]

const FUNKCJE = [
  { Ikona: IkonaKorona, tytul: 'Korona Dnia', opis: 'Kto zbierze najwięcej głosów, nosi koronę przez 24h.' },
  { Ikona: IkonaOgien, tytul: 'Streaki', opis: 'Głosuj codziennie i buduj serię.' },
  { Ikona: IkonaGrupa, tytul: 'Klasa i Ekipa', opis: 'Osobne Topki na szkołę i osobne na znajomych.' },
  { Ikona: IkonaGlobus, tytul: 'Ogólny Ranking Apki', opis: 'Automatyczny ranking z sumy głosów ze wszystkich Twoich Topek.' },
  { Ikona: IkonaGrupa, tytul: 'Znajomi', opis: 'Dodaj znajomych po nicku i śledźcie nawzajem swoje streaki.' },
  { Ikona: IkonaSzkola, tytul: 'Zero Hejtu', opis: 'Same systemowe, pozytywne pytania — bez miejsca na złośliwości.' },
]

export default function Landing({ zalogowany, profilGotowy }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (zalogowany && !profilGotowy) {
      navigate('/rejestracja', { replace: true })
    }
  }, [zalogowany, profilGotowy, navigate])

  return (
    <>
      <section className="hero-sekcja">
        <img src="/brand/emblem.png" alt="SzpontRank" className="hero-godlo" />
        <p className="hero-czym-jest">
          Appka do codziennych głosowań i rankingów — dla Twojej klasy i znajomych.
        </p>
        <h1 className="hero-tytul">Codzienna rywalizacja o koronę Twojej ekipy.</h1>
        <p className="hero-motto">Twoja ekipa, Twój król.</p>
        <p className="hero-opis">
          Głosowania w klasie i wśród znajomych, lista Twoich znajomych i jeden ranking,
          który zbiera to wszystko razem. Kto zbiera najwięcej głosów, nosi koronę.
        </p>
        <div className="hero-cta">
          {zalogowany && profilGotowy ? (
            <Link to="/panel" className="install-btn">
              Przejdź do appki →
            </Link>
          ) : (
            <Link to="/rejestracja" className="install-btn">
              Zaloguj się / Zarejestruj się
            </Link>
          )}
        </div>
        <div className="staty">
          <span><IkonaGrupa rozmiar={15} /> Klasa i ekipa w jednym miejscu</span>
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
