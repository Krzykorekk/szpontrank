import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Landing from './Landing'
import RejestracjaPage from './RejestracjaPage'
import PanelPage from './PanelPage'
import UstawieniaPage from './UstawieniaPage'
import QuersyPage from './QuersyPage'
import PolitykaPrywatnosci from './PolitykaPrywatnosci'
import Regulamin from './Regulamin'

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

import { IkonaDom, IkonaUstawienia, IkonaTelefon, IkonaPobierz, IkonaQuersy } from './Ikony'
import Awatar from './Awatar'

function DolnyPasek() {
  const location = useLocation()
  const aktywny = (sciezka) => (location.pathname === sciezka ? 'aktywna' : '')

  return (
    <nav className="dolny-pasek">
      <Link to="/panel" className={`dolny-element ${aktywny('/panel')}`}>
        <IkonaDom rozmiar={19} className="dolny-ikona" />
        <span>Dom</span>
      </Link>
      <Link to="/panel/quersy" className={`dolny-element ${aktywny('/panel/quersy')}`}>
        <IkonaQuersy rozmiar={19} className="dolny-ikona" />
        <span>Quersy</span>
      </Link>
      <Link to="/panel/ustawienia" className={`dolny-element ${aktywny('/panel/ustawienia')}`}>
        <IkonaUstawienia rozmiar={19} className="dolny-ikona" />
        <span>Profil</span>
      </Link>
    </nav>
  )
}

function ScrollDoGory() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return null
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
      <ScrollDoGory />
      <nav className="gora">
        <div className="gora-marka">
          <Link to="/">
            <img src="/brand/wordmark.png" alt="SzpontRank" className="gora-logo" />
          </Link>
        </div>
        <div className="gora-akcje">
          {!installed && canInstall && (
            <button className="gora-icon-btn" onClick={promptInstall} aria-label="Zainstaluj appkę" title="Zainstaluj appkę">
              <IkonaPobierz rozmiar={19} />
            </button>
          )}
          {!ladowanie && sesja && profil ? (
            <Link to="/panel" className="gora-avatar-btn" aria-label="Twój panel">
              <Awatar id={profil.avatar || 'blyskawica'} rozmiar={30} />
            </Link>
          ) : (
            <Link to="/rejestracja" className="gora-link">
              Zaloguj się
            </Link>
          )}
        </div>
      </nav>

      {showIOSHint && (
        <div className="tresc" style={{ paddingBottom: 0 }}>
          <div className="ios-hint">
            <IkonaTelefon /> Kliknij <strong>Udostępnij</strong> → <strong>Dodaj do ekranu głównego</strong>, żeby zainstalować SzpontRank.
          </div>
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
              wyloguj={wyloguj}
              onZaktualizowano={() => wczytajProfil(sesja.user.id)}
            />
          }
        />
        <Route
          path="/panel/quersy"
          element={<QuersyPage ladowanie={ladowanie} sesja={sesja} profil={profil} />}
        />
        <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
        <Route path="/regulamin" element={<Regulamin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="stopka">
        <span>SzpontRank — codzienna rywalizacja, zero hejtu.</span>
        <span className="stopka-linki">
          <Link to="/regulamin">Regulamin</Link>
          <Link to="/polityka-prywatnosci">Polityka Prywatności</Link>
        </span>
        <span>© 2026 Krzykorekk</span>
      </footer>

      {!ladowanie && sesja && profil && <DolnyPasek />}
    </div>
  )
}
