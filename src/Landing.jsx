import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IkonaKorona, IkonaOgien, IkonaSzkola, IkonaGlobus } from './Ikony'

const KROKI = [
  { tytul: 'Dołącz do Topki', opis: 'Wpisz kod od znajomych albo z klasy — albo stwórz własną Topkę w 10 sekund.' },
  { tytul: 'Głosuj codziennie', opis: 'Jedno nowe pytanie dziennie. Klikasz, kto Twoim zdaniem pasuje najbardziej.' },
  { tytul: 'Zdobądź koronę', opis: 'Najwięcej głosów danego dnia? Korona jest Twoja na 24h.' },
]

const FUNKCJE = [
  { Ikona: IkonaKorona, tytul: 'Korona Dnia', opis: 'Kto zbierze najwięcej głosów, nosi koronę przez 24h.' },
  { Ikona: IkonaOgien, tytul: 'Streaki', opis: 'Głosuj codziennie i buduj serię.' },
  { Ikona: IkonaSzkola, tytul: 'Klasa i Ekipa', opis: 'Osobne Topki na szkołę i osobne na znajomych.' },
]

export default function Landing({ zalogowany, profilGotowy }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (zalogowany && profilGotowy) {
      navigate('/panel', { replace: true })
    } else if (zalogowany && !profilGotowy) {
      navigate('/rejestracja', { replace: true })
    }
  }, [zalogowany, profilGotowy, navigate])

  return (
    <>
      <section className="hero-sekcja">
        <img src="/brand/emblem.png" alt="SzpontRank" className="hero-godlo" />
        <h1 className="hero-tytul">Codzienna rywalizacja o koronę Twojej ekipy.</h1>
        <p className="hero-opis">
          Jedno pytanie dziennie. Głosujecie razem — klasa albo znajomi. Kto zbiera najwięcej głosów,
          nosi koronę do jutra.
        </p>
        <div className="hero-cta">
          <Link to="/rejestracja" className="install-btn">
            Zaloguj się / Zarejestruj się
          </Link>
        </div>
        <div className="staty">
          <span><IkonaGlobus rozmiar={15} /> 20 pytań na start</span>
          <span><IkonaKorona rozmiar={15} /> Zero hejtu</span>
          <span><IkonaOgien rozmiar={15} /> 100% za darmo</span>
        </div>
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
                <f.Ikona rozmiar={18} />
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
