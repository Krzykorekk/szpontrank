import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { SocialLogin } from '@capgo/capacitor-social-login'
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

  const zalogujGoogle = async () => {
    setBlad(null)

    if (Capacitor.isNativePlatform()) {
      // Natywne okno logowania Google (Google Play Services) - bez przegladarki,
      // bez linkow powrotnych. To oficjalnie wspierany przez Supabase sposob
      // logowania w appkach mobilnych (signInWithIdToken).
      try {
        const { result } = await SocialLogin.login({
          provider: 'google',
          options: { scopes: ['email', 'profile'] },
        })
        if (!result?.idToken) {
          setBlad('Nie udało się zalogować przez Google — spróbuj ponownie.')
          return
        }
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: result.idToken,
        })
        if (error) setBlad(`Błąd logowania: ${error.message}`)
      } catch (e) {
        setBlad(`Błąd logowania przez Google: ${e.message || 'nieznany problem'}`)
      }
      return
    }

    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/rejestracja` },
      })
    } catch (e) {
      setBlad(`Błąd logowania: ${e.message || 'nieznany problem'}`)
    }
  }

  const zalogujDiscord = async () => {
    setBlad(null)

    if (Capacitor.isNativePlatform()) {
      // Discord nie ma natywnego SDK jak Google Play Services - na razie
      // otwieramy dzialajaca strone webowa (logowanie w appce dokonczysz tam).
      await Browser.open({ url: 'https://szpontrank.eu/rejestracja' })
      return
    }

    try {
      await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: { redirectTo: `${window.location.origin}/rejestracja` },
      })
    } catch (e) {
      setBlad(`Błąd logowania: ${e.message || 'nieznany problem'}`)
    }
  }

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
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <img src="/brand/emblem.png" alt="SzpontRank" style={{ width: 52, height: 52 }} />
      </div>

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

      <>
        <button
          className="install-btn google-btn"
          type="button"
          onClick={zalogujGoogle}
          disabled={tryb === 'rejestracja' && !zgodaWieku}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33C2.44 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.97 10.72c-.18-.54-.28-1.11-.28-1.72s.1-1.18.28-1.72V4.95H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
            </svg>
            Kontynuuj przez Google
          </button>

          <button
            className="install-btn discord-btn"
            type="button"
            onClick={zalogujDiscord}
            disabled={tryb === 'rejestracja' && !zgodaWieku}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" style={{ flexShrink: 0 }}>
              <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Kontynuuj przez Discord
          </button>

        <div className="separator">albo</div>
      </>

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
