import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { IkonaOgien } from './Ikony'

export default function ZnajomiPage({ userId }) {
  const [wiersze, setWiersze] = useState([])
  const [profileInne, setProfileInne] = useState({})
  const [ladowanie, setLadowanie] = useState(true)

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

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h2>Znajomi</h2>
      <p className="hint">Dodaj kogoś po nicku — po akceptacji zobaczycie się nawzajem na liście.</p>

      <form onSubmit={wyslij} style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="nick znajomego"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
        <button className="install-btn" type="submit" disabled={wysylanie}>
          {wysylanie ? '...' : 'Dodaj'}
        </button>
      </form>

      {komunikat && <p className={komunikat.typ === 'blad' ? 'blad' : 'status-pill'}>{komunikat.tekst}</p>}

      {ladowanie && <p className="debug-status">Ładowanie...</p>}

      {!ladowanie && przychodzace.length > 0 && (
        <>
          <h3 className="znajomi-podtytul">Zaproszenia do Ciebie</h3>
          <ul className="ranking-lista">
            {przychodzace.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <li className="ranking-wiersz" key={w.id}>
                  <Awatar id={inny?.avatar || 'blyskawica'} rozmiar={28} />
                  <span className="ranking-nazwa">@{inny?.nick}</span>
                  <button className="install-btn" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => akceptuj(w.id)}>
                    Akceptuj
                  </button>
                  <button className="install-btn drugorzedny" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => usun(w.id)}>
                    Odrzuć
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {!ladowanie && (
        <>
          <h3 className="znajomi-podtytul">Twoi znajomi ({zaakceptowani.length})</h3>
          {zaakceptowani.length === 0 && wyslane.length === 0 && przychodzace.length === 0 && (
            <p className="hint">Jeszcze nikogo tu nie ma — dodaj pierwszego znajomego powyżej.</p>
          )}
          <ul className="ranking-lista">
            {zaakceptowani.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <li className="ranking-wiersz" key={w.id}>
                  <Awatar id={inny?.avatar || 'blyskawica'} rozmiar={28} />
                  <span className="ranking-nazwa">@{inny?.nick}</span>
                  <span className="ranking-glosy" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IkonaOgien rozmiar={14} />{inny?.streak_dni || 0}
                  </span>
                  <button className="install-btn drugorzedny" style={{ padding: '6px 14px', fontSize: '0.78rem' }} onClick={() => usun(w.id)}>
                    Usuń
                  </button>
                </li>
              )
            })}
            {wyslane.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <li className="ranking-wiersz" key={w.id} style={{ opacity: 0.6 }}>
                  <Awatar id={inny?.avatar || 'blyskawica'} rozmiar={28} />
                  <span className="ranking-nazwa">@{inny?.nick}</span>
                  <span className="hint" style={{ margin: 0 }}>oczekuje...</span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
