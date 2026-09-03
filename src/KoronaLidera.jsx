import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { IkonaKorona } from './Ikony'

export default function KoronaLidera() {
  const [liderzy, setLiderzy] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.rpc('korona_dnia').then(({ data }) => {
      if (data && data.length > 0) setLiderzy(data)
    })
  }, [])

  if (!liderzy || liderzy.length === 0) return null

  const remis = liderzy.length > 1
  const lider = liderzy[0]

  return (
    <button className="korona-lidera-karta" onClick={() => navigate('/panel/topki')}>
      <div className="korona-lidera-ikona">
        <IkonaKorona rozmiar={22} />
      </div>
      {!remis && (
        <div className="ranking-avatar korona-lidera-avatar">
          <Awatar id={lider.avatar || 'blyskawica'} rozmiar={44} />
        </div>
      )}
      <div className="korona-lidera-tekst">
        {remis ? (
          <>
            <span className="korona-lidera-etykieta">Dziś remis</span>
            <span className="korona-lidera-nick">{liderzy.length} osoby na czele</span>
          </>
        ) : (
          <>
            <span className="korona-lidera-etykieta">Koronę dziś nosi</span>
            <span className="korona-lidera-nick">@{lider.nick}</span>
          </>
        )}
      </div>
      <span className="korona-lidera-glosy">{lider.glosy} głosów</span>
    </button>
  )
}
