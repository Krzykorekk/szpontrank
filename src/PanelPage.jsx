import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
      <div className="panel-uklad">
        <aside className="card">
          <h2>Cześć, {profil.imie}! 👑</h2>
          <p className="hint">Twój pseudonim</p>
          <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>@{profil.nick}</p>
          <button className="install-btn wyloguj" onClick={wyloguj}>
            Wyloguj się
          </button>
        </aside>

        <div>
          <TopkiPanel userId={sesja.user.id} />
        </div>
      </div>
    </div>
  )
}
