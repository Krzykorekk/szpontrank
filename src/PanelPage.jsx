import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopkiPanel from './TopkiPanel'
import SidebarNav from './SidebarNav'

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
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <TopkiPanel userId={sesja.user.id} />
        </main>
      </div>
    </div>
  )
}
