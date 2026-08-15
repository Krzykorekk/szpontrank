import { Link, useLocation } from 'react-router-dom'
import Awatar from './Awatar'
import { IkonaDom, IkonaUstawienia, IkonaWyjdz, IkonaOgien } from './Ikony'

export default function SidebarNav({ profil, wyloguj }) {
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
        </div>
      </div>

      {profil.streak_dni > 0 && (
        <p className="streak-pill">
          <IkonaOgien /> {profil.streak_dni}-dniowy streak
        </p>
      )}

      <nav className="sidebar-nav sidebar-tylko-desktop">
        <Link to="/panel" className={`sidebar-nav-link ${aktywny('/panel')}`}>
          <IkonaDom rozmiar={20} /> Panel
        </Link>
        <Link to="/panel/ustawienia" className={`sidebar-nav-link ${aktywny('/panel/ustawienia')}`}>
          <IkonaUstawienia rozmiar={20} /> Ustawienia
        </Link>
        <button className="sidebar-nav-link" onClick={wyloguj}>
          <IkonaWyjdz rozmiar={20} /> Wyloguj się
        </button>
      </nav>
    </aside>
  )
}
