import { useState } from 'react'
import { supabase } from './supabaseClient'

function przetlumaczBlad(message) {
  if (message.includes('Invalid login credentials')) return 'Nieprawidłowy e-mail lub hasło.'
  if (message.includes('User already registered')) return 'Ten e-mail jest już zarejestrowany — zaloguj się zamiast rejestrować.'
  if (message.includes('Password should be at least')) return 'Hasło musi mieć co najmniej 6 znaków.'
  if (message.includes('Unable to validate email')) return 'Nieprawidłowy adres e-mail.'
  return 'Coś poszło nie tak. Spróbuj ponownie.'
}

export default function AuthScreen() {
  const [tryb, setTryb] = useState('logowanie') // 'logowanie' | 'rejestracja'
  const [email, setEmail] = useState('')
  const [haslo, setHaslo] = useState('')
  const [blad, setBlad] = useState(null)
  const [info, setInfo] = useState(null)
  const [wysylanie, setWysylanie] = useState(false)

  const zalogujGoogle = async () => {
    setBlad(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const wyslijFormularz = async (e) => {
    e.preventDefault()
    setBlad(null)
    setInfo(null)
    setWysylanie(true)

    if (tryb === 'rejestracja') {
      const { data, error } = await supabase.auth.signUp({ email, password: haslo })
      setWysylanie(false)
      if (error) {
        setBlad(przetlumaczBlad(error.message))
        return
      }
      if (!data.session) {
        setInfo('Konto utworzone! Sprawdź maila i kliknij link potwierdzający, żeby dokończyć rejestrację.')
      }
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password: haslo })
    setWysylanie(false)
    if (error) {
      setBlad(przetlumaczBlad(error.message))
    }
  }

  return (
    <div className="card">
      <h2>{tryb === 'logowanie' ? 'Zaloguj się' : 'Załóż konto'}</h2>

      <button className="install-btn google-btn" type="button" onClick={zalogujGoogle}>
        Kontynuuj przez Google
      </button>

      <div className="separator">albo</div>

      <form onSubmit={wyslijFormularz}>
        <label className="pole">
          E-mail
          <input
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.pl"
          />
        </label>
        <label className="pole">
          Hasło
          <input
            type="password"
            required
            minLength={6}
            className="input"
            value={haslo}
            onChange={(e) => setHaslo(e.target.value)}
            placeholder="min. 6 znaków"
          />
        </label>

        {blad && <p className="blad">{blad}</p>}
        {info && <p className="hint">{info}</p>}

        <button className="install-btn" type="submit" disabled={wysylanie}>
          {wysylanie ? 'Chwila...' : tryb === 'logowanie' ? 'Zaloguj się' : 'Zarejestruj się'}
        </button>
      </form>

      <p className="przelacznik">
        {tryb === 'logowanie' ? 'Nie masz jeszcze konta?' : 'Masz już konto?'}{' '}
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setTryb(tryb === 'logowanie' ? 'rejestracja' : 'logowanie')
            setBlad(null)
            setInfo(null)
          }}
        >
          {tryb === 'logowanie' ? 'Zarejestruj się' : 'Zaloguj się'}
        </button>
      </p>
    </div>
  )
}
