import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SidebarNav from './SidebarNav'
import Awatar from './Awatar'
import { obliczRange, OdznakaRangi } from './rangi'

export default function UstawieniaPage({ ladowanie, sesja, profil }) {
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
        <p className="debug-status">{t('topki.loading')}</p>
      </div>
    )
  }

  const kafelki = [
    { do: '/panel/ustawienia/profil', tytul: t('settings.profileTile.title'), opis: t('settings.profileTile.desc') },
    { do: '/panel/ustawienia/streak', tytul: t('settings.streakTile.title'), opis: t('settings.streakTile.desc') },
    { do: '/panel/ustawienia/wyglad', tytul: t('settings.appearanceTile.title'), opis: t('settings.appearanceTile.desc') },
    { do: '/panel/ustawienia/jezyk', tytul: t('settings.languageTile.title'), opis: t('settings.languageTile.desc') },
    { do: '/panel/ustawienia/bezpieczenstwo', tytul: t('settings.securityTile.title'), opis: t('settings.securityTile.desc') },
    { do: '/panel/ustawienia/konto', tytul: t('settings.accountTile.title'), opis: t('settings.accountTile.desc') },
    { do: '/panel/ustawienia/zglos-blad', tytul: t('settings.reportTile.title'), opis: t('settings.reportTile.desc') },
  ]

  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <div className="panel-naglowek">
            <h1>{t('settings.title')}</h1>
          </div>

          <div className="profil-glowna-karta">
            <div className="avatar-korona"><Awatar id={profil.avatar || 'blyskawica'} rozmiar={40} /></div>
            <div>
              <h2 style={{ margin: '0 0 2px' }}>{profil.imie}</h2>
              <p className="hint" style={{ margin: 0 }}>@{profil.nick}</p>
            </div>
          </div>

          <div className="profil-staty">
            <div className="profil-stat">
              <OdznakaRangi klucz={obliczRange(profil.coiny_lacznie).biezaca.klucz} rozmiar={26} />
              <span className="profil-stat-etykieta" style={{ marginTop: 4, display: 'block' }}>
                {obliczRange(profil.coiny_lacznie).biezaca.nazwa}
              </span>
            </div>
            <div className="profil-stat">
              <span className="profil-stat-liczba">{profil.streak_dni || 0}</span>
              <span className="profil-stat-etykieta">{t('settings.streakDays')}</span>
            </div>
            <div className="profil-stat">
              <span className="profil-stat-liczba">{profil.coiny_lacznie || 0}</span>
              <span className="profil-stat-etykieta">{t('settings.totalCoins')}</span>
            </div>
          </div>

          <div className="profil-menu-siatka">
            {kafelki.map((k) => (
              <button key={k.do} className="profil-menu-kafelek" onClick={() => navigate(k.do)}>
                <h3>{k.tytul}</h3>
                <span className="profil-menu-strzalka">›</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
