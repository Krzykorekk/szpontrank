import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarNav from './SidebarNav'
import Awatar from './Awatar'
import { IkonaOsoba } from './Ikony'
import { obliczRange, OdznakaRangi } from './rangi'

export default function UstawieniaPage({ ladowanie, sesja, profil }) {
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

  const kafelki = [
    { do: '/panel/ustawienia/profil', tytul: 'Twój profil', opis: 'Awatar, imię, pseudonim, kanały' },
    { do: '/panel/ustawienia/streak', tytul: 'Twój Streak', opis: 'Jak działa, Zamrożenie, kamienie milowe' },
    { do: '/panel/ustawienia/wyglad', tytul: 'Wygląd', opis: 'Tryb jasny / ciemny' },
    { do: '/panel/ustawienia/bezpieczenstwo', tytul: 'Bezpieczeństwo', opis: 'Hasło, dwuetapowe logowanie' },
    { do: '/panel/ustawienia/konto', tytul: 'Konto', opis: 'E-mail, wylogowanie, usunięcie konta' },
    { do: '/panel/ustawienia/zglos-blad', tytul: 'Zgłoś błąd', opis: 'Coś nie działa? Daj mi znać' },
  ]

  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <div className="panel-naglowek">
            <h1>Profil</h1>
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
              <span className="profil-stat-etykieta">dni streaka</span>
            </div>
            <div className="profil-stat">
              <span className="profil-stat-liczba">{profil.coiny_lacznie || 0}</span>
              <span className="profil-stat-etykieta">Coinów w sumie</span>
            </div>
          </div>

          <div className="profil-menu-siatka">
            {kafelki.map((k) => (
              <button key={k.do} className="profil-menu-kafelek" onClick={() => navigate(k.do)}>
                <IkonaOsoba rozmiar={22} />
                <div>
                  <h3>{k.tytul}</h3>
                  <p>{k.opis}</p>
                </div>
                <span className="profil-menu-strzalka">›</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
