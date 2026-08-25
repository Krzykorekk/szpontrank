import SidebarNav from './SidebarNav'
import { IkonaGrupa } from './Ikony'

export default function ZnajomiTylkoApp({ profil }) {
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
            <a className="install-btn" href="/app/">
              Otwórz appkę mobilną
            </a>
          </div>
        </main>
      </div>
    </div>
  )
}
