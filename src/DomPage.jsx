import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import SidebarNav from './SidebarNav'
import { IkonaMoneta, IkonaOgien, IkonaFlaga } from './Ikony'
import PojedynekDnia from './PojedynekDnia'
import SkrzynkaDnia from './SkrzynkaDnia'
import PytanieDnia from './PytanieDnia'
import KoronaLidera from './KoronaLidera'
import PowitanieAnimacja from './PowitanieAnimacja'

export default function DomPage({ ladowanie, sesja, profil }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
          <KoronaLidera />

          <PowitanieAnimacja profil={profil} />

          <div className="panel-naglowek">
            <h1><Trans i18nKey="home.greeting" values={{ imie: profil.imie }} /></h1>
          </div>

          <PytanieDnia userId={sesja.user.id} />

          <PojedynekDnia userId={sesja.user.id} />

          <SkrzynkaDnia profil={profil} />

          <button className="dom-coiny-pasek dom-misje-pasek" onClick={() => navigate('/panel/misje')}>
            <span className="dom-coiny-ikona dom-misje-ikona"><IkonaFlaga rozmiar={24} /></span>
            <span className="dom-coiny-tekst">
              <span className="dom-coiny-liczba" style={{ fontSize: '1.1rem' }}>{t('home.missionsTitle')}</span>
              <span className="dom-coiny-etykieta">{t('home.missionsSubtitle')}</span>
            </span>
            <span className="dom-coiny-strzalka">→</span>
          </button>

          <button className="dom-coiny-pasek dom-streak-pasek" onClick={() => navigate('/panel/ustawienia/streak')}>
            <span className="dom-coiny-ikona dom-streak-ikona"><IkonaOgien rozmiar={26} /></span>
            <span className="dom-coiny-tekst">
              <span className="dom-coiny-liczba">
                {t('home.streak', { count: profil.streak_dni || 0 })}
              </span>
              <span className="dom-coiny-etykieta">{t('home.streakSubtitle')}</span>
            </span>
            <span className="dom-coiny-strzalka">→</span>
          </button>

          <button className="dom-coiny-pasek" onClick={() => navigate('/panel/coiny')}>
            <span className="dom-coiny-ikona"><IkonaMoneta rozmiar={26} /></span>
            <span className="dom-coiny-tekst">
              <span className="dom-coiny-liczba">{profil.coiny || 0}</span>
              <span className="dom-coiny-etykieta">{t('home.coinsSubtitle')}</span>
            </span>
            <span className="dom-coiny-strzalka">→</span>
          </button>

          <button className="install-btn dom-glosuj-cta" onClick={() => navigate('/panel/topki')}>
            {t('home.voteCta')}
          </button>
        </main>
      </div>
    </div>
  )
}
