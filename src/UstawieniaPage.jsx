import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { zawieraNiedozwoloneSlowo } from './moderacja'
import Awatar, { AWATARY } from './Awatar'
import SidebarNav from './SidebarNav'
import Sekcja2FA from './Sekcja2FA'
import PanelAdmina from './PanelAdmina'
import { ADMIN_ID } from './admin'

export const OGOLNA_TOPKA_ID = '00000000-0000-0000-0000-000000000001'

export default function UstawieniaPage({ ladowanie, sesja, profil, wyloguj, onZaktualizowano }) {
  const navigate = useNavigate()

  const [imie, setImie] = useState('')
  const [nick, setNick] = useState('')
  const [avatar, setAvatar] = useState('blyskawica')
  const [youtube, setYoutube] = useState(false)
  const [instagram, setInstagram] = useState(false)
  const [tiktok, setTiktok] = useState(false)
  const [usuwanieKonta, setUsuwanieKonta] = useState(false)

  async function usunKonto() {
    if (
      !window.confirm(
        'Na pewno chcesz usunąć konto na stałe? Ta operacja jest nieodwracalna i usunie wszystkie Twoje dane.'
      )
    ) {
      return
    }
    setUsuwanieKonta(true)
    const { error } = await supabase.rpc('usun_moje_konto')
    if (error) {
      setUsuwanieKonta(false)
      window.alert('Nie udało się usunąć konta. Spróbuj ponownie albo napisz do nas.')
      return
    }
    await wyloguj()
  }

  const [blad, setBlad] = useState(null)
  const [sukces, setSukces] = useState(false)
  const [zapisywanie, setZapisywanie] = useState(false)

  const [noweHaslo, setNoweHaslo] = useState('')
  const [powtorzHaslo, setPowtorzHaslo] = useState('')
  const [bladHasla, setBladHasla] = useState(null)
  const [sukcesHasla, setSukcesHasla] = useState(false)
  const [zmienianieHasla, setZmienianieHasla] = useState(false)
  const maJuzHaslo = sesja?.user?.app_metadata?.provider === 'email'

  const [motywCiemny, setMotywCiemny] = useState(
    () => localStorage.getItem('szpontrank-motyw') === 'ciemny'
  )

  function przelaczMotyw(wlaczCiemny) {
    setMotywCiemny(wlaczCiemny)
    document.documentElement.setAttribute('data-motyw', wlaczCiemny ? 'ciemny' : 'jasny')
    localStorage.setItem('szpontrank-motyw', wlaczCiemny ? 'ciemny' : 'jasny')
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) metaTheme.setAttribute('content', wlaczCiemny ? '#17140f' : '#e8492e')
  }

  async function zmienHaslo(e) {
    e.preventDefault()
    setBladHasla(null)
    setSukcesHasla(false)

    if (noweHaslo.length < 6) {
      setBladHasla('Hasło musi mieć co najmniej 6 znaków.')
      return
    }
    if (noweHaslo !== powtorzHaslo) {
      setBladHasla('Hasła nie są takie same.')
      return
    }

    setZmienianieHasla(true)
    const { error } = await supabase.auth.updateUser({ password: noweHaslo })
    setZmienianieHasla(false)

    if (error) {
      setBladHasla(`Nie udało się zmienić hasła (${error.message})`)
      return
    }
    setNoweHaslo('')
    setPowtorzHaslo('')
    setSukcesHasla(true)
  }

  useEffect(() => {
    if (!ladowanie && (!sesja || !profil)) {
      navigate('/rejestracja', { replace: true })
      return
    }
    if (profil) {
      setImie(profil.imie)
      setNick(profil.nick)
      setAvatar(profil.avatar || 'blyskawica')
      setYoutube(!!profil.polaczone_konta?.youtube)
      setInstagram(!!profil.polaczone_konta?.instagram)
      setTiktok(!!profil.polaczone_konta?.tiktok)
    }
  }, [ladowanie, sesja, profil, navigate])

  if (ladowanie || !sesja || !profil) {
    return (
      <div className="tresc">
        <p className="debug-status">Ładowanie...</p>
      </div>
    )
  }

  const zapisz = async (e) => {
    e.preventDefault()
    setBlad(null)
    setSukces(false)

    if (zawieraNiedozwoloneSlowo(imie) || zawieraNiedozwoloneSlowo(nick)) {
      setBlad('Imię lub pseudonim zawiera niedozwolone słowo — wybierz inne.')
      return
    }

    setZapisywanie(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        imie: imie.trim(),
        nick: nick.trim(),
        avatar,
        polaczone_konta: { youtube, instagram, tiktok },
      })
      .eq('id', sesja.user.id)

    setZapisywanie(false)

    if (error) {
      setBlad(
        error.code === '23505'
          ? 'Ten pseudonim jest już zajęty — wybierz inny.'
          : `Nie udało się zapisać (${error.message})`
      )
      return
    }

    await onZaktualizowano()
    setSukces(true)
  }

  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />

        <main className="panel-main">
          <div className="panel-naglowek">
            <h1>Ustawienia konta</h1>
          </div>

          <form className="card card-wyroznik" onSubmit={zapisz}>
            <h2>Profil</h2>
            <p className="hint">To, co widzą inni w Twoich Topkach: imię, pseudonim i awatar.</p>

            <label className="pole">Awatar</label>
            <div className="awatar-siatka">
              {AWATARY.map((a) => (
                <button
                  type="button"
                  key={a}
                  className={`awatar-opcja ${avatar === a ? 'aktywna' : ''}`}
                  onClick={() => setAvatar(a)}
                >
                  <Awatar id={a} rozmiar={34} />
                </button>
              ))}
            </div>

            <label className="pole">
              Imię
              <input
                className="input"
                required
                minLength={1}
                maxLength={30}
                value={imie}
                onChange={(e) => setImie(e.target.value)}
              />
            </label>

            <label className="pole">
              Pseudonim
              <input
                className="input"
                required
                minLength={3}
                maxLength={20}
                value={nick}
                onChange={(e) => setNick(e.target.value.replace(/\s/g, ''))}
              />
            </label>

            <fieldset className="checkboxy">
              <legend>Masz już własny kanał/konto twórcy?</legend>
              <label>
                <input type="checkbox" checked={youtube} onChange={(e) => setYoutube(e.target.checked)} />
                YouTube
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={instagram}
                  onChange={(e) => setInstagram(e.target.checked)}
                />
                Instagram
              </label>
              <label>
                <input type="checkbox" checked={tiktok} onChange={(e) => setTiktok(e.target.checked)} />
                TikTok
              </label>
            </fieldset>

            {blad && <p className="blad">{blad}</p>}
            {sukces && <p className="status-pill">Zapisano ✓</p>}

            <button className="install-btn" type="submit" disabled={zapisywanie}>
              {zapisywanie ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </form>

          <div className="card" style={{ marginTop: 18 }}>
            <h2>Wygląd</h2>
            <div className="ogolna-topka-baner" style={{ margin: 0 }}>
              <div className="ogolna-topka-tekst">
                <h3>Tryb ciemny</h3>
                <p>Ciemne tło zamiast jasnego — łatwiejsze dla oczu wieczorem.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={motywCiemny}
                  onChange={(e) => przelaczMotyw(e.target.checked)}
                />
                <span className="toggle-suwak" />
              </label>
            </div>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <h2>Konto</h2>
            <p className="hint">Zalogowano jako <strong>{sesja.user.email}</strong></p>
            <button className="install-btn wyloguj" onClick={wyloguj}>
              Wyloguj się
            </button>
          </div>

          <form className="card" style={{ marginTop: 18 }} onSubmit={zmienHaslo}>
            <h2>{maJuzHaslo ? 'Zmień hasło' : 'Ustaw hasło'}</h2>
            {!maJuzHaslo && (
              <p className="hint">
                Logujesz się przez Google — możesz dodatkowo ustawić hasło, żeby móc się zalogować
                też e-mailem i hasłem.
              </p>
            )}
            <label className="pole">
              {maJuzHaslo ? 'Nowe hasło' : 'Hasło'}
              <input
                className="input"
                type="password"
                minLength={6}
                required
                value={noweHaslo}
                onChange={(e) => setNoweHaslo(e.target.value)}
              />
            </label>
            <label className="pole">
              Powtórz hasło
              <input
                className="input"
                type="password"
                minLength={6}
                required
                value={powtorzHaslo}
                onChange={(e) => setPowtorzHaslo(e.target.value)}
              />
            </label>
            {bladHasla && <p className="blad">{bladHasla}</p>}
            {sukcesHasla && <p className="status-pill">Hasło zapisane ✓</p>}
            <button className="install-btn" type="submit" disabled={zmienianieHasla}>
              {zmienianieHasla ? 'Zapisywanie...' : maJuzHaslo ? 'Zmień hasło' : 'Ustaw hasło'}
            </button>
          </form>

          <Sekcja2FA />

          {sesja.user.id === ADMIN_ID && <PanelAdmina />}

          <div className="card karta-niebezpieczna" style={{ marginTop: 18 }}>
            <h2>Strefa niebezpieczna</h2>
            <p className="hint">
              Usunięcie konta jest trwałe — znika Twój profil, głosy i Topki, które założyłeś/aś (razem
              z Topką znikają też inni jej członkowie). Tego nie da się cofnąć.
            </p>
            <button className="install-btn drugorzedny" onClick={usunKonto} disabled={usuwanieKonta}>
              {usuwanieKonta ? 'Usuwanie...' : 'Usuń moje konto na stałe'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
