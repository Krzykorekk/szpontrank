import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Quersy from './Quersy'
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
      <div className="quersy-tylko-mobile">
        <div className="panel-naglowek">
          <h1><IkonaQuersy rozmiar={22} style={{ verticalAlign: '-4px', marginRight: '8px' }} />Quersy</h1>
        </div>
        <Quersy userId={sesja.user.id} />
      </div>
      <div className="quersy-tylko-desktop-info card">
        <h2>Quersy działają tylko w appce mobilnej</h2>
        <p className="hint">
          Zainstaluj SzpontRank na telefonie (przycisk instalacji w górnym pasku), żeby tworzyć i przeglądać Quersy.
        </p>
      </div>
    </div>
  )
}
