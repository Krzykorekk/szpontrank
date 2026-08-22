import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function BramkaMfa({ factorId, onZweryfikowano, onWyloguj }) {
  const [kod, setKod] = useState('')
  const [blad, setBlad] = useState(null)
  const [sprawdzanie, setSprawdzanie] = useState(false)

  async function potwierdz(e) {
    e.preventDefault()
    setBlad(null)
    setSprawdzanie(true)

    const { data: wyzwanie, error: bladWyzwania } = await supabase.auth.mfa.challenge({ factorId })
    if (bladWyzwania) {
      setSprawdzanie(false)
      setBlad(bladWyzwania.message)
      return
    }

    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: wyzwanie.id,
      code: kod.trim(),
    })
    setSprawdzanie(false)

    if (error) {
      setBlad('Nieprawidłowy kod — spróbuj ponownie.')
      return
    }
    onZweryfikowano()
  }

  return (
    <div className="tresc" style={{ maxWidth: 420, margin: '80px auto 0' }}>
      <div className="card card-wyroznik">
        <h2>Kod weryfikacyjny</h2>
        <p className="hint">
          To konto ma włączoną weryfikację dwuetapową. Otwórz aplikację uwierzytelniającą
          (np. Google Authenticator) i wpisz aktualny 6-cyfrowy kod.
        </p>
        <form onSubmit={potwierdz}>
          <label className="pole">
            Kod z aplikacji
            <input
              className="input"
              inputMode="numeric"
              autoFocus
              maxLength={6}
              value={kod}
              onChange={(e) => setKod(e.target.value)}
              placeholder="123456"
            />
          </label>
          {blad && <p className="blad">{blad}</p>}
          <button className="install-btn" type="submit" disabled={sprawdzanie}>
            {sprawdzanie ? 'Sprawdzanie...' : 'Potwierdź'}
          </button>
        </form>
        <button className="install-btn drugorzedny" style={{ marginTop: 10 }} onClick={onWyloguj}>
          Wyloguj się
        </button>
      </div>
    </div>
  )
}
