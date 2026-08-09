import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TopkiPanel from './TopkiPanel'

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
          <div className="avatar-korona">{profil.avatar || '👑'}</div>
          <h2 className="sidebar-imie">{profil.imie}</h2>
          <p className="sidebar-nick">@{profil.nick}</p>

          {profil.streak_dni > 0 && (
            <p className="streak-pill">🔥 {profil.streak_dni}-dniowy streak</p>
          )}

          <Link to="/panel/ustawienia" className="install-btn drugorzedny sidebar-wyloguj">
            Ustawienia konta
          </Link>
          <button className="install-btn drugorzedny sidebar-wyloguj" onClick={wyloguj}>
            Wyloguj się
          </button>
        </aside>

        <main className="panel-main">
          <TopkiPanel userId={sesja.user.id} />
        </main>
      </div>
    </div>
  )
}
