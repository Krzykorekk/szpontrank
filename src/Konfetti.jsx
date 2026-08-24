import { useEffect, useState } from 'react'

const KOLORY = ['#e8492e', '#f5a623', '#f2935c', '#c9432b', '#ffd166']

export default function Konfetti({ aktywne }) {
  const [widoczne, setWidoczne] = useState(false)

  useEffect(() => {
    if (!aktywne) return
    setWidoczne(true)
    const t = setTimeout(() => setWidoczne(false), 1300)
    return () => clearTimeout(t)
  }, [aktywne])

  if (!widoczne) return null

  const kawalki = Array.from({ length: 28 }, (_, i) => {
    const lewo = Math.random() * 100
    const opoznienie = Math.random() * 0.15
    const czasTrwania = 0.9 + Math.random() * 0.6
    const kolor = KOLORY[i % KOLORY.length]
    const rotacja = Math.random() * 360
    const rozmiar = 6 + Math.random() * 5
    return (
      <span
        key={i}
        className="konfetti-kawalek"
        style={{
          left: `${lewo}%`,
          background: kolor,
          width: rozmiar,
          height: rozmiar * 0.4,
          animationDelay: `${opoznienie}s`,
          animationDuration: `${czasTrwania}s`,
          transform: `rotate(${rotacja}deg)`,
        }}
      />
    )
  })

  return <div className="konfetti-kontener" aria-hidden="true">{kawalki}</div>
}
