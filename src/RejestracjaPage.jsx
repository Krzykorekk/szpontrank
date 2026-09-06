import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthScreen from './AuthScreen'
import ProfileSetup from './ProfileSetup'
import { IkonaSzkola, IkonaKorona, IkonaSerce } from './Ikony'

export default function RejestracjaPage({ ladowanie, sesja, profil, onProfilGotowy }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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

  return (
    <div className="tresc">
      <div className="rejestracja-uklad">
        <div className="rejestracja-pitch">
          <h1>Dołącz do swojej pierwszej Topki.</h1>
          <p>Bez nazwiska, bez zbędnych danych — e-mail i hasło wystarczą. Imię i pseudonim ustawisz zaraz po założeniu konta.</p>
          <ul className="rejestracja-korzysci">
            <li><IkonaSzkola rozmiar={20} /> Klasa albo ekipa — Ty wybierasz</li>
            <li><IkonaKorona rozmiar={20} /> Jedno pytanie dziennie</li>
            <li><IkonaSerce rozmiar={20} /> Zero możliwości hejtu — pytania tylko od systemu</li>
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
