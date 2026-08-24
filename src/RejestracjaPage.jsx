import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthScreen from './AuthScreen'
import ProfileSetup from './ProfileSetup'

export default function RejestracjaPage({ ladowanie, sesja, profil, onProfilGotowy }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!ladowanie && sesja && profil) {
      navigate('/panel', { replace: true })
    }
  }, [ladowanie, sesja, profil, navigate])

  return (
    <div className="tresc">
      <div className="rejestracja-uklad">
        <div className="rejestracja-pitch">
          <h1>Dołącz do swojej pierwszej Topki.</h1>
          <p>Bez nazwiska, bez zbędnych danych — e-mail i hasło wystarczą. Imię i pseudonim ustawisz zaraz po założeniu konta.</p>
          <ul>
            <li>Klasa albo ekipa — Ty wybierasz</li>
            <li>Jedno pytanie dziennie</li>
            <li>Zero możliwości hejtu — pytania tylko od systemu</li>
          </ul>
        </div>

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
