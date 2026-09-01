import { useNavigate } from 'react-router-dom'
import SidebarNav from './SidebarNav'

export default function PodstronaProfilu({ tytul, profil, dzieci }) {
  const navigate = useNavigate()
  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <div className="panel-naglowek">
            <button className="btn-wstecz-profil" onClick={() => navigate('/panel/ustawienia')}>
              ‹ Profil
            </button>
            <h1>{tytul}</h1>
          </div>
          {dzieci}
        </main>
      </div>
    </div>
  )
}
