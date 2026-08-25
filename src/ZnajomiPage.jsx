import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { IkonaOgien } from './Ikony'
import Czat from './Czat'
import OdznakaWlasciciela from './OdznakaWlasciciela'

function KartaZnajomego({ inny, children }) {
  return (
    <div className="znajomy-karta">
      <Awatar id={inny?.avatar || 'blyskawica'} rozmiar={40} />
      <div className="znajomy-info">
        <span className="znajomy-nick">
          @{inny?.nick} <OdznakaWlasciciela userId={inny?.id} />
        </span>
        {typeof inny?.streak_dni === 'number' && (
          <span className="znajomy-streak">
            <IkonaOgien rozmiar={13} /> {inny.streak_dni} {inny.streak_dni === 1 ? 'dzień' : 'dni'}
          </span>
        )}
      </div>
      <div className="znajomy-akcje">{children}</div>
    </div>
  )
}

export default function ZnajomiPage({ userId }) {
  const [wiersze, setWiersze] = useState([])
  const [profileInne, setProfileInne] = useState({})
  const [ladowanie, setLadowanie] = useState(true)
  const [otwartyCzat, setOtwartyCzat] = useState(null)

  const [nick, setNick] = useState('')
  const [wysylanie, setWysylanie] = useState(false)
  const [komunikat, setKomunikat] = useState(null)

  async function wczytaj() {
    setLadowanie(true)
    const { data } = await supabase
      .from('znajomi')
      .select('*')
      .or(`uzytkownik_a_id.eq.${userId},uzytkownik_b_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    const lista = data || []
    setWiersze(lista)

    const inniIds = lista.map((w) => (w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id))
    if (inniIds.length > 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nick, avatar, streak_dni')
        .in('id', inniIds)
      setProfileInne(Object.fromEntries((profile || []).map((p) => [p.id, p])))
    }
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  async function wyslij(e) {
    e.preventDefault()
    if (!nick.trim()) return
    setWysylanie(true)
    setKomunikat(null)
    const { data, error } = await supabase.rpc('wyslij_zaproszenie', { docelowy_nick: nick.trim() })
    setWysylanie(false)

    if (error) {
      setKomunikat({ typ: 'blad', tekst: 'Coś poszło nie tak — spróbuj ponownie.' })
      return
    }
    if (data?.blad === 'nie_znaleziono') setKomunikat({ typ: 'blad', tekst: `Nie ma nikogo o nicku @${nick.trim()}.` })
    else if (data?.blad === 'to_ty') setKomunikat({ typ: 'blad', tekst: 'To Twój własny nick.' })
    else if (data?.blad === 'juz_istnieje') setKomunikat({ typ: 'blad', tekst: 'Już jesteście znajomymi albo zaproszenie już czeka.' })
    else {
      setKomunikat({ typ: 'ok', tekst: 'Zaproszenie wysłane ✓' })
      setNick('')
      wczytaj()
    }
  }

  async function akceptuj(id) {
    await supabase.from('znajomi').update({ status: 'zaakceptowane' }).eq('id', id)
    wczytaj()
  }

  async function usun(id) {
    await supabase.from('znajomi').delete().eq('id', id)
    wczytaj()
  }

  const zaakceptowani = wiersze.filter((w) => w.status === 'zaakceptowane')
  const przychodzace = wiersze.filter((w) => w.status === 'oczekujace' && w.zaproszil_id !== userId)
  const wyslane = wiersze.filter((w) => w.status === 'oczekujace' && w.zaproszil_id === userId)
  const pusto = zaakceptowani.length === 0 && wyslane.length === 0 && przychodzace.length === 0

  if (otwartyCzat) {
    return (
      <Czat
        znajomoscId={otwartyCzat.id}
        userId={userId}
        inny={profileInne[otwartyCzat.uzytkownik_a_id === userId ? otwartyCzat.uzytkownik_b_id : otwartyCzat.uzytkownik_a_id]}
        onWstecz={() => setOtwartyCzat(null)}
      />
    )
  }

  return (
    <div>
      <div className="znajomi-wyjasnienie">
        <p>
          Dodajesz kogoś po nicku → on musi to zaakceptować u siebie → wtedy widzicie się nawzajem
          na liście i możecie do siebie pisać (tylko emotki i gotowe zwroty — bez wolnego tekstu,
          celowo, dla bezpieczeństwa).
        </p>
      </div>

      <form className="card" onSubmit={wyslij}>
        <h2>Dodaj znajomego</h2>
        <div className="znajomi-formularz">
          <input
            className="input"
            placeholder="nick znajomego"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />
          <button className="install-btn" type="submit" disabled={wysylanie}>
            {wysylanie ? '...' : 'Dodaj'}
          </button>
        </div>
        {komunikat && <p className={komunikat.typ === 'blad' ? 'blad' : 'status-pill'}>{komunikat.tekst}</p>}
      </form>

      {ladowanie && <p className="debug-status" style={{ marginTop: 20 }}>Ładowanie...</p>}

      {!ladowanie && przychodzace.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className="znajomi-podtytul">Zaproszenia do Ciebie</h3>
          <div className="znajomi-lista">
            {przychodzace.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <KartaZnajomego key={w.id} inny={inny}>
                  <button className="install-btn" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={() => akceptuj(w.id)}>
                    Akceptuj
                  </button>
                  <button className="install-btn drugorzedny" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={() => usun(w.id)}>
                    Odrzuć
                  </button>
                </KartaZnajomego>
              )
            })}
          </div>
        </div>
      )}

      {!ladowanie && (
        <div style={{ marginTop: 24 }}>
          <h3 className="znajomi-podtytul">Twoi znajomi ({zaakceptowani.length})</h3>
          {pusto && <p className="hint">Jeszcze nikogo tu nie ma — dodaj pierwszego znajomego powyżej.</p>}
          <div className="znajomi-lista">
            {zaakceptowani.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <KartaZnajomego key={w.id} inny={inny}>
                  <button
                    className="install-btn"
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    onClick={() => setOtwartyCzat(w)}
                  >
                    Napisz
                  </button>
                  <button className="install-btn drugorzedny" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => usun(w.id)}>
                    Usuń
                  </button>
                </KartaZnajomego>
              )
            })}
          </div>
        </div>
      )}

      {!ladowanie && wyslane.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className="znajomi-podtytul">Wysłane zaproszenia — czekają na odpowiedź</h3>
          <div className="znajomi-lista">
            {wyslane.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <KartaZnajomego key={w.id} inny={inny}>
                  <span className="hint znajomy-oczekuje">Wysłano — jeszcze nie zaakceptował/a</span>
                </KartaZnajomego>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
