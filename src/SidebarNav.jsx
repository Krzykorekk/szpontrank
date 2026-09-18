import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Awatar from './Awatar'
import { IkonaDom, IkonaOsoba, IkonaKorona, IkonaCzat, IkonaPodium } from './Ikony'
import OdznakaWlasciciela from './OdznakaWlasciciela'

// Event: Znajomi na komputerze odblokowane na 7 dni, potem znika samo.
const ZNAJOMI_EVENT_KONIEC = new Date('2026-09-24T23:59:59')
const znajomiEventAktywny = new Date() < ZNAJOMI_EVENT_KONIEC

export default function SidebarNav({ profil }) {
  const location = useLocation()
  const { t } = useTranslation()
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

      <nav className="sidebar-nav sidebar-tylko-desktop">
        <Link to="/panel" className={`sidebar-nav-link ${aktywny('/panel')}`}>
          <IkonaDom rozmiar={20} /> {t('nav.home')}
        </Link>
        <Link to="/panel/misje" className={`sidebar-nav-link ${aktywny('/panel/misje')}`}>
          <IkonaKorona rozmiar={20} /> {t('nav.missions')}
        </Link>
        <Link to="/panel/topki" className={`sidebar-nav-link ${aktywny('/panel/topki')}`}>
          <IkonaPodium rozmiar={20} /> {t('nav.rankings')}
        </Link>
        {znajomiEventAktywny && (
          <Link to="/panel/znajomi" className={`sidebar-nav-link ${aktywny('/panel/znajomi')}`}>
            <IkonaCzat rozmiar={20} /> {t('nav.friends')} <span className="typ-pill typ-klasa" style={{ marginLeft: 4 }}>{t('nav.new')}</span>
          </Link>
        )}
        <Link to="/panel/ustawienia" className={`sidebar-nav-link ${aktywny('/panel/ustawienia')}`}>
          <IkonaOsoba rozmiar={20} /> {t('nav.profile')}
        </Link>
      </nav>
    </aside>
  )
}
