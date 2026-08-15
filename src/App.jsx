import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Landing from './Landing'
import RejestracjaPage from './RejestracjaPage'
import PanelPage from './PanelPage'
import UstawieniaPage from './UstawieniaPage'

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

import { IkonaDom, IkonaUstawienia, IkonaWyjdz, IkonaTelefon } from './Ikony'

function DolnyPasek({ wyloguj }) {
  const location = useLocation()
  const aktywny = (sciezka) => (location.pathname === sciezka ? 'aktywna' : '')

  return (
    <nav className="dolny-pasek">
      <Link to="/panel" className={`dolny-element ${aktywny('/panel')}`}>
        <IkonaDom className="dolny-ikona" />
        <span>Panel</span>
      </Link>
      <Link to="/panel/ustawienia" className={`dolny-element ${aktywny('/panel/ustawienia')}`}>
        <IkonaUstawienia className="dolny-ikona" />
        <span>Ustawienia</span>
      </Link>
      <button className="dolny-element dolny-przycisk" onClick={wyloguj}>
        <IkonaWyjdz className="dolny-ikona" />
        <span>Wyjdź</span>
      </button>
    </nav>
  )
}

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
    if (window.location.hash) {
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

  return (
    <div className="page">
      <nav className="gora">
        <div className="gora-marka">
          <Link to="/">
            <img src="/brand/wordmark.png" alt="SzpontRank" className="gora-logo" />
          </Link>
        </div>
        {!ladowanie && sesja && profil ? (
          <Link to="/panel" className="gora-link">
            Twój panel
          </Link>
        ) : (
          <Link to="/rejestracja" className="gora-link">
            Zaloguj się
          </Link>
        )}
      </nav>

      {((!installed && canInstall) || showIOSHint) && (
        <div className="tresc" style={{ paddingBottom: 0 }}>
          {!installed && canInstall && (
            <button className="install-btn drugorzedny" onClick={promptInstall}>
              Zainstaluj appkę
            </button>
          )}
          {showIOSHint && (
            <div className="ios-hint">
              <IkonaTelefon /> Kliknij <strong>Udostępnij</strong> → <strong>Dodaj do ekranu głównego</strong>, żeby zainstalować SzpontRank.
            </div>
          )}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Landing zalogowany={!!sesja} profilGotowy={!!profil} />} />
        <Route
          path="/rejestracja"
          element={
            <RejestracjaPage
              ladowanie={ladowanie}
              sesja={sesja}
              profil={profil}
              onProfilGotowy={() => wczytajProfil(sesja.user.id)}
            />
          }
        />
        <Route
          path="/panel"
          element={<PanelPage ladowanie={ladowanie} sesja={sesja} profil={profil} wyloguj={wyloguj} />}
        />
        <Route
          path="/panel/ustawienia"
          element={
            <UstawieniaPage
              ladowanie={ladowanie}
              sesja={sesja}
              profil={profil}
              onZaktualizowano={() => wczytajProfil(sesja.user.id)}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="stopka">
        <span>SzpontRank — codzienna rywalizacja, zero hejtu.</span>
        <span>© 2026 Krzykorekk</span>
      </footer>

      {!ladowanie && sesja && profil && <DolnyPasek wyloguj={wyloguj} />}
    </div>
  )
}
