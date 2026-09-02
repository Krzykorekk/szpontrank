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
      [300, 's-wchodzi'],
      [1200, 's-swieci'],
      [2600, 's-znika'],
      [2800, 'avatar-wchodzi'],
      [4000, 'impakt'],
      [5200, 'wychodzi'],
    ]
    const timery = kroki.map(([ms, nazwa]) => setTimeout(() => setEtap(nazwa), ms))
    const zakonczTimer = setTimeout(() => {
      localStorage.setItem(KLUCZ_LOCALSTORAGE, '1')
      setWidoczna(false)
    }, 5800)

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

  const pokazS = ['s-wchodzi', 's-swieci', 's-znika'].includes(etap)
  const sSwieci = etap === 's-swieci'
  const sZnika = etap === 's-znika'
  const pokazAvatar = ['avatar-wchodzi', 'impakt', 'wychodzi'].includes(etap)
  const pokazImpakt = etap === 'impakt' || etap === 'wychodzi'
  const koronaLeci = etap !== 'start'

  return (
    <div className={`powitanie-nakladka ${etap === 'wychodzi' ? 'znika' : ''}`} onClick={pomin}>
      <div className="powitanie-scena">
        {pokazS && (
          <span className={`powitanie-litera-s ${sSwieci ? 'powitanie-s-swieci' : ''} ${sZnika ? 'powitanie-s-znika' : ''}`}>
            S
          </span>
        )}

        {pokazAvatar && (
          <span className="powitanie-avatar-wrapper powitanie-avatar-wjazd">
            <Awatar id={profil?.avatar || 'blyskawica'} rozmiar={110} />
          </span>
        )}

        {koronaLeci && (
          <span className="powitanie-korona-lot">
            <IkonaKorona rozmiar={54} />
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
