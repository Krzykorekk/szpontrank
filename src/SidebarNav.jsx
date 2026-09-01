import { Link, useLocation } from 'react-router-dom'
import Awatar from './Awatar'
import { IkonaDom, IkonaOsoba, IkonaOgien, IkonaMoneta, IkonaGrupa, IkonaKorona, IkonaCzat } from './Ikony'
import OdznakaWlasciciela from './OdznakaWlasciciela'
import { obliczRange, OdznakaRangi } from './rangi'

export default function SidebarNav({ profil }) {
  const location = useLocation()
  const { biezaca } = obliczRange(profil.coiny_lacznie)
  const aktywny = (sciezka) =>
    location.pathname === sciezka || (sciezka !== '/panel' && location.pathname.startsWith(sciezka + '/'))
      ? 'aktywna'
      : ''

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

      <div className="sidebar-ranga-wiersz">
        <OdznakaRangi klucz={biezaca.klucz} rozmiar={30} />
        <span className="sidebar-ranga-nazwa">Ranga {biezaca.nazwa}</span>
      </div>

      {profil.streak_dni > 0 && (
        <div className="streak-widget">
          <IkonaOgien rozmiar={22} />
          <span className="streak-liczba">{profil.streak_dni}</span>
          <span className="streak-etykieta">{profil.streak_dni === 1 ? 'dzień z rzędu' : 'dni z rzędu'}</span>
        </div>
      )}

      <div className="streak-widget">
        <IkonaMoneta rozmiar={22} />
        <span className="streak-liczba">{profil.coiny || 0}</span>
        <span className="streak-etykieta">Coinów</span>
      </div>

      <nav className="sidebar-nav sidebar-tylko-desktop">
        <Link to="/panel" className={`sidebar-nav-link ${aktywny('/panel')}`}>
          <IkonaDom rozmiar={20} /> Dom
        </Link>
        <Link to="/panel/misje" className={`sidebar-nav-link ${aktywny('/panel/misje')}`}>
          <IkonaKorona rozmiar={20} /> Misje
        </Link>
        <Link to="/panel/topki" className={`sidebar-nav-link ${aktywny('/panel/topki')}`}>
          <IkonaGrupa rozmiar={20} /> Rankingi
        </Link>
        <Link to="/panel/znajomi" className={`sidebar-nav-link ${aktywny('/panel/znajomi')}`}>
          <IkonaCzat rozmiar={20} /> Znajomi
        </Link>
        <Link to="/panel/ustawienia" className={`sidebar-nav-link ${aktywny('/panel/ustawienia')}`}>
          <IkonaOsoba rozmiar={20} /> Profil
        </Link>
      </nav>
    </aside>
  )
}
