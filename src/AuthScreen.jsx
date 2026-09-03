import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { supabase } from './supabaseClient'

function przetlumaczBlad(message) {
  if (message.includes('Invalid login credentials')) return 'Nieprawidłowy e-mail lub hasło.'
  if (message.includes('User already registered')) return 'Ten e-mail jest już zarejestrowany — zaloguj się zamiast rejestrować.'
  if (message.includes('Password should be at least')) return 'Hasło musi mieć co najmniej 6 znaków.'
  if (message.includes('Unable to validate email')) return 'Nieprawidłowy adres e-mail.'
  return `Coś poszło nie tak (${message})` // tymczasowo pokazujemy surowy komunikat, żeby zdiagnozować problem
}

export default function AuthScreen() {
  const [tryb, setTryb] = useState('logowanie') // 'logowanie' | 'rejestracja'
  const [email, setEmail] = useState('')
  const [haslo, setHaslo] = useState('')
  const [blad, setBlad] = useState(null)
  const [info, setInfo] = useState(null)
  const [wysylanie, setWysylanie] = useState(false)
  const [zgodaWieku, setZgodaWieku] = useState(false)

  const zalogujOAuth = async (provider) => {
    setBlad(null)

    try {
      if (Capacitor.isNativePlatform()) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: 'eu.szpontrank.app://logowanie',
            skipBrowserRedirect: true,
          },
        })
        if (error) throw error
        if (data?.url) {
          await Browser.open({ url: data.url })
        } else {
          setBlad('Nie udało się przygotować logowania — spróbuj ponownie.')
        }
        return
      }

      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/rejestracja` },
      })
    } catch (e) {
      setBlad(`Błąd logowania: ${e.message || 'nieznany problem'}`)
    }
  }

  const zalogujGoogle = () => zalogujOAuth('google')
  const zalogujDiscord = () => zalogujOAuth('discord')

  const wyslijFormularz = async (e) => {
    e.preventDefault()
    setBlad(null)
    setInfo(null)
    setWysylanie(true)

    if (tryb === 'rejestracja') {
      if (!zgodaWieku) {
        setBlad('Zaznacz oświadczenie dotyczące wieku, żeby założyć konto.')
        setWysylanie(false)
        return
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password: haslo,
        options: { emailRedirectTo: `${window.location.origin}/rejestracja` },
      })
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
    <div className="card card-wyroznik">
      <div className="przelacznik-trybu" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={`przelacznik-btn ${tryb === 'logowanie' ? 'przelacznik-aktywny' : ''}`}
          onClick={() => {
            setTryb('logowanie')
            setBlad(null)
            setInfo(null)
          }}
        >
          Zaloguj się
        </button>
        <button
          type="button"
          className={`przelacznik-btn ${tryb === 'rejestracja' ? 'przelacznik-aktywny' : ''}`}
          onClick={() => {
            setTryb('rejestracja')
            setBlad(null)
            setInfo(null)
          }}
        >
          Załóż konto
        </button>
      </div>

      {tryb === 'rejestracja' && (
        <label className="pole" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, fontSize: '0.85rem', marginBottom: 14 }}>
          <input
            type="checkbox"
            checked={zgodaWieku}
            onChange={(e) => setZgodaWieku(e.target.checked)}
            style={{ marginTop: 3, flexShrink: 0 }}
          />
          <span>
            Mam ukończone 16 lat. Jeśli nie — zgodę na założenie konta wyraża mój rodzic/opiekun
            prawny.
          </span>
        </label>
      )}

      <button
        className="install-btn google-btn"
        type="button"
        onClick={zalogujGoogle}
        disabled={tryb === 'rejestracja' && !zgodaWieku}
      >
        Kontynuuj przez Google
      </button>

      <button
        className="install-btn discord-btn"
        type="button"
        onClick={zalogujDiscord}
        disabled={tryb === 'rejestracja' && !zgodaWieku}
      >
        Kontynuuj przez Discord
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
    </div>
  )
}
