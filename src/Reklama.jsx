import { Link } from 'react-router-dom'
import { IkonaMoneta } from './Ikony'

export default function Reklama() {
  return (
    <div className="tresc" style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <img src="/brand/emblem.png" alt="SzpontRank" style={{ width: 56, height: 56, marginBottom: 16 }} />
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '0.02em', margin: 0 }}>
          Reklama w SzpontRank
        </h1>
      </div>

      <div className="card">
        <h2><IkonaMoneta rozmiar={20} style={{ verticalAlign: '-4px', marginRight: 8 }} />Reklamy w appce — wkrótce</h2>
        <p className="hint">
          Pracujemy nad wprowadzeniem reklam w SzpontRank — spokojnych, niedopasowanych do danych
          osobowych, niekierowanych bezpośrednio do zakupu. Appka pozostaje darmowa dla wszystkich
          użytkowników.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Współpraca / kontakt</h2>
        <p className="hint">
          Jesteś zainteresowany/a współpracą albo masz pytanie dotyczące SzpontRank? Napisz na{' '}
          <a href="mailto:kontakt@szpontrank.eu">kontakt@szpontrank.eu</a>.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <Link to="/" className="install-btn drugorzedny">
          ‹ Wróć na stronę główną
        </Link>
      </div>
    </div>
  )
}
