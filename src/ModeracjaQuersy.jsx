import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

// Twoje testowe konto (xddd) — jedyne na razie w bazie. Jak założysz docelowe
// konto, podmień na jego id (SELECT id FROM profiles WHERE nick = '...').
export const ADMIN_ID = 'aab3c34c-a6c3-48c7-ab5e-5da1cf1dd027'

export default function ModeracjaQuersy({ userId }) {
  const [lista, setLista] = useState([])
  const [ladowanie, setLadowanie] = useState(true)

  async function wczytaj() {
    setLadowanie(true)
    const { data } = await supabase
      .from('quersy')
      .select('*')
      .gt('zgloszenia_count', 0)
      .order('zgloszenia_count', { ascending: false })
    setLista(data || [])
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
  }, [])

  async function ustawUkryty(id, ukryty) {
    await supabase.from('quersy').update({ ukryty }).eq('id', id)
    wczytaj()
  }

  if (userId !== ADMIN_ID) {
    return (
      <div className="card">
        <p className="hint">Ta strona jest dostępna tylko dla administratora.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Zgłoszone Quersy</h2>
      {ladowanie && <p className="debug-status">Ładowanie...</p>}
      {!ladowanie && lista.length === 0 && <p className="hint">Brak zgłoszeń — czysto.</p>}
      <div className="quersy-lista">
        {lista.map((q) => (
          <div className="quers-karta" key={q.id}>
            <div className="quers-gorna-linia">
              <span className="quers-czas">{q.zgloszenia_count} zgłoszeń</span>
              <span className="quers-czas">{q.ukryty ? 'ukryty' : 'widoczny'}</span>
            </div>
            <p className="quers-pytanie">{q.pytanie}</p>
            <p className="hint">{q.temat_a} vs {q.temat_b} · tryb: {q.tryb}</p>
            <button
              className="install-btn drugorzedny"
              onClick={() => ustawUkryty(q.id, !q.ukryty)}
            >
              {q.ukryty ? 'Przywróć' : 'Ukryj na stałe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
