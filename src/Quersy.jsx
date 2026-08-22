import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { zawieraNiedozwoloneSlowo, zawieraObcyJezyk } from './moderacja'
import { IkonaQuersy, IkonaFlaga, IkonaSerce } from './Ikony'
import ModeracjaQuersy, { ADMIN_ID } from './ModeracjaQuersy'

function czasDoWygasniecia(wygasa) {
  const ms = new Date(wygasa).getTime() - Date.now()
  if (ms <= 0) return 'wygasa za chwilę'
  const godziny = Math.floor(ms / 3_600_000)
  if (godziny >= 1) return `wygasa za ${godziny}h`
  const minuty = Math.max(1, Math.floor(ms / 60_000))
  return `wygasa za ${minuty} min`
}

function losuj(tablica) {
  return tablica[Math.floor(Math.random() * tablica.length)]
}

function wylosujSzybki(tematy, szablony) {
  if (tematy.length < 2 || szablony.length === 0) return null
  const a = losuj(tematy)
  let b = losuj(tematy)
  while (b.id === a.id) b = losuj(tematy)
  const szablon = losuj(szablony)
  return {
    tematA: a.nazwa,
    tematB: b.nazwa,
    pytanie: szablon.tresc.replace('{A}', a.nazwa).replace('{B}', b.nazwa),
  }
}

