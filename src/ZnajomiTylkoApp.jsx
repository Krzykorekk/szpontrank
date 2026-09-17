import { Capacitor } from '@capacitor/core'
import SidebarNav from './SidebarNav'
import ZnajomiStronaPage from './ZnajomiStronaPage'
import { IkonaGrupa } from './Ikony'

// Event: Znajomi/czat tymczasowo dostepne tez na webie (nie tylko w appce),
// przez 7 dni. Po tym terminie wraca standardowa blokada ponizej.
const ZNAJOMI_EVENT_KONIEC = new Date('2026-09-24T23:59:59')
const znajomiEventAktywny = new Date() < ZNAJOMI_EVENT_KONIEC

export default function ZnajomiTylkoApp(props) {
  if (Capacitor.isNativePlatform() || znajomiEventAktywny) {
    return <ZnajomiStronaPage {...props} />
  }

  const { profil } = props
  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <IkonaGrupa rozmiar={40} style={{ color: 'var(--czerwien)', marginBottom: 16 }} />
            <h2 style={{ marginTop: 0 }}>Znajomi i czat — tylko w appce</h2>
            <p className="hint" style={{ maxWidth: 380, margin: '0 auto 20px' }}>
              Ta funkcja jest dostępna wyłącznie w aplikacji mobilnej SzpontRank.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
