import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const FUNKCJE = [
  {
    ikona: '👑',
    tytul: 'Korona Dnia',
    opis: 'Kto zbierze najwięcej głosów, nosi koronę przez 24h.',
  },
  {
    ikona: '🔥',
    tytul: 'Streaki',
    opis: 'Głosuj codziennie i buduj serię — nie daj jej zgasnąć.',
  },
  {
    ikona: '🏫',
    tytul: 'Klasa i Ekipa',
    opis: 'Osobne Topki na szkołę i osobne na znajomych.',
  },
]

export default function Landing({ zalogowany, profilGotowy }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (zalogowany && profilGotowy) {
      navigate('/panel', { replace: true })
    }
  }, [zalogowany, profilGotowy, navigate])

  return (
    <>
      <section className="funkcje">
        {FUNKCJE.map((f) => (
          <div className="funkcja-karta" key={f.tytul}>
            <span className="funkcja-ikona">{f.ikona}</span>
            <h3>{f.tytul}</h3>
            <p>{f.opis}</p>
          </div>
        ))}
      </section>

      <main className="content">
        <div className="card">
          <h2>Gotowy/a na koronę?</h2>
          <p>Dołącz do swojej klasy albo ekipy i sprawdź, kto dziś zbierze najwięcej głosów.</p>
          <Link to="/rejestracja" className="install-btn link-jak-btn">
            Zaloguj się / Zarejestruj się
          </Link>
        </div>
      </main>
    </>
  )
}
