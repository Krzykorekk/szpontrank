import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function PanelAdmina() {
  const [dane, setDane] = useState(null)
  const [wiadomosc, setWiadomosc] = useState('')
  const [zapisywanie, setZapisywanie] = useState(false)
  const [sukces, setSukces] = useState(false)

  useEffect(() => {
    supabase
      .from('ustawienia_globalne')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        setDane(data)
        setWiadomosc(data?.wiadomosc_konserwacji || '')
      })
  }, [])

  async function przelacz(wlacz) {
    setZapisywanie(true)
    setSukces(false)
    const { data, error } = await supabase
      .from('ustawienia_globalne')
      .update({ tryb_konserwacji: wlacz, wiadomosc_konserwacji: wiadomosc })
      .eq('id', 1)
      .select()
      .maybeSingle()
    setZapisywanie(false)
    if (!error) {
      setDane(data)
      setSukces(true)
    }
  }

  if (!dane) return null

  return (
    <div className="card karta-niebezpieczna" style={{ marginTop: 18 }}>
      <h2>Panel administratora</h2>
      <p className="hint">
        Tryb konserwacji blokuje dostęp do appki dla wszystkich oprócz Ciebie — pokazuje im
        zamiast tego krótki komunikat.
      </p>

      <label className="pole">
        Komunikat dla użytkowników
        <textarea
          className="input"
          rows={2}
          value={wiadomosc}
          onChange={(e) => setWiadomosc(e.target.value)}
        />
      </label>

      {sukces && <p className="status-pill">Zapisano ✓</p>}

      {dane.tryb_konserwacji ? (
        <button className="install-btn" onClick={() => przelacz(false)} disabled={zapisywanie}>
          {zapisywanie ? 'Wyłączanie...' : 'Wyłącz tryb konserwacji'}
        </button>
      ) : (
        <button className="install-btn drugorzedny" onClick={() => przelacz(true)} disabled={zapisywanie}>
          {zapisywanie ? 'Włączanie...' : 'Włącz tryb konserwacji'}
        </button>
      )}
    </div>
  )
}
