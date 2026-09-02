import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ZnajomiPage from './ZnajomiPage'
import SidebarNav from './SidebarNav'

export default function ZnajomiStronaPage({ ladowanie, sesja, profil }) {
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
          <div className="panel-naglowek">
            <h1>Znajomi</h1>
          </div>
          <ZnajomiPage userId={sesja.user.id} />
        </main>
      </div>
    </div>
  )
}
