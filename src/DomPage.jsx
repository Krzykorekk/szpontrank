import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarNav from './SidebarNav'
import { IkonaMoneta, IkonaOgien } from './Ikony'
import PojedynekDnia from './PojedynekDnia'
import SkrzynkaDnia from './SkrzynkaDnia'
import PytanieDnia from './PytanieDnia'
import KoronaLidera from './KoronaLidera'
import PowitanieAnimacja from './PowitanieAnimacja'

export default function DomPage({ ladowanie, sesja, profil }) {
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
          <KoronaLidera />

          <PowitanieAnimacja profil={profil} />

          <div className="panel-naglowek">
            <h1>Cześć, {profil.imie}</h1>
          </div>

          <PytanieDnia userId={sesja.user.id} />

          <PojedynekDnia userId={sesja.user.id} />

          <SkrzynkaDnia profil={profil} />

          <button className="dom-coiny-pasek dom-streak-pasek" onClick={() => navigate('/panel/ustawienia/streak')}>
            <span className="dom-coiny-ikona dom-streak-ikona"><IkonaOgien rozmiar={26} /></span>
            <span className="dom-coiny-tekst">
              <span className="dom-coiny-liczba">
                {profil.streak_dni || 0} {profil.streak_dni === 1 ? 'dzień z rzędu' : 'dni z rzędu'}
              </span>
              <span className="dom-coiny-etykieta">Streak — zobacz szczegóły i Zamrożenia</span>
            </span>
            <span className="dom-coiny-strzalka">→</span>
          </button>

          <button className="dom-coiny-pasek" onClick={() => navigate('/panel/coiny')}>
            <span className="dom-coiny-ikona"><IkonaMoneta rozmiar={26} /></span>
            <span className="dom-coiny-tekst">
              <span className="dom-coiny-liczba">{profil.coiny || 0}</span>
              <span className="dom-coiny-etykieta">Coiny — zobacz sklep i historię</span>
            </span>
            <span className="dom-coiny-strzalka">→</span>
          </button>

          <button className="install-btn dom-glosuj-cta" onClick={() => navigate('/panel/topki')}>
            Zagłosuj w Rankingach →
          </button>
        </main>
      </div>
    </div>
  )
}
