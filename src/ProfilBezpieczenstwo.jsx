import { useState } from 'react'
import { supabase } from './supabaseClient'
import Sekcja2FA from './Sekcja2FA'
import PodstronaProfilu from './PodstronaProfilu'

export default function ProfilBezpieczenstwo({ sesja, profil }) {
  const [noweHaslo, setNoweHaslo] = useState('')
  const [powtorzHaslo, setPowtorzHaslo] = useState('')
  const [bladHasla, setBladHasla] = useState(null)
  const [sukcesHasla, setSukcesHasla] = useState(false)
  const [zmienianieHasla, setZmienianieHasla] = useState(false)
  const maJuzHaslo = sesja?.user?.app_metadata?.provider === 'email'

  async function zmienHaslo(e) {
    e.preventDefault()
    setBladHasla(null)
    setSukcesHasla(false)

    if (noweHaslo.length < 6) {
      setBladHasla('Hasło musi mieć co najmniej 6 znaków.')
      return
    }
    if (noweHaslo !== powtorzHaslo) {
      setBladHasla('Hasła nie są takie same.')
      return
    }

    setZmienianieHasla(true)
    const { error } = await supabase.auth.updateUser({ password: noweHaslo })
    setZmienianieHasla(false)

    if (error) {
      setBladHasla(`Nie udało się zmienić hasła (${error.message})`)
      return
    }
    setNoweHaslo('')
    setPowtorzHaslo('')
    setSukcesHasla(true)
  }

  return (
    <PodstronaProfilu
      tytul="Bezpieczeństwo"
      profil={profil}
      dzieci={
        <>
          <form className="card" onSubmit={zmienHaslo}>
            <h2>{maJuzHaslo ? 'Zmień hasło' : 'Ustaw hasło'}</h2>
            {!maJuzHaslo && (
              <p className="hint">
                Logujesz się przez Google — możesz dodatkowo ustawić hasło, żeby móc się zalogować
                też e-mailem i hasłem.
              </p>
            )}
            <label className="pole">
              {maJuzHaslo ? 'Nowe hasło' : 'Hasło'}
              <input className="input" type="password" minLength={6} required value={noweHaslo} onChange={(e) => setNoweHaslo(e.target.value)} />
            </label>
            <label className="pole">
              Powtórz hasło
              <input className="input" type="password" minLength={6} required value={powtorzHaslo} onChange={(e) => setPowtorzHaslo(e.target.value)} />
            </label>
            {bladHasla && <p className="blad">{bladHasla}</p>}
            {sukcesHasla && <p className="status-pill">Hasło zapisane ✓</p>}
            <button className="install-btn" type="submit" disabled={zmienianieHasla}>
              {zmienianieHasla ? 'Zapisywanie...' : maJuzHaslo ? 'Zmień hasło' : 'Ustaw hasło'}
            </button>
          </form>

          <Sekcja2FA />
        </>
      }
    />
  )
}
