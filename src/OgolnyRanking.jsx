import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { IkonaKorona } from './Ikony'
import OdznakaWlasciciela from './OdznakaWlasciciela'

export default function OgolnyRanking({ onWstecz, pokazNaglowek = true }) {
  const [lista, setLista] = useState(null)
  const [blad, setBlad] = useState(null)

  useEffect(() => {
    supabase.rpc('ranking_ogolny').then(({ data, error }) => {
      if (error) setBlad(error.message)
      else setLista(data || [])
    })
  }, [])

  return (
    <div className="topki-panel">
      {pokazNaglowek && (
        <>
          <button className="wstecz-btn" onClick={onWstecz}>
            ‹ Wróć do Rankingów
          </button>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em', margin: '0 0 6px' }}>
            Ogólny Ranking Apki
          </h1>
          <p className="hint" style={{ marginBottom: 18 }}>
            Suma głosów, jakie dana osoba dostała łącznie we wszystkich swoich Rankingach. Widać tu tylko
            osoby, które włączyły widoczność w Ustawieniach.
          </p>
        </>
      )}

      {blad && <p className="blad">{blad}</p>}
      {!lista && !blad && <p className="debug-status">Ładowanie...</p>}
      {lista && lista.length === 0 && <p className="hint">Nikt jeszcze nie dołączył do rankingu.</p>}

      {lista && lista.length > 0 && (
        <ul className="ranking-lista card">
          {lista.map((w, i) => (
            <li className="ranking-wiersz" key={w.user_id}>
              <span className="ranking-pozycja">{i === 0 ? <IkonaKorona rozmiar={18} /> : i + 1}</span>
              <span className="ranking-avatar"><Awatar id={w.avatar} rozmiar={26} /></span>
              <span className="ranking-nazwa">
                @{w.nick} <OdznakaWlasciciela userId={w.user_id} />
              </span>
              <span className="ranking-glosy">
                {w.glosy} {w.glosy === 1 ? 'głos' : 'głosów'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