export default function Quersy({ userId }) {
  const [widok, setWidok] = useState('odkrywaj')
  const [quersy, setQuersy] = useState([])
  const [glosyUzytkownika, setGlosyUzytkownika] = useState({})
  const [liczbaGlosow, setLiczbaGlosow] = useState({})
  const [zgloszone, setZgloszone] = useState({})
  const [polubienia, setPolubienia] = useState({})
  const [liczbaPolubien, setLiczbaPolubien] = useState({})
  const [ladowanie, setLadowanie] = useState(true)

  const [tematy, setTematy] = useState([])
  const [szablony, setSzablony] = useState([])
  const [propozycja, setPropozycja] = useState(null)
  const [tryb, setTryb] = useState('szybki')
  const [wlasnePytanie, setWlasnePytanie] = useState('')
  const [wlasnyTematA, setWlasnyTematA] = useState('')
  const [wlasnyTematB, setWlasnyTematB] = useState('')
  const [blad, setBlad] = useState('')
  const [publikowanie, setPublikowanie] = useState(false)

  async function wczytaj() {
    setLadowanie(true)
    const { data: aktywne } = await supabase
      .from('quersy')
      .select('*')
      .order('utworzono', { ascending: false })
      .limit(50)

    const lista = aktywne || []
    setQuersy(lista)

    if (lista.length > 0) {
      const idki = lista.map((q) => q.id)
      const autorzy = [...new Set(lista.map((q) => q.autor_id))]

      const [{ data: profile }, { data: mojeGlosy }, { data: wszystkieGlosy }, { data: mojePolubienia }, { data: wszystkiePolubienia }] = await Promise.all([
        supabase.from('profiles').select('id, nick, avatar').in('id', autorzy),
        userId
          ? supabase.from('quersy_glosy').select('quers_id, wybor').eq('uzytkownik_id', userId).in('quers_id', idki)
          : Promise.resolve({ data: [] }),
        supabase.from('quersy_glosy').select('quers_id, wybor').in('quers_id', idki),
        userId
          ? supabase.from('quersy_polubienia').select('quers_id').eq('uzytkownik_id', userId).in('quers_id', idki)
          : Promise.resolve({ data: [] }),
        supabase.from('quersy_polubienia').select('quers_id').in('quers_id', idki),
      ])

      const profileMapa = Object.fromEntries((profile || []).map((p) => [p.id, p]))
      setQuersy(lista.map((q) => ({ ...q, autor: profileMapa[q.autor_id] })))

      setGlosyUzytkownika(Object.fromEntries((mojeGlosy || []).map((g) => [g.quers_id, g.wybor])))
      setPolubienia(Object.fromEntries((mojePolubienia || []).map((p) => [p.quers_id, true])))

      const licznikPolubien = {}
      for (const p of wszystkiePolubienia || []) {
        licznikPolubien[p.quers_id] = (licznikPolubien[p.quers_id] || 0) + 1
      }
      setLiczbaPolubien(licznikPolubien)

      const licznik = {}
      for (const g of wszystkieGlosy || []) {
        licznik[g.quers_id] ||= { a: 0, b: 0 }
        licznik[g.quers_id][g.wybor]++
      }
      setLiczbaGlosow(licznik)
    }
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
    supabase.from('quersy_tematy').select('*').then(({ data }) => setTematy(data || []))
    supabase.from('quersy_szablony').select('*').then(({ data }) => setSzablony(data || []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tematy.length && szablony.length && tryb === 'szybki' && !propozycja) {
      setPropozycja(wylosujSzybki(tematy, szablony))
    }
  }, [tematy, szablony, tryb, propozycja])

  async function zaglosuj(quersId, wybor) {
    if (!userId || glosyUzytkownika[quersId]) return
    setGlosyUzytkownika((s) => ({ ...s, [quersId]: wybor }))
    setLiczbaGlosow((s) => ({
      ...s,
      [quersId]: { a: (s[quersId]?.a || 0) + (wybor === 'a' ? 1 : 0), b: (s[quersId]?.b || 0) + (wybor === 'b' ? 1 : 0) },
    }))
    await supabase.from('quersy_glosy').insert({ quers_id: quersId, uzytkownik_id: userId, wybor })
  }

  async function zglos(quersId) {
    if (!userId || zgloszone[quersId]) return
    setZgloszone((s) => ({ ...s, [quersId]: true }))
    await supabase.from('quersy_zgloszenia').insert({ quers_id: quersId, uzytkownik_id: userId })
  }

  async function przelaczPolubienie(quersId) {
    if (!userId) return
    const jużPolubione = polubienia[quersId]
    setPolubienia((s) => ({ ...s, [quersId]: !jużPolubione }))
    setLiczbaPolubien((s) => ({ ...s, [quersId]: (s[quersId] || 0) + (jużPolubione ? -1 : 1) }))
    if (jużPolubione) {
      await supabase.from('quersy_polubienia').delete().eq('quers_id', quersId).eq('uzytkownik_id', userId)
    } else {
      await supabase.from('quersy_polubienia').insert({ quers_id: quersId, uzytkownik_id: userId })
    }
  }

  async function opublikuj() {
    setBlad('')
    let pytanie, tematA, tematB

    if (tryb === 'szybki') {
      if (!propozycja) return
      ;({ pytanie, tematA, tematB } = { pytanie: propozycja.pytanie, tematA: propozycja.tematA, tematB: propozycja.tematB })
    } else {
      pytanie = wlasnePytanie.trim()
      tematA = wlasnyTematA.trim()
      tematB = wlasnyTematB.trim()
      if (!pytanie || !tematA || !tematB) {
        setBlad('Uzupełnij pytanie i obie postacie.')
        return
      }
      if (pytanie.length > 140 || tematA.length > 40 || tematB.length > 40) {
        setBlad('Za długi tekst — skróć pytanie lub nazwy.')
        return
      }
      const calosc = `${pytanie} ${tematA} ${tematB}`
      if (zawieraNiedozwoloneSlowo(calosc)) {
        setBlad('Ten tekst zawiera niedozwolone słowo.')
        return
      }
      if (zawieraObcyJezyk(calosc)) {
        setBlad('Pisz po polsku, proszę.')
        return
      }
    }

    setPublikowanie(true)
    const { error } = await supabase.from('quersy').insert({
      autor_id: userId,
      pytanie,
      temat_a: tematA,
      temat_b: tematB,
      tryb,
    })
    setPublikowanie(false)

    if (error) {
      setBlad('Coś poszło nie tak — spróbuj ponownie.')
      return
    }

    setWlasnePytanie('')
    setWlasnyTematA('')
    setWlasnyTematB('')
    setPropozycja(wylosujSzybki(tematy, szablony))
    setWidok('odkrywaj')
    wczytaj()
  }

  return (
    <div className="quersy">
      <p className="hint">Szybkie ankiety o Waszych ulubionych twórcach — każdy Quers znika po 24h.</p>
      <div className="zakladki-podkreslenie">
        <button className={`zakladka-podkreslenie ${widok === 'odkrywaj' ? 'aktywna' : ''}`} onClick={() => setWidok('odkrywaj')}>
          Odkrywaj
        </button>
        <button className={`zakladka-podkreslenie ${widok === 'stworz' ? 'aktywna' : ''}`} onClick={() => setWidok('stworz')}>
          + Stwórz Quersa
        </button>
      </div>

      {widok === 'odkrywaj' && (
        <>
          {userId === ADMIN_ID && <ModeracjaQuersy userId={userId} />}
          {ladowanie && <p className="debug-status">Ładowanie...</p>}
          {!ladowanie && quersy.length === 0 && (
            <p className="hint">Brak aktywnych Quersów. Stwórz pierwszy!</p>
          )}
          <div className="quersy-lista">
            {quersy.map((q) => {
              const moj = glosyUzytkownika[q.id]
              const liczby = liczbaGlosow[q.id] || { a: 0, b: 0 }
              const suma = liczby.a + liczby.b
              const procA = suma ? Math.round((liczby.a / suma) * 100) : 0
              const procB = suma ? 100 - procA : 0

              return (
                <div className="quers-karta" key={q.id}>
                  <div className="quers-gorna-linia">
                    <span className="quers-autor tekst-obciety">@{q.autor?.nick || '—'}</span>
                    <span className="quers-czas">{czasDoWygasniecia(q.wygasa)}</span>
                  </div>
                  <p className="quers-pytanie">{q.pytanie}</p>
                  <div className="quers-opcje">
                    <button
                      className={`quers-opcja ${moj === 'a' ? 'wybrana' : ''}`}
                      disabled={!!moj}
                      onClick={() => zaglosuj(q.id, 'a')}
                    >
                      <span>{q.temat_a}</span>
                      {moj && <span className="quers-procent">{procA}%</span>}
                    </button>
                    <button
                      className={`quers-opcja ${moj === 'b' ? 'wybrana' : ''}`}
                      disabled={!!moj}
                      onClick={() => zaglosuj(q.id, 'b')}
                    >
                      <span>{q.temat_b}</span>
                      {moj && <span className="quers-procent">{procB}%</span>}
                    </button>
                  </div>
                  <div className="quers-dolna-linia">
                    <button
                      className={`quers-polub ${polubienia[q.id] ? 'polubione' : ''}`}
                      onClick={() => przelaczPolubienie(q.id)}
                    >
                      <IkonaSerce rozmiar={15} wypelnione={polubienia[q.id]} /> {liczbaPolubien[q.id] || 0}
                    </button>
                    <button
                      className="quers-zglos"
                      onClick={() => zglos(q.id)}
                      disabled={zgloszone[q.id]}
                    >
                      <IkonaFlaga rozmiar={13} /> {zgloszone[q.id] ? 'Zgłoszono' : 'Zgłoś'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {widok === 'stworz' && (
        <div className="quers-tworzenie card">
          <div className="zakladki">
            <button className={`zakladka ${tryb === 'szybki' ? 'aktywna' : ''}`} onClick={() => setTryb('szybki')}>
              Szybki
            </button>
            <button className={`zakladka ${tryb === 'wlasny' ? 'aktywna' : ''}`} onClick={() => setTryb('wlasny')}>
              Własny
            </button>
          </div>

          {tryb === 'szybki' && propozycja && (
            <div className="quers-podglad">
              <p className="quers-pytanie">{propozycja.pytanie}</p>
              <div className="quers-opcje">
                <div className="quers-opcja">{propozycja.tematA}</div>
                <div className="quers-opcja">{propozycja.tematB}</div>
              </div>
              <button
                className="install-btn drugorzedny"
                onClick={() => setPropozycja(wylosujSzybki(tematy, szablony))}
              >
                Wylosuj inne
              </button>
            </div>
          )}

          {tryb === 'wlasny' && (
            <>
              <p className="hint">Pytania mają być pozytywne albo neutralne, np. „Kto lepiej…”, „Czyj… jest fajniejszy”.</p>
              <label className="pole">
                Pytanie
                <input
                  className="input"
                  value={wlasnePytanie}
                  onChange={(e) => setWlasnePytanie(e.target.value)}
                  maxLength={140}
                  placeholder="Kto ma lepsze filmy?"
                />
              </label>
              <label className="pole">
                Postać A
                <input className="input" value={wlasnyTematA} onChange={(e) => setWlasnyTematA(e.target.value)} maxLength={40} />
              </label>
              <label className="pole">
                Postać B
                <input className="input" value={wlasnyTematB} onChange={(e) => setWlasnyTematB(e.target.value)} maxLength={40} />
              </label>
            </>
          )}

          {blad && <p className="blad">{blad}</p>}

          <button className="install-btn" onClick={opublikuj} disabled={publikowanie}>
            <IkonaQuersy rozmiar={16} /> {publikowanie ? 'Publikowanie...' : 'Opublikuj Quersa'}
          </button>
        </div>
      )}
    </div>
  )
}
