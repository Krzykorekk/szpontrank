import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Landing from './Landing'
import RejestracjaPage from './RejestracjaPage'
import DomPage from './DomPage'
import TopkiStronaPage from './TopkiStronaPage'
import MisjeStronaPage from './MisjeStronaPage'
import UstawieniaPage from './UstawieniaPage'
import ProfilTozsamosc from './ProfilTozsamosc'
import ProfilWyglad from './ProfilWyglad'
import ProfilBezpieczenstwo from './ProfilBezpieczenstwo'
import ProfilKonto from './ProfilKonto'
import ZglosBlad from './ZglosBlad'
import ProfilStreak from './ProfilStreak'
import PolitykaPrywatnosci from './PolitykaPrywatnosci'
import Regulamin from './Regulamin'
import NieZnaleziono from './NieZnaleziono'
import Download from './Download'
import Portfolio from './Portfolio'
import ReklamaDemo from './ReklamaDemo'
import Reklama from './Reklama'

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

function ModalInstalacja({ onZamknij, onInstaluj }) {
  return (
    <div className="qr-overlay" onClick={onZamknij}>
      <div className="qr-modal instalacja-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qr-zamknij" onClick={onZamknij} aria-label="Zamknij">✕</button>
        <img src="/brand/emblem.png" alt="" className="instalacja-logo" />
        <h2>Zainstaluj SzpontRank</h2>
        <ul className="instalacja-korzysci">
          <li>Ikona na ekranie głównym — jak prawdziwa appka</li>
          <li>Startuje od razu, bez szukania w przeglądarce</li>
          <li>Pełny ekran, bez paska adresu</li>
        </ul>
        <button className="install-btn instalacja-cta" onClick={onInstaluj}>
          Zainstaluj teraz
        </button>
        <button className="instalacja-pozniej" onClick={onZamknij}>Może później</button>
      </div>
    </div>
  )
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

import { IkonaDom, IkonaOsoba, IkonaTelefon, IkonaPobierz, IkonaPomoc, IkonaCzat, IkonaPodium } from './Ikony'
import Samouczek, { KLUCZ_SAMOUCZKA } from './Samouczek'
import { KLUCZ_POWITANIA } from './PowitanieAnimacja'
import BramkaMfa from './BramkaMfa'
import TrybKonserwacji from './TrybKonserwacji'
import { ADMIN_ID } from './admin'
import ZnajomiTylkoApp from './ZnajomiTylkoApp'
import CoinyStronaPage from './CoinyStronaPage'

function DolnyPasek() {
  const location = useLocation()
  const aktywny = (sciezka) =>
    location.pathname === sciezka || (sciezka !== '/panel' && location.pathname.startsWith(sciezka + '/'))
      ? 'aktywna'
      : ''

  return (
    <nav className="dolny-pasek">
      <Link to="/panel" className={`dolny-element ${aktywny('/panel')}`}>
        <IkonaDom rozmiar={19} className="dolny-ikona" />
        <span>Dom</span>
      </Link>
      <Link to="/panel/topki" className={`dolny-element ${aktywny('/panel/topki')}`}>
        <IkonaPodium rozmiar={19} className="dolny-ikona" />
        <span>Rankingi</span>
      </Link>
      <Link to="/panel/znajomi" className={`dolny-element ${aktywny('/panel/znajomi')}`}>
        <IkonaCzat rozmiar={19} className="dolny-ikona" />
        <span>Znajomi</span>
      </Link>
      <Link to="/panel/ustawienia" className={`dolny-element ${aktywny('/panel/ustawienia')}`}>
        <IkonaOsoba rozmiar={19} className="dolny-ikona" />
        <span>Profil</span>
      </Link>
    </nav>
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
  const [pokazInstalacja, setPokazInstalacja] = useState(false)

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      document.documentElement.setAttribute('data-natywna', 'true')
    }

    let uchwytNasluchu = null
    CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('logowanie')) {
        await Browser.close().catch(() => {})
        await supabase.auth.exchangeCodeForSession(url)
      }
    }).then((uchwyt) => {
      uchwytNasluchu = uchwyt
    })

    return () => {
      uchwytNasluchu?.remove()
    }
  }, [])

  const kliknijInstaluj = () => {
    if (jestDesktop()) {
      setPokazQR(true)
    } else {
      setPokazInstalacja(true)
    }
  }

  const potwierdzInstalacje = () => {
    setPokazInstalacja(false)
    promptInstall()
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

  useEffect(() => {
    if (!sesja?.user?.id) return

    const kanal = supabase
      .channel('profil-na-zywo-' + sesja.user.id)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${sesja.user.id}` },
        (payload) => {
          setProfil(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(kanal)
    }
  }, [sesja?.user?.id])

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
      let powitanieWidziane = true
      try {
        widziany = localStorage.getItem(KLUCZ_SAMOUCZKA) === '1'
        powitanieWidziane = localStorage.getItem(KLUCZ_POWITANIA) === '1'
      } catch (e) {}
      if (widziany) return
      if (powitanieWidziane) {
        setPokazSamouczek(true)
      } else {
        // Animacja powitalna zaraz zagra (5.8s) — samouczek czeka, żeby się nie nałożyły
        const timer = setTimeout(() => setPokazSamouczek(true), 6000)
        return () => clearTimeout(timer)
      }
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
      <ScrollDoGory />
      <BanerOffline />
      {location.pathname !== '/xdd' && (
      <nav className="gora">
        <div className="gora-marka">
          <Link to="/">
            <img src="/brand/wordmark-jasny.png" alt="SzpontRank" className="gora-logo gora-logo-jasny" />
            <img src="/brand/wordmark-ciemny.png" alt="SzpontRank" className="gora-logo gora-logo-ciemny" />
          </Link>
        </div>
        <div className="gora-akcje">
          {!ladowanie && sesja && profil && (
            <Link to="/panel/ustawienia" className="gora-icon-btn gora-profil-btn" aria-label="Profil i Ustawienia" title="Profil i Ustawienia">
              <IkonaOsoba rozmiar={18} />
            </Link>
          )}
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
          {ladowanie || !sesja || !profil ? (
            <Link to="/rejestracja" className="gora-link">
              Zaloguj się
            </Link>
          ) : null}
        </div>
      </nav>
      )}

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
          element={<DomPage ladowanie={ladowanie} sesja={sesja} profil={profil} />}
        />
        <Route
          path="/panel/misje"
          element={<MisjeStronaPage ladowanie={ladowanie} sesja={sesja} profil={profil} onZaktualizowano={() => wczytajProfil(sesja.user.id)} />}
        />
        <Route
          path="/panel/topki"
          element={<TopkiStronaPage ladowanie={ladowanie} sesja={sesja} profil={profil} />}
        />
        <Route
          path="/panel/ustawienia"
          element={
            <UstawieniaPage
              ladowanie={ladowanie}
              sesja={sesja}
              profil={profil}
            />
          }
        />
        <Route
          path="/panel/ustawienia/profil"
          element={<ProfilTozsamosc sesja={sesja} profil={profil} onZaktualizowano={() => wczytajProfil(sesja.user.id)} />}
        />
        <Route
          path="/panel/ustawienia/wyglad"
          element={<ProfilWyglad profil={profil} />}
        />
        <Route
          path="/panel/ustawienia/bezpieczenstwo"
          element={<ProfilBezpieczenstwo sesja={sesja} profil={profil} />}
        />
        <Route
          path="/panel/ustawienia/konto"
          element={<ProfilKonto sesja={sesja} profil={profil} wyloguj={wyloguj} />}
        />
        <Route
          path="/panel/ustawienia/zglos-blad"
          element={<ZglosBlad sesja={sesja} profil={profil} />}
        />
        <Route
          path="/panel/ustawienia/streak"
          element={<ProfilStreak profil={profil} />}
        />
        <Route
          path="/panel/znajomi"
          element={<ZnajomiTylkoApp ladowanie={ladowanie} sesja={sesja} profil={profil} />}
        />
        <Route
          path="/panel/coiny"
          element={<CoinyStronaPage sesja={sesja} profil={profil} onZaktualizowano={() => wczytajProfil(sesja.user.id)} />}
        />
        <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
        <Route path="/regulamin" element={<Regulamin />} />
        <Route path="/download" element={<Download />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/xdd" element={<ReklamaDemo />} />
        <Route path="/reklama" element={<Reklama />} />
        <Route path="*" element={<NieZnaleziono />} />
      </Routes>

      {location.pathname !== '/xdd' && (
      <footer className="stopka">
        <span>SzpontRank — codzienna rywalizacja, zero hejtu.</span>
        <span className="stopka-linki">
          <Link to="/regulamin">Regulamin</Link>
          <Link to="/polityka-prywatnosci">Polityka Prywatności</Link>
        </span>
        <span>© 2026 Krzykorekk</span>
      </footer>
      )}

      {!ladowanie && sesja && profil && location.pathname !== '/portfolio' && location.pathname !== '/xdd' && <DolnyPasek />}
      {pokazQR && <ModalQR onZamknij={() => setPokazQR(false)} />}
      {pokazInstalacja && (
        <ModalInstalacja onZamknij={() => setPokazInstalacja(false)} onInstaluj={potwierdzInstalacje} />
      )}
      {pokazSamouczek && <Samouczek onZamknij={() => setPokazSamouczek(false)} />}
    </div>
  )
}
