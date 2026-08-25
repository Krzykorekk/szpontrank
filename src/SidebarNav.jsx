import { Link, useLocation } from 'react-router-dom'
import Awatar from './Awatar'
import { IkonaDom, IkonaOsoba, IkonaOgien } from './Ikony'
import OdznakaWlasciciela from './OdznakaWlasciciela'

export default function SidebarNav({ profil }) {
  const location = useLocation()
  const aktywny = (sciezka) => (location.pathname === sciezka ? 'aktywna' : '')

  return (
    <aside className="panel-sidebar">
      <div className="sidebar-profil">
        <div className="avatar-korona">
          <Awatar id={profil.avatar || 'blyskawica'} rozmiar={44} />
        </div>
        <div className="sidebar-profil-tekst">
          <h2 className="sidebar-imie tekst-obciety">{profil.imie}</h2>
          <p className="sidebar-nick tekst-obciety">@{profil.nick}</p>
          <OdznakaWlasciciela userId={profil.id} />
        </div>
      </div>

      {profil.streak_dni > 0 && (
        <div className="streak-widget">
          <IkonaOgien rozmiar={22} />
          <span className="streak-liczba">{profil.streak_dni}</span>
          <span className="streak-etykieta">{profil.streak_dni === 1 ? 'dzień z rzędu' : 'dni z rzędu'}</span>
        </div>
      )}

      <nav className="sidebar-nav sidebar-tylko-desktop">
        <Link to="/panel" className={`sidebar-nav-link ${aktywny('/panel')}`}>
          <IkonaDom rozmiar={20} /> Dom
        </Link>
        <Link to="/panel/ustawienia" className={`sidebar-nav-link ${aktywny('/panel/ustawienia')}`}>
          <IkonaOsoba rozmiar={20} /> Profil
        </Link>
      </nav>
    </aside>
  )
}
