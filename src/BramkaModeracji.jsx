import { useNavigate } from 'react-router-dom'

export function WymaganaZmianaDanych({ powod }) {
  const navigate = useNavigate()
  return (
    <div className="tresc" style={{ maxWidth: 440, margin: '70px auto 0', textAlign: 'center' }}>
      <div className="card">
        <img src="/brand/emblem.png" alt="SzpontRank" style={{ width: 64, height: 64, margin: '0 auto 18px' }} />
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em', fontSize: '1.9rem', margin: '0 0 12px' }}>
          Zmień imię lub pseudonim
        </h1>
        <p className="hint">
          Nasz system wykrył, że Twoje imię lub pseudonim może naruszać zasady appki
          {powod ? <> (powód: <strong>{powod}</strong>)</> : null}. Zanim będziesz mógł/mogła dalej
          korzystać z SzpontRank, zmień je na coś innego.
        </p>
        <button className="install-btn" style={{ marginTop: 10 }} onClick={() => navigate('/panel/ustawienia/profil')}>
          Zmień teraz
        </button>
      </div>
    </div>
  )
}

export function EkranZbanowany({ powod, onWyloguj }) {
  return (
    <div className="tresc" style={{ maxWidth: 440, margin: '70px auto 0', textAlign: 'center' }}>
      <div className="card karta-niebezpieczna">
        <img src="/brand/emblem.png" alt="SzpontRank" style={{ width: 64, height: 64, margin: '0 auto 18px' }} />
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em', fontSize: '1.9rem', margin: '0 0 12px' }}>
          Konto zablokowane
        </h1>
        <p className="hint">
          Twoje konto zostało zablokowane za naruszenie zasad appki
          {powod ? <> (powód: <strong>{powod}</strong>)</> : null}. Jeśli uważasz, że to pomyłka,
          napisz do nas: <strong>kontakt@szpontrank.eu</strong>.
        </p>
        <button className="install-btn drugorzedny" style={{ marginTop: 10 }} onClick={onWyloguj}>
          Wyloguj się
        </button>
      </div>
    </div>
  )
}
