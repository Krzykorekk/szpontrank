import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TopkiPanel from './TopkiPanel'
import Awatar from './Awatar'
import { IkonaUstawienia, IkonaWyjdz, IkonaOgien } from './Ikony'

export default function PanelPage({ ladowanie, sesja, profil, wyloguj }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!ladowanie && (!sesja || !profil)) {
      navigate('/rejestracja', { replace: true })
    }
  }, [ladowanie, sesja, profil, navigate])

  if (ladowanie || !sesja || !profil) {
    return (
      <div className="tresc">
        <p className="debug-status">Ładowanie...</p>
      </div>
    )
  }

  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <aside className="panel-sidebar">
          <div className="avatar-korona">
            <Awatar id={profil.avatar || 'blyskawica'} rozmiar={64} />
          </div>
          <h2 className="sidebar-imie">{profil.imie}</h2>
          <p className="sidebar-nick">@{profil.nick}</p>

          {profil.streak_dni > 0 && (
            <p className="streak-pill">
              <IkonaOgien /> {profil.streak_dni}-dniowy streak
            </p>
          )}

          <Link to="/panel/ustawienia" className="install-btn drugorzedny sidebar-wyloguj sidebar-tylko-desktop">
            <IkonaUstawienia rozmiar={16} /> Ustawienia konta
          </Link>
          <button
            className="install-btn drugorzedny sidebar-wyloguj sidebar-tylko-desktop"
            onClick={wyloguj}
          >
            <IkonaWyjdz rozmiar={16} /> Wyloguj się
          </button>
        </aside>

        <main className="panel-main">
          <TopkiPanel userId={sesja.user.id} />
        </main>
      </div>
    </div>
  )
}
