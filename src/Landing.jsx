import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const KROKI = [
  { tytul: 'Dołącz do Topki', opis: 'Wpisz kod od znajomych albo z klasy — albo stwórz własną Topkę w 10 sekund.' },
  { tytul: 'Głosuj codziennie', opis: 'Jedno nowe pytanie dziennie. Klikasz, kto Twoim zdaniem pasuje najbardziej.' },
  { tytul: 'Zdobądź koronę', opis: 'Najwięcej głosów danego dnia? Korona jest Twoja na 24h.' },
]

const FUNKCJE = [
  { ikona: '👑', tytul: 'Korona Dnia', opis: 'Kto zbierze najwięcej głosów, nosi koronę przez 24h — widoczną dla całej Topki.' },
  { ikona: '🔥', tytul: 'Streaki', opis: 'Głosuj codziennie i buduj serię. Opuszczony dzień gasi płomień.' },
  { ikona: '🏫', tytul: 'Klasa i Ekipa', opis: 'Osobne Topki na szkołę i osobne na znajomych — różne pytania, ta sama korona.' },
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
        <div>
          <span className="eyebrow">Klasa • Ekipa • Korona</span>
          <h1 className="hero-tytul">
            Codzienna rywalizacja o <span className="zloto-tekst">koronę</span> Twojej ekipy.
          </h1>
          <p className="hero-opis">
            Jedno pytanie dziennie. Głosujecie razem — klasa albo znajomi. Kto zbiera najwięcej głosów, nosi
            koronę do jutra.
          </p>
          <div className="hero-cta">
            <Link to="/rejestracja" className="install-btn">
              Zaloguj się / Zarejestruj się
            </Link>
          </div>
          <div className="staty">
            <span>🎯 20 pytań na start</span>
            <span>🚫 Zero hejtu</span>
            <span>💸 100% za darmo</span>
          </div>
        </div>

        <div className="hero-wizual">
          <div className="hero-wizual-ramka">
            <img src="/brand/emblem.png" alt="SzpontRank" />
            <span className="plywajacy-badge a">👑 Korona Dnia</span>
            <span className="plywajacy-badge b">🔥 7-dniowy streak</span>
          </div>
        </div>
      </section>

      <section className="kroki-sekcja">
        <h2 className="kroki-naglowek">Jak to działa</h2>
        <div className="kroki">
          {KROKI.map((k, i) => (
            <div className="krok" key={k.tytul}>
              <span className="krok-numer">{String(i + 1).padStart(2, '0')}</span>
              <h3>{k.tytul}</h3>
              <p>{k.opis}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="funkcje">
        {FUNKCJE.map((f) => (
          <div className="funkcja-karta" key={f.tytul}>
            <span className="funkcja-ikona">{f.ikona}</span>
            <h3>{f.tytul}</h3>
            <p>{f.opis}</p>
          </div>
        ))}
      </section>
    </>
  )
}
