import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Landing from './Landing'
import RejestracjaPage from './RejestracjaPage'
import PanelPage from './PanelPage'
import UstawieniaPage from './UstawieniaPage'
import PolitykaPrywatnosci from './PolitykaPrywatnosci'
import Regulamin from './Regulamin'
import NieZnaleziono from './NieZnaleziono'
import Download from './Download'
import Portfolio from './Portfolio'

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

function jestDesktop() {
  return window.matchMedia('(min-width: 861px)').matches
}

function ModalQR({ onZamknij }) {
  const adres = 'https://szpontrank.eu'
  return (
    <div className="qr-overlay" onClick={onZamknij}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qr-zamknij" onClick={onZamknij} aria-label="Zamknij">✕</button>
        <h2>Zainstaluj na telefonie</h2>
        <p className="hint">
          Instalacja działa na urządzeniu, na którym otwierasz appkę — z komputera nie da się jej
          wysłać na telefon. Zeskanuj kod telefonem, żeby otworzyć SzpontRank i zainstalować stamtąd.
        </p>
        <img
          className="qr-kod"
          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(adres)}`}
          alt="Kod QR do SzpontRank"
          width={220}
          height={220}
        />
        <p className="qr-adres">{adres}</p>
      </div>
    </div>
  )
}

import { IkonaDom, IkonaOsoba, IkonaTelefon, IkonaPobierz, IkonaPomoc, IkonaGrupa } from './Ikony'
import Samouczek, { KLUCZ_SAMOUCZKA } from './Samouczek'
import BramkaMfa from './BramkaMfa'
import TrybKonserwacji from './TrybKonserwacji'
import { ADMIN_ID } from './admin'
import ZnajomiStronaPage from './ZnajomiStronaPage'
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
      <Link to="/panel/znajomi" className={`dolny-element ${aktywny('/panel/znajomi')}`}>
        <IkonaGrupa rozmiar={19} className="dolny-ikona" />
        <span>Znajomi</span>
      </Link>
      <Link to="/panel/ustawienia" className={`dolny-element ${aktywny('/panel/ustawienia')}`}>
        <IkonaOsoba rozmiar={19} className="dolny-ikona" />
        <span>Profil</span>
      </Link>
    </nav>
  )
}

function TloAtmosfera() {
  return (
    <div className="tlo-atmosfera" aria-hidden="true">
      <span className="tlo-plama tlo-plama-1" />
      <span className="tlo-plama tlo-plama-2" />
      <span className="tlo-plama tlo-plama-3" />
    </div>
  )
}

function BanerOffline() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const naOnline = () => setOnline(true)
    const naOffline = () => setOnline(false)
    window.addEventListener('online', naOnline)
    window.addEventListener('offline', naOffline)
    return () => {
      window.removeEventListener('online', naOnline)
      window.removeEventListener('offline', naOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="offline-baner">
      Brak internetu — sprawdź połączenie.
      <button onClick={() => window.location.reload()}>Odśwież</button>
    </div>
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
  const location = useLocation()
  const { canInstall, installed, promptInstall } = useInstallPrompt()
  const showIOSHint = isIOS() && !isStandalone()
  const [pokazQR, setPokazQR] = useState(false)

  const kliknijInstaluj = () => {
    if (jestDesktop()) {
      setPokazQR(true)
    } else {
      promptInstall()
    }
  }

  const [ladowanie, setLadowanie] = useState(true)
  const [sesja, setSesja] = useState(null)
  const [profil, setProfil] = useState(null)
  const [mfaFactorId, setMfaFactorId] = useState(null)
  const [konserwacja, setKonserwacja] = useState(null)

  useEffect(() => {
    supabase
      .from('ustawienia_globalne')
      .select('tryb_konserwacji, wiadomosc_konserwacji, tytul_konserwacji, data_startu, pokazuj_odliczanie, dozwoleni_nicki')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => setKonserwacja(data))
  }, [])

  const sprawdzMfa = async () => {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (data && data.nextLevel === 'aal2' && data.currentLevel !== data.nextLevel) {
      const { data: factory } = await supabase.auth.mfa.listFactors()
      const factor = factory?.totp?.find((f) => f.status === 'verified')
      setMfaFactorId(factor ? factor.id : null)
    } else {
      setMfaFactorId(null)
    }
  }

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
        await sprawdzMfa()
        await wczytajProfil(session.user.id)
        posprzatajAdres()
      }
      setLadowanie(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSesja(session)
      if (session) {
        await sprawdzMfa()
        await wczytajProfil(session.user.id)
        posprzatajAdres()
      } else {
        setProfil(null)
        setMfaFactorId(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const wyloguj = async () => {
    await supabase.auth.signOut()
  }

  const [pokazSamouczek, setPokazSamouczek] = useState(false)

  useEffect(() => {
    if (!ladowanie && sesja && profil) {
      let widziany = false
      try {
        widziany = localStorage.getItem(KLUCZ_SAMOUCZKA) === '1'
      } catch (e) {}
      if (!widziany) setPokazSamouczek(true)
    }
  }, [ladowanie, sesja, profil])

  if (!ladowanie && sesja && mfaFactorId) {
    return (
      <BramkaMfa
        factorId={mfaFactorId}
        onZweryfikowano={() => setMfaFactorId(null)}
        onWyloguj={wyloguj}
      />
    )
  }

  const jestDozwolony =
    sesja?.user?.id === ADMIN_ID ||
    (profil?.nick && konserwacja?.dozwoleni_nicki?.some((n) => n.toLowerCase() === profil.nick.toLowerCase()))

  if (
    konserwacja?.tryb_konserwacji &&
    location.pathname !== '/rejestracja' &&
    !jestDozwolony
  ) {
    return (
      <TrybKonserwacji
        tytul={konserwacja.tytul_konserwacji}
        wiadomosc={konserwacja.wiadomosc_konserwacji}
        dataStartu={konserwacja.data_startu}
        pokazOdliczanie={konserwacja.pokazuj_odliczanie}
      />
    )
  }

  return (
    <div className="page">
      <TloAtmosfera />
      <ScrollDoGory />
      <BanerOffline />
      <nav className="gora">
        <div className="gora-marka">
          <Link to="/">
            <img src="/brand/wordmark-jasny.png" alt="SzpontRank" className="gora-logo gora-logo-jasny" />
            <img src="/brand/wordmark-ciemny.png" alt="SzpontRank" className="gora-logo gora-logo-ciemny" />
          </Link>
        </div>
        <div className="gora-akcje">
          {!ladowanie && sesja && profil && (
            <button
              className="gora-icon-btn"
              onClick={() => setPokazSamouczek(true)}
              aria-label="Jak działa SzpontRank?"
              title="Jak działa SzpontRank?"
            >
              <IkonaPomoc rozmiar={18} />
            </button>
          )}
          {!installed && (canInstall || jestDesktop()) && (
            <button className="gora-icon-btn" onClick={kliknijInstaluj} aria-label="Zainstaluj appkę" title="Zainstaluj appkę">
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
          path="/panel/znajomi"
          element={<ZnajomiStronaPage ladowanie={ladowanie} sesja={sesja} profil={profil} />}
        />
        <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
        <Route path="/regulamin" element={<Regulamin />} />
        <Route path="/download" element={<Download />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="*" element={<NieZnaleziono />} />
      </Routes>

      <footer className="stopka">
        <span>SzpontRank — codzienna rywalizacja, zero hejtu.</span>
        <span className="stopka-linki">
          <Link to="/regulamin">Regulamin</Link>
          <Link to="/polityka-prywatnosci">Polityka Prywatności</Link>
        </span>
        <span>© 2026 Krzykorekk</span>
      </footer>

      {!ladowanie && sesja && profil && location.pathname !== '/portfolio' && <DolnyPasek />}
      {pokazQR && <ModalQR onZamknij={() => setPokazQR(false)} />}
      {pokazSamouczek && <Samouczek onZamknij={() => setPokazSamouczek(false)} />}
    </div>
  )
}
