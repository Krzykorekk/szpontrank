import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

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

export default function App() {
  const { canInstall, installed, promptInstall } = useInstallPrompt()
  const [status, setStatus] = useState('sprawdzam...')
  const showIOSHint = isIOS() && !isStandalone()

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(() => setStatus('połączono'))
      .catch(() => setStatus('błąd połączenia'))
  }, [])

  return (
    <div className="page">
      <div className="glow" />

      <header className="hero">
        <img src="/icons/icon-512.png" alt="SzponTRANK" className="logo" />
        <h1>SzponTRANK</h1>
        <p className="tagline">Codzienne pytania. Twoja klasa. Twoja ekipa. Twoja korona.</p>

        {!installed && canInstall && (
          <button className="install-btn" onClick={promptInstall}>
            Zainstaluj appkę
          </button>
        )}

        {showIOSHint && (
          <div className="ios-hint">
            📲 Kliknij <strong>Udostępnij</strong> → <strong>Dodaj do ekranu głównego</strong>, żeby zainstalować SzponTRANK.
          </div>
        )}

        {installed && <div className="status-pill">Appka zainstalowana ✓</div>}
      </header>

      <main className="content">
        <div className="card">
          <h2>Już wkrótce</h2>
          <p>Rejestracja, Topki klasowe i grupowe oraz codzienne pytania pojawią się tutaj lada dzień.</p>
        </div>
        <p className="debug-status">Status Supabase: {status}</p>
      </main>
    </div>
  )
}
