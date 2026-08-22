import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Quersy from './Quersy'
import SidebarNav from './SidebarNav'
import { IkonaQuersy } from './Ikony'

export default function QuersyPage({ ladowanie, sesja, profil }) {
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
          <div className="quersy-tylko-mobile">
            <div className="panel-naglowek">
              <h1><IkonaQuersy rozmiar={22} style={{ verticalAlign: '-4px', marginRight: '8px' }} />Quersy</h1>
            </div>
            <p className="hint" style={{ marginBottom: 14 }}>
              Szybkie, pozytywne mini-ankiety — np. "kto ma lepsze filmy". Tworzysz sam albo losujesz gotową.
            </p>
            <Quersy userId={sesja.user.id} />
          </div>
          <div className="quersy-tylko-desktop-info card">
            <h2>Quersy działają tylko w appce mobilnej</h2>
            <p className="hint">
              Zainstaluj SzpontRank na telefonie, żeby tworzyć i przeglądać Quersy —{' '}
              <Link to="/download">zobacz jak</Link>.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
