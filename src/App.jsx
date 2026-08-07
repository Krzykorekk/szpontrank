import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import AuthScreen from './AuthScreen'
import ProfileSetup from './ProfileSetup'
import TopkiPanel from './TopkiPanel'

function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    const onInstalled = () => setInstalled(true)

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return { canInstall: !!deferredPrompt, installed, promptInstall }
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

const FUNKCJE = [
  {
    ikona: '👑',
    tytul: 'Korona Dnia',
    opis: 'Kto zbierze najwięcej głosów, nosi koronę przez 24h.',
  },
  {
    ikona: '🔥',
    tytul: 'Streaki',
    opis: 'Głosuj codziennie i buduj serię — nie daj jej zgasnąć.',
  },
  {
    ikona: '🏫',
    tytul: 'Klasa i Ekipa',
    opis: 'Osobne Topki na szkołę i osobne na znajomych.',
  },
]

export default function App() {
  const { canInstall, installed, promptInstall } = useInstallPrompt()
  const showIOSHint = isIOS() && !isStandalone()

  const [ladowanie, setLadowanie] = useState(true)
  const [sesja, setSesja] = useState(null)
  const [profil, setProfil] = useState(null)

  const wczytajProfil = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    setProfil(data)
  }

  const posprzatajAdres = () => {
    if (window.location.hash || window.location.search) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSesja(session)
      if (session) {
        await wczytajProfil(session.user.id)
        posprzatajAdres()
      }
      setLadowanie(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSesja(session)
      if (session) {
        await wczytajProfil(session.user.id)
        posprzatajAdres()
      } else {
        setProfil(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const wyloguj = async () => {
    await supabase.auth.signOut()
  }

  const zalogowany = !ladowanie && sesja

  return (
    <div className="page">
      <div className="glow" />
      <div className="glow glow-lewy" />

      <header className="hero">
        <h1>
          <img src="/brand/wordmark.png" alt="SzpontRank" className="wordmark" />
        </h1>
        <p className="tagline">Codzienne pytania. Twoja klasa. Twoja ekipa. Twoja korona.</p>

        {!installed && canInstall && (
          <button className="install-btn" onClick={promptInstall}>
            Zainstaluj appkę
          </button>
        )}

        {showIOSHint && (
          <div className="ios-hint">
            📲 Kliknij <strong>Udostępnij</strong> → <strong>Dodaj do ekranu głównego</strong>, żeby zainstalować SzpontRank.
          </div>
        )}
      </header>

      {!zalogowany && (
        <section className="funkcje">
          {FUNKCJE.map((f) => (
            <div className="funkcja-karta" key={f.tytul}>
              <span className="funkcja-ikona">{f.ikona}</span>
              <h3>{f.tytul}</h3>
              <p>{f.opis}</p>
            </div>
          ))}
        </section>
      )}

      <main className="content">
        {ladowanie && <p className="debug-status">Ładowanie...</p>}

        {!ladowanie && !sesja && <AuthScreen />}

        {!ladowanie && sesja && !profil && (
          <ProfileSetup userId={sesja.user.id} onGotowe={() => wczytajProfil(sesja.user.id)} />
        )}

        {!ladowanie && sesja && profil && (
          <>
            <div className="card powitanie">
              <h2>Cześć, {profil.imie}! 👑</h2>
              <p>Twój pseudonim: @{profil.nick}</p>
              <button className="install-btn wyloguj" onClick={wyloguj}>
                Wyloguj się
              </button>
            </div>
            <TopkiPanel userId={sesja.user.id} />
          </>
        )}
      </main>

      <footer className="stopka">SzpontRank — codzienna rywalizacja, zero hejtu.</footer>
    </div>
  )
}
