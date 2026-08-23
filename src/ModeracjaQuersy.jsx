import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { IkonaOgien } from './Ikony'

// Twoje testowe konto (xddd) — jedyne na razie w bazie. Jak założysz docelowe
// konto, podmień na jego id (SELECT id FROM profiles WHERE nick = '...').
export const ADMIN_ID = 'aab3c34c-a6c3-48c7-ab5e-5da1cf1dd027'

function ZgloszoneQuersy() {
  const [lista, setLista] = useState([])
  const [ladowanie, setLadowanie] = useState(true)

  async function wczytaj() {
    setLadowanie(true)
    const { data } = await supabase
      .from('quersy')
      .select('*')
      .gt('zgloszenia_count', 0)
      .order('zgloszenia_count', { ascending: false })

    const lista = data || []
    if (lista.length > 0) {
      const autorzy = [...new Set(lista.map((q) => q.autor_id))]
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nick, zbanowany_z_quersy')
        .in('id', autorzy)
      const mapa = Object.fromEntries((profile || []).map((p) => [p.id, p]))
      setLista(lista.map((q) => ({ ...q, autor: mapa[q.autor_id] })))
    } else {
      setLista([])
    }
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
  }, [])

  async function ustawUkryty(id, ukryty) {
    await supabase.from('quersy').update({ ukryty }).eq('id', id)
    wczytaj()
  }

  async function zbanujAutora(autorId, zbanowany) {
    await supabase.from('profiles').update({ zbanowany_z_quersy: zbanowany }).eq('id', autorId)
    wczytaj()
  }

  return (
    <>
      {ladowanie && <p className="debug-status">Ładowanie...</p>}
      {!ladowanie && lista.length === 0 && <p className="hint">Brak zgłoszeń — czysto.</p>}
      <div className="quersy-lista">
        {lista.map((q) => (
          <div className="quers-karta" key={q.id}>
            <div className="quers-gorna-linia">
              <span className="quers-autor tekst-obciety">@{q.autor?.nick || '—'}</span>
              <span className="quers-czas">{q.zgloszenia_count} zgłoszeń</span>
            </div>
            <p className="quers-pytanie">{q.pytanie}</p>
            <p className="hint">{q.temat_a} vs {q.temat_b} · tryb: {q.tryb} · {q.ukryty ? 'ukryty' : 'widoczny'}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="install-btn drugorzedny" onClick={() => ustawUkryty(q.id, !q.ukryty)}>
                {q.ukryty ? 'Przywróć' : 'Ukryj na stałe'}
              </button>
              <button
                className="install-btn drugorzedny"
                onClick={() => zbanujAutora(q.autor_id, !q.autor?.zbanowany_z_quersy)}
              >
                {q.autor?.zbanowany_z_quersy ? 'Odblokuj autora' : 'Zbanuj autora (Quersy)'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Uzytkownicy() {
  const [lista, setLista] = useState([])
  const [ladowanie, setLadowanie] = useState(true)
  const [szukaj, setSzukaj] = useState('')

  async function wczytaj() {
    setLadowanie(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, imie, nick, streak_dni, ogolna_topka, zbanowany_z_quersy, created_at')
      .order('created_at', { ascending: false })
    setLista(data || [])
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
  }, [])

  async function przelaczBan(id, zbanowany) {
    await supabase.from('profiles').update({ zbanowany_z_quersy: zbanowany }).eq('id', id)
    wczytaj()
  }

  const przefiltrowani = lista.filter(
    (u) =>
      u.nick?.toLowerCase().includes(szukaj.toLowerCase()) ||
      u.imie?.toLowerCase().includes(szukaj.toLowerCase())
  )

  return (
    <>
      <input
        className="input"
        placeholder="Szukaj po nicku lub imieniu..."
        value={szukaj}
        onChange={(e) => setSzukaj(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      {ladowanie && <p className="debug-status">Ładowanie...</p>}
      {!ladowanie && przefiltrowani.length === 0 && <p className="hint">Brak wyników.</p>}
      <ul className="ranking-lista">
        {przefiltrowani.map((u) => (
          <li className="ranking-wiersz" key={u.id} style={{ flexWrap: 'wrap' }}>
            <span className="ranking-nazwa">
              {u.imie} <span className="ranking-nick">@{u.nick}</span>
            </span>
            <span className="ranking-glosy" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <IkonaOgien rozmiar={14} />{u.streak_dni || 0}
            </span>
            {u.zbanowany_z_quersy && <span className="typ-pill typ-grupa">zbanowany</span>}
            <button
              className="install-btn drugorzedny"
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
              onClick={() => przelaczBan(u.id, !u.zbanowany_z_quersy)}
            >
              {u.zbanowany_z_quersy ? 'Odbanuj' : 'Zbanuj z Quersów'}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function ModeracjaQuersy({ userId }) {
  const [zakladka, setZakladka] = useState('zgloszenia')

  if (userId !== ADMIN_ID) {
    return (
      <div className="card">
        <p className="hint">Ta strona jest dostępna tylko dla administratora.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Panel moderatora</h2>
      <div className="zakladki" style={{ marginTop: 12 }}>
        <button className={`zakladka ${zakladka === 'zgloszenia' ? 'aktywna' : ''}`} onClick={() => setZakladka('zgloszenia')}>
          Zgłoszone Quersy
        </button>
        <button className={`zakladka ${zakladka === 'uzytkownicy' ? 'aktywna' : ''}`} onClick={() => setZakladka('uzytkownicy')}>
          Użytkownicy
        </button>
      </div>
      {zakladka === 'zgloszenia' ? <ZgloszoneQuersy /> : <Uzytkownicy />}
    </div>
  )
}
