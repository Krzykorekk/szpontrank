import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { zawieraNiedozwoloneSlowo, AWATARY } from './moderacja'

export default function UstawieniaPage({ ladowanie, sesja, profil, onZaktualizowano }) {
  const navigate = useNavigate()

  const [imie, setImie] = useState('')
  const [nick, setNick] = useState('')
  const [avatar, setAvatar] = useState('👑')
  const [ogolnaTopka, setOgolnaTopka] = useState(false)
  const [youtube, setYoutube] = useState(false)
  const [instagram, setInstagram] = useState(false)
  const [tiktok, setTiktok] = useState(false)

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
      setAvatar(profil.avatar || '👑')
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

    await onZaktualizowano()
    setSukces(true)
  }

  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <aside className="panel-sidebar">
          <div className="avatar-korona">{avatar}</div>
          <h2 className="sidebar-imie">{profil.imie}</h2>
          <p className="sidebar-nick">@{profil.nick}</p>
          <Link to="/panel" className="install-btn drugorzedny sidebar-wyloguj">
            ← Wróć do panelu
          </Link>
        </aside>

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
                  {a}
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
                <h3>🌍 Ogólna Topka Apki</h3>
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
        </main>
      </div>
    </div>
  )
}
