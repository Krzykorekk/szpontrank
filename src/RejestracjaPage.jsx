import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import AuthScreen from './AuthScreen'
import ProfileSetup from './ProfileSetup'
import { IkonaSzkola, IkonaKorona, IkonaSerce } from './Ikony'

function EkranStartowy({ onRozpocznij }) {
  return (
    <div className="card card-wyroznik" style={{ textAlign: 'center' }}>
      <img src="/brand/emblem.png" alt="SzpontRank" style={{ width: 72, height: 72, marginBottom: 18 }} />
      <h1 style={{ marginBottom: 10 }}>Zdobądź rangę.</h1>
      <p style={{ marginBottom: 28, color: 'var(--tekst-drugorzedny, #6b7280)' }}>
        Codzienne Pytanie Dnia, Pojedynki 1 na 1, Rankingi dla klasy i znajomych — bez hejtu.
      </p>
      <button
        type="button"
        className="install-btn"
        style={{ width: '100%', background: 'var(--czerwony, #FF4D4D)', color: '#fff', fontWeight: 700 }}
        onClick={onRozpocznij}
      >
        Rozpocznij
      </button>
    </div>
  )
}

export default function RejestracjaPage({ ladowanie, sesja, profil, onProfilGotowy }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [rozpoczeto, setRozpoczeto] = useState(!Capacitor.isNativePlatform())

  useEffect(() => {
    const kod = searchParams.get('ref')
    if (kod) {
      try {
        localStorage.setItem('szpontrank-kod-polecajacego', kod)
      } catch (e) {}
    }
  }, [searchParams])

  useEffect(() => {
    if (!ladowanie && sesja && profil) {
      navigate('/panel', { replace: true })
    }
  }, [ladowanie, sesja, profil, navigate])

  if (Capacitor.isNativePlatform() && !rozpoczeto && !ladowanie && !sesja) {
    return (
      <div className="tresc">
        <div className="rejestracja-uklad">
          <EkranStartowy onRozpocznij={() => setRozpoczeto(true)} />
        </div>
      </div>
    )
  }

  return (
    <div className="tresc">
      <div className="rejestracja-uklad">
        {!Capacitor.isNativePlatform() && (
          <div className="rejestracja-pitch">
            <h1>Dołącz do swojej pierwszej Topki.</h1>
            <p>Bez nazwiska, bez zbędnych danych — e-mail i hasło wystarczą. Imię i pseudonim ustawisz zaraz po założeniu konta.</p>
            <ul className="rejestracja-korzysci">
              <li><IkonaSzkola rozmiar={20} /> Klasa albo ekipa — Ty wybierasz</li>
              <li><IkonaKorona rozmiar={20} /> Jedno pytanie dziennie</li>
              <li><IkonaSerce rozmiar={20} /> Zero możliwości hejtu — pytania tylko od systemu</li>
            </ul>
          </div>
        )}

        <div>
          {ladowanie && <p className="debug-status">Ładowanie...</p>}
          {!ladowanie && !sesja && <AuthScreen />}
          {!ladowanie && sesja && !profil && (
            <ProfileSetup
              userId={sesja.user.id}
              onGotowe={() => {
                onProfilGotowy()
                navigate('/panel', { replace: true })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
