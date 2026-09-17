import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'

function IkonaYoutube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5l6.3 3.5-6.3 3.5Z"/>
    </svg>
  )
}
function IkonaInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5"/>
      <circle cx="12" cy="12" r="4.2"/>
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/>
    </svg>
  )
}
function IkonaTiktok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 3c.5 2.4 2 4 4.4 4.2v3.1c-1.5.1-2.9-.4-4.4-1.3v6.1a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.2a2.7 2.7 0 1 0 1.9 2.6V3h3.1Z"/>
    </svg>
  )
}

const PLATFORMY = [
  { klucz: 'youtube', Ikona: IkonaYoutube, url: (h) => `https://youtube.com/@${h.replace(/^@/, '')}`, kolor: '#ff0000' },
  { klucz: 'instagram', Ikona: IkonaInstagram, url: (h) => `https://instagram.com/${h.replace(/^@/, '')}`, kolor: '#c2185b' },
  { klucz: 'tiktok', Ikona: IkonaTiktok, url: (h) => `https://tiktok.com/@${h.replace(/^@/, '')}`, kolor: '#000000' },
]

export default function ProfilUzytkownika({ sesja }) {
  const { nick } = useParams()
  const navigate = useNavigate()
  const [profil, setProfil] = useState(null)
  const [ladowanie, setLadowanie] = useState(true)
  const [nieZnaleziono, setNieZnaleziono] = useState(false)
  const [statusZnajomosci, setStatusZnajomosci] = useState(null)
  const [wysylanie, setWysylanie] = useState(false)
  const [komunikat, setKomunikat] = useState(null)

  useEffect(() => {
    wczytaj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nick])

  async function wczytaj() {
    setLadowanie(true)
    setNieZnaleziono(false)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, imie, nick, avatar, opis, polaczone_konta, coiny_lacznie, streak_dni')
      .eq('nick', nick)
      .maybeSingle()

    if (error || !data) {
      setNieZnaleziono(true)
      setLadowanie(false)
      return
    }
    setProfil(data)

    if (sesja && data.id !== sesja.user.id) {
      const { data: relacja } = await supabase
        .from('znajomi')
        .select('status')
        .or(
          `and(uzytkownik_a_id.eq.${sesja.user.id},uzytkownik_b_id.eq.${data.id}),and(uzytkownik_a_id.eq.${data.id},uzytkownik_b_id.eq.${sesja.user.id})`
        )
        .maybeSingle()
      setStatusZnajomosci(relacja?.status || null)
    }
    setLadowanie(false)
  }

  async function dodajDoZnajomych() {
    setWysylanie(true)
    setKomunikat(null)
    const { data, error } = await supabase.rpc('wyslij_zaproszenie', { docelowy_nick: profil.nick })
    setWysylanie(false)
    if (error || data?.blad) {
      setKomunikat('Coś poszło nie tak — spróbuj ponownie.')
      return
    }
    setStatusZnajomosci('oczekujace')
    setKomunikat('Zaproszenie wysłane ✓')
  }

  if (ladowanie) {
    return (
      <div className="tresc">
        <p className="hint">Ładowanie...</p>
      </div>
    )
  }

  if (nieZnaleziono) {
    return (
      <div className="tresc">
        <button className="btn-wstecz-profil" onClick={() => navigate(-1)}>‹ Wstecz</button>
        <p className="hint" style={{ marginTop: 16 }}>Nie ma użytkownika o nicku @{nick}.</p>
      </div>
    )
  }

  const toJa = sesja && profil.id === sesja.user.id
  const aktywnePlatformy = PLATFORMY.filter((p) => profil.polaczone_konta?.[p.klucz] && profil.polaczone_konta?.[`${p.klucz}_handle`])

  return (
    <div className="tresc">
      <button className="btn-wstecz-profil" onClick={() => navigate(-1)}>‹ Wstecz</button>

      <div className="card card-wyroznik" style={{ marginTop: 16, textAlign: 'center' }}>
        <Awatar id={profil.avatar || 'blyskawica'} rozmiar={72} />
        <h2 style={{ marginTop: 12, marginBottom: 2 }}>{profil.imie}</h2>
        <p className="hint" style={{ marginTop: 0 }}>@{profil.nick}</p>

        {profil.opis && <p style={{ margin: '14px 0' }}>{profil.opis}</p>}

        {aktywnePlatformy.length > 0 && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
            {aktywnePlatformy.map((p) => (
              <a
                key={p.klucz}
                href={p.url(profil.polaczone_konta[`${p.klucz}_handle`])}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: p.kolor,
                  color: '#fff',
                }}
                aria-label={p.klucz}
              >
                <p.Ikona />
              </a>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{profil.coiny_lacznie ?? 0}</div>
            <div className="hint">Coinów</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{profil.streak_dni ?? 0}</div>
            <div className="hint">Dni streaka</div>
          </div>
        </div>

        {!toJa && (
          <div style={{ marginTop: 20 }}>
            {statusZnajomosci === 'zaakceptowane' && <span className="status-pill">Znajomi ✓</span>}
            {statusZnajomosci === 'oczekujace' && <span className="hint">Zaproszenie oczekuje</span>}
            {!statusZnajomosci && (
              <button className="install-btn" onClick={dodajDoZnajomych} disabled={wysylanie}>
                {wysylanie ? 'Wysyłanie...' : 'Dodaj do znajomych'}
              </button>
            )}
            {komunikat && <p className="hint" style={{ marginTop: 8 }}>{komunikat}</p>}
          </div>
        )}

        {toJa && (
          <Link to="/panel/ustawienia/profil" className="install-btn drugorzedny" style={{ marginTop: 20, display: 'inline-block' }}>
            Edytuj swój profil
          </Link>
        )}
      </div>
    </div>
  )
}
