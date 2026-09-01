import { useEffect, useState } from 'react'
import Awatar from './Awatar'
import { IkonaKorona } from './Ikony'

const KLUCZ_LOCALSTORAGE = 'szpontrank-powitanie-widziane'

export default function PowitanieAnimacja({ profil }) {
  const [widoczna, setWidoczna] = useState(false)
  const [etap, setEtap] = useState('start')

  useEffect(() => {
    if (localStorage.getItem(KLUCZ_LOCALSTORAGE)) return
    setWidoczna(true)

    const kroki = [
      [400, 'logo-wchodzi'],
      [1400, 'logo-swieci'],
      [2400, 'korona-odrywa'],
      [3100, 'korona-spada'],
      [3700, 'logo-znika'],
      [3900, 'avatar-wchodzi'],
      [4600, 'korona-laduje'],
      [5100, 'impakt'],
      [6300, 'wychodzi'],
    ]
    const timery = kroki.map(([ms, nazwa]) => setTimeout(() => setEtap(nazwa), ms))
    const zakonczTimer = setTimeout(() => {
      localStorage.setItem(KLUCZ_LOCALSTORAGE, '1')
      setWidoczna(false)
    }, 6900)

    return () => {
      timery.forEach(clearTimeout)
      clearTimeout(zakonczTimer)
    }
  }, [])

  if (!widoczna) return null

  function pomin() {
    localStorage.setItem(KLUCZ_LOCALSTORAGE, '1')
    setWidoczna(false)
  }

  const etapy = ['logo-wchodzi', 'logo-swieci', 'korona-odrywa', 'korona-spada', 'logo-znika']
  const pokazLogo = etapy.includes(etap)
  const logoSwieci = etap === 'logo-swieci' || etap === 'korona-odrywa'
  const koronaOderwana = etap === 'korona-odrywa'
  const koronaSpada = etap === 'korona-spada' || etap === 'logo-znika'
  const logoZnika = etap === 'logo-znika'

  const pokazAvatar = ['avatar-wchodzi', 'korona-laduje', 'impakt', 'wychodzi'].includes(etap)
  const koronaNaAvatarze = ['korona-laduje', 'impakt', 'wychodzi'].includes(etap)
  const pokazImpakt = etap === 'impakt' || etap === 'wychodzi'

  return (
    <div className={`powitanie-nakladka ${etap === 'wychodzi' ? 'znika' : ''}`} onClick={pomin}>
      <div className="powitanie-scena">
        {pokazLogo && (
          <img
            src="/brand/emblem.png"
            alt=""
            className={`powitanie-logo ${logoSwieci ? 'powitanie-logo-swieci' : ''} ${logoZnika ? 'powitanie-logo-znika' : ''}`}
          />
        )}

        {(koronaOderwana || koronaSpada) && (
          <span className={`powitanie-korona ${koronaSpada ? 'powitanie-korona-spada' : 'powitanie-korona-odrywanie'}`}>
            <IkonaKorona rozmiar={54} />
          </span>
        )}

        {pokazAvatar && (
          <span className="powitanie-avatar-wrapper powitanie-avatar-wjazd">
            <Awatar id={profil?.avatar || 'blyskawica'} rozmiar={110} />
          </span>
        )}

        {koronaNaAvatarze && (
          <span className="powitanie-korona powitanie-korona-na-avatarze">
            <IkonaKorona rozmiar={46} />
          </span>
        )}

        {pokazImpakt && <span className="powitanie-impakt-pierscien" />}
      </div>
      <p className={`powitanie-tekst ${pokazAvatar ? 'powitanie-tekst-widoczny' : ''}`}>
        Witaj w SzpontRank, {profil?.imie || ''}!
      </p>
      <span className="powitanie-pomin">dotknij, żeby pominąć</span>
    </div>
  )
}
