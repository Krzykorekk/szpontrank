import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const TYTULY = ['Przerwa techniczna', 'Start wkrótce']

export default function PanelAdmina() {
  const [dane, setDane] = useState(null)
  const [tytul, setTytul] = useState(TYTULY[0])
  const [wiadomosc, setWiadomosc] = useState('')
  const [dataStartu, setDataStartu] = useState('')
  const [pokazOdliczanie, setPokazOdliczanie] = useState(false)
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
        setTytul(data?.tytul_konserwacji || TYTULY[0])
        setWiadomosc(data?.wiadomosc_konserwacji || '')
        setPokazOdliczanie(!!data?.pokazuj_odliczanie)
        if (data?.data_startu) {
          setDataStartu(new Date(data.data_startu).toISOString().slice(0, 16))
        }
      })
  }, [])

  async function zapisz(payload) {
    setZapisywanie(true)
    setSukces(false)
    const { data, error } = await supabase
      .from('ustawienia_globalne')
      .update(payload)
      .eq('id', 1)
      .select()
      .maybeSingle()
    setZapisywanie(false)
    if (!error) {
      setDane(data)
      setSukces(true)
    }
  }

  function zbierzPola() {
    return {
      tytul_konserwacji: tytul,
      wiadomosc_konserwacji: wiadomosc,
      data_startu: dataStartu ? new Date(dataStartu).toISOString() : null,
      pokazuj_odliczanie: pokazOdliczanie,
    }
  }

  if (!dane) return null

  return (
    <div className="card karta-niebezpieczna" style={{ marginTop: 18 }}>
      <h2>Panel administratora</h2>
      <p className="hint">
        Tryb konserwacji blokuje dostęp do appki dla wszystkich oprócz Ciebie — pokazuje im
        zamiast tego ten ekran.
      </p>

      <label className="pole">
        Tytuł
        <select className="input" value={tytul} onChange={(e) => setTytul(e.target.value)}>
          {TYTULY.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="pole">
        Komunikat dla użytkowników
        <textarea
          className="input"
          rows={2}
          value={wiadomosc}
          onChange={(e) => setWiadomosc(e.target.value)}
        />
      </label>

      <label className="pole">
        Data startu (opcjonalnie)
        <input
          className="input"
          type="datetime-local"
          value={dataStartu}
          onChange={(e) => setDataStartu(e.target.value)}
        />
      </label>

      <label className="pole" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <input
          type="checkbox"
          checked={pokazOdliczanie}
          onChange={(e) => setPokazOdliczanie(e.target.checked)}
        />
        Pokaż odliczanie do daty startu
      </label>

      {sukces && <p className="status-pill">Zapisano ✓</p>}

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 8 }}>
        {dane.tryb_konserwacji ? (
          <button
            className="install-btn"
            onClick={() => zapisz({ ...zbierzPola(), tryb_konserwacji: false })}
            disabled={zapisywanie}
          >
            {zapisywanie ? 'Wyłączanie...' : 'Wyłącz blokadę'}
          </button>
        ) : (
          <button
            className="install-btn drugorzedny"
            onClick={() => zapisz({ ...zbierzPola(), tryb_konserwacji: true })}
            disabled={zapisywanie}
          >
            {zapisywanie ? 'Włączanie...' : 'Włącz blokadę'}
          </button>
        )}
        <button
          className="install-btn drugorzedny"
          onClick={() => zapisz(zbierzPola())}
          disabled={zapisywanie}
        >
          Zapisz bez zmiany stanu
        </button>
      </div>
    </div>
  )
}
