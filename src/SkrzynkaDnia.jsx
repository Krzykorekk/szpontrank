import { useState } from 'react'
import { supabase } from './supabaseClient'
import { IkonaMoneta } from './Ikony'

export default function SkrzynkaDnia({ profil, onZaktualizowano }) {
  const [otwieranie, setOtwieranie] = useState(false)
  const [nagroda, setNagroda] = useState(null)
  const jużOtwarta = profil.skrzynka_ostatnio === new Date().toISOString().slice(0, 10)

  async function otworz() {
    if (jużOtwarta || otwieranie) return
    setOtwieranie(true)
    const { data, error } = await supabase.rpc('otworz_skrzynke_dnia')
    setOtwieranie(false)
    if (!error && data?.ok) {
      setNagroda(data.nagroda)
      onZaktualizowano?.()
    }
  }

  return (
    <button
      className={`skrzynka-karta ${jużOtwarta ? 'zamknieta' : 'gotowa'}`}
      onClick={otworz}
      disabled={jużOtwarta || otwieranie}
    >
      <div className={`skrzynka-przycisk ${jużOtwarta ? 'zamknieta' : 'gotowa'}`}>
        <IkonaMoneta rozmiar={30} />
      </div>
      <div>
        <h3>Skrzynka Dnia</h3>
        {nagroda !== null ? (
          <p className="skrzynka-nagroda">+{nagroda} Coinów!</p>
        ) : (
          <p className="hint" style={{ margin: 0 }}>
            {jużOtwarta ? 'Otwarta — wróć jutro po kolejną.' : 'Kliknij, żeby odebrać losową nagrodę.'}
          </p>
        )}
      </div>
    </button>
  )
}
