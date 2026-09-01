import { useEffect, useState } from 'react'
import Awatar from './Awatar'
import { IkonaKorona } from './Ikony'

const KLUCZ_LOCALSTORAGE = 'szpontrank-powitanie-widziane'

export default function PowitanieAnimacja({ profil }) {
  const [widoczna, setWidoczna] = useState(false)
  const [etap, setEtap] = useState('s-wchodzi')

  useEffect(() => {
    if (localStorage.getItem(KLUCZ_LOCALSTORAGE)) return
    setWidoczna(true)

    const kroki = [
      [300, 's-wchodzi'],
      [1100, 'korona-spada'],
      [1600, 's-znika'],
      [1750, 'avatar-wchodzi'],
      [2300, 'korona-laduje'],
      [3300, 'wychodzi'],
    ]
    const timery = kroki.map(([ms, nazwa]) => setTimeout(() => setEtap(nazwa), ms))
    const zakonczTimer = setTimeout(() => {
      localStorage.setItem(KLUCZ_LOCALSTORAGE, '1')
      setWidoczna(false)
    }, 3800)

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

  const pokazS = etap !== 's-znika' && etap !== 'avatar-wchodzi' && etap !== 'korona-laduje' && etap !== 'wychodzi'
  const pokazAvatar = etap === 'avatar-wchodzi' || etap === 'korona-laduje' || etap === 'wychodzi'
  const koronaSpada = etap === 'korona-spada' || etap === 's-znika'
  const koronaNaAvatarze = etap === 'korona-laduje' || etap === 'wychodzi'

  return (
    <div className={`powitanie-nakladka ${etap === 'wychodzi' ? 'znika' : ''}`} onClick={pomin}>
      <div className="powitanie-scena">
        {pokazS && (
          <span className={`powitanie-litera-s ${etap === 's-znika' ? 'powitanie-s-znika' : ''}`}>S</span>
        )}

        {!koronaNaAvatarze && (
          <span className={`powitanie-korona ${koronaSpada ? 'powitanie-korona-spada' : 'powitanie-korona-start'}`}>
            <IkonaKorona rozmiar={46} />
          </span>
        )}

        {pokazAvatar && (
          <span className="powitanie-avatar-wrapper powitanie-avatar-wjazd">
            <Awatar id={profil?.avatar || 'blyskawica'} rozmiar={90} />
          </span>
        )}

        {koronaNaAvatarze && (
          <span className="powitanie-korona powitanie-korona-na-avatarze">
            <IkonaKorona rozmiar={38} />
          </span>
        )}
      </div>
      <p className="powitanie-tekst">Witaj w SzpontRank, {profil?.imie || ''}!</p>
      <span className="powitanie-pomin">dotknij, żeby pominąć</span>
    </div>
  )
}
