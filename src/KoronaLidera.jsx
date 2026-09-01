import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { IkonaKorona } from './Ikony'

export default function KoronaLidera() {
  const [lider, setLider] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.rpc('ranking_ogolny').then(({ data }) => {
      if (data && data.length > 0) setLider(data[0])
    })
  }, [])

  if (!lider) return null

  return (
    <button className="korona-lidera-karta" onClick={() => navigate('/panel/topki')}>
      <div className="korona-lidera-ikona">
        <IkonaKorona rozmiar={22} />
      </div>
      <div className="ranking-avatar korona-lidera-avatar">
        <Awatar id={lider.avatar || 'blyskawica'} rozmiar={44} />
      </div>
      <div className="korona-lidera-tekst">
        <span className="korona-lidera-etykieta">Koronę dziś nosi</span>
        <span className="korona-lidera-nick">@{lider.nick}</span>
      </div>
      <span className="korona-lidera-glosy">{lider.glosy} głosów</span>
    </button>
  )
}
