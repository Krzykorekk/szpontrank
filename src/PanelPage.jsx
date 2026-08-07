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
      <main className="content">
        <p className="debug-status">Ładowanie...</p>
      </main>
    )
  }

  return (
    <main className="content">
      <div className="card powitanie">
        <h2>Cześć, {profil.imie}! 👑</h2>
        <p>Twój pseudonim: @{profil.nick}</p>
        <button className="install-btn wyloguj" onClick={wyloguj}>
          Wyloguj się
        </button>
      </div>
      <TopkiPanel userId={sesja.user.id} />
    </main>
  )
}
