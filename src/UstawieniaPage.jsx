import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { zawieraNiedozwoloneSlowo } from './moderacja'
import Awatar, { AWATARY } from './Awatar'
import { IkonaGlobus } from './Ikony'
import SidebarNav from './SidebarNav'

export const OGOLNA_TOPKA_ID = '00000000-0000-0000-0000-000000000001'

export default function UstawieniaPage({ ladowanie, sesja, profil, wyloguj, onZaktualizowano }) {
  const navigate = useNavigate()

  const [imie, setImie] = useState('')
  const [nick, setNick] = useState('')
  const [avatar, setAvatar] = useState('blyskawica')
  const [ogolnaTopka, setOgolnaTopka] = useState(false)
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

  useEffect(() => {
    if (!ladowanie && (!sesja || !profil)) {
      navigate('/rejestracja', { replace: true })
      return
    }
    if (profil) {
      setImie(profil.imie)
      setNick(profil.nick)
      setAvatar(profil.avatar || 'blyskawica')
      setOgolnaTopka(!!profil.ogolna_topka)
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
        ogolna_topka: ogolnaTopka,
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

    await supabase.rpc('ustaw_ogolna_topke', { wlacz: ogolnaTopka })

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

            <div className="ogolna-topka-baner">
              <div className="ogolna-topka-tekst">
                <h3><IkonaGlobus rozmiar={16} style={{ verticalAlign: '-3px', marginRight: '6px' }} />Ogólna Topka Apki</h3>
                <p>
                  Oprócz Twoich Topek istnieje jeden wspólny ranking obejmujący wszystkich użytkowników
                  SzpontRank. To Twój wybór — włącz albo wyłącz w każdej chwili.
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={ogolnaTopka}
                  onChange={(e) => setOgolnaTopka(e.target.checked)}
                />
                <span className="toggle-suwak" />
              </label>
            </div>

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
            <h2>Zero Hejtu</h2>
            <p className="hint">
              Pytania w Topkach są zawsze systemowe i pozytywne. W Quersach obowiązuje ta sama zasada —
              tylko pozytywne albo neutralne porównania, żadnego rankowania "najgorszy X". Każdy Quers
              można zgłosić, a wulgaryzmy są filtrowane automatycznie. Appka jest dla osób od 13 lat.
            </p>
          </div>

          <button className="install-btn wyloguj" onClick={wyloguj}>
            Wyloguj się
          </button>

          <div className="card" style={{ marginTop: 18, borderColor: '#e8b3a8' }}>
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
