import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'

function numerDnia() {
  const teraz = new Date()
  const start = new Date(teraz.getFullYear(), 0, 0)
  const roznica = teraz - start
  return Math.floor(roznica / (1000 * 60 * 60 * 24))
}

export default function GlosowaniePanel({ topka, userId, onWstecz }) {
  const [widok, setWidok] = useState('glosowanie') // 'glosowanie' | 'wyniki' | 'czlonkowie'

  const [ladowanie, setLadowanie] = useState(true)
  const [blad, setBlad] = useState(null)
  const [pytanie, setPytanie] = useState(null)
  const [kandydaci, setKandydaci] = useState([])
  const [jużZagłosowano, setJużZagłosowano] = useState(false)
  const [zapisywanie, setZapisywanie] = useState(false)
  const [zaznaczonyKandydat, setZaznaczonyKandydat] = useState(null)

  const [wyniki, setWyniki] = useState([])
  const [ladowanieWynikow, setLadowanieWynikow] = useState(true)

  const [czlonkowieLista, setCzlonkowieLista] = useState([])
  const [ladowanieCzlonkow, setLadowanieCzlonkow] = useState(true)
  const [usuwanie, setUsuwanie] = useState(false)
  const jestZalozycielem = topka.zalozyciel_id === userId && topka.typ !== 'ogolna'

  useEffect(() => {
    wczytajWszystko()
    wczytajWyniki()
    wczytajCzlonkow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topka.id])

  const wczytajCzlonkow = async () => {
    setLadowanieCzlonkow(true)
    const { data: czlonkowie } = await supabase
      .from('topka_czlonkowie')
      .select('user_id, joined_at')
      .eq('topka_id', topka.id)
      .order('joined_at')

    const idki = (czlonkowie || []).map((c) => c.user_id)
    if (idki.length === 0) {
      setCzlonkowieLista([])
      setLadowanieCzlonkow(false)
      return
    }
    const { data: profile } = await supabase.from('profiles').select('id, imie, nick, avatar').in('id', idki)
    const mapa = Object.fromEntries((profile || []).map((p) => [p.id, p]))
    setCzlonkowieLista(idki.map((id) => mapa[id]).filter(Boolean))
    setLadowanieCzlonkow(false)
  }

  const usunTopke = async () => {
    if (!window.confirm(`Na pewno usunąć Topkę "${topka.nazwa}"? Tego nie da się cofnąć — znikną wszystkie głosy.`)) {
      return
    }
    setUsuwanie(true)
    const { error } = await supabase.from('topki').delete().eq('id', topka.id)
    setUsuwanie(false)
    if (!error) {
      onWstecz()
    } else {
      window.alert(`Nie udało się usunąć Topki (${error.message})`)
    }
  }

  const wczytajWszystko = async () => {
    setLadowanie(true)
    setBlad(null)

    // 1. pobierz aktywne pytania dla typu tej Topki, wybierz "dzisiejsze" (tak samo dla wszystkich w Topce)
    const { data: pytaniaData, error: bladPytan } = await supabase
      .from('pytania')
      .select('*')
      .eq('tryb', topka.typ)
      .eq('aktywne', true)
      .order('id')

    if (bladPytan || !pytaniaData || pytaniaData.length === 0) {
      setBlad('Nie udało się wczytać dzisiejszego pytania.')
      setLadowanie(false)
      return
    }

    const dzisiejsze = pytaniaData[numerDnia() % pytaniaData.length]
    setPytanie(dzisiejsze)

    // 2. sprawdź, czy user już dziś głosował w tej Topce na to pytanie
    const dzisiaj = new Date().toISOString().slice(0, 10)
    const { data: istniejacyGlos } = await supabase
      .from('glosy')
      .select('id')
      .eq('topka_id', topka.id)
      .eq('pytanie_id', dzisiejsze.id)
      .eq('glosujacy_id', userId)
      .eq('dzien', dzisiaj)
      .maybeSingle()

    if (istniejacyGlos) {
      setJużZagłosowano(true)
      setLadowanie(false)
      return
    }

    // 3. pobierz członków Topki (bez siebie), potem ich profile
    const { data: czlonkowie } = await supabase
      .from('topka_czlonkowie')
      .select('user_id')
      .eq('topka_id', topka.id)
      .neq('user_id', userId)

    const idki = (czlonkowie || []).map((c) => c.user_id)

    if (idki.length === 0) {
      setKandydaci([])
      setLadowanie(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, imie, nick, avatar, polaczone_konta')
      .in('id', idki)

    // 4. odfiltruj osoby, które już mają platformę, której dotyczy pytanie
    const platforma = dzisiejsze.wymaga_platformy
    const finalni = (profile || []).filter((p) => {
      if (!platforma) return true
      return !(p.polaczone_konta && p.polaczone_konta[platforma] === true)
    })

    setKandydaci(finalni)
    setLadowanie(false)
  }

  const wczytajWyniki = async () => {
    setLadowanieWynikow(true)

    const { data: glosyWszystkie } = await supabase
      .from('glosy')
      .select('zaglosowany_id')
      .eq('topka_id', topka.id)

    const licznik = {}
    ;(glosyWszystkie || []).forEach((g) => {
      licznik[g.zaglosowany_id] = (licznik[g.zaglosowany_id] || 0) + 1
    })

    const posortowane = Object.entries(licznik).sort((a, b) => b[1] - a[1])
    const idki = posortowane.map(([id]) => id)

    if (idki.length === 0) {
      setWyniki([])
      setLadowanieWynikow(false)
      return
    }

    const { data: profile } = await supabase.from('profiles').select('id, imie, nick, avatar').in('id', idki)
    const profilPoId = Object.fromEntries((profile || []).map((p) => [p.id, p]))

    const finalne = posortowane.map(([id, liczba], i) => ({
      pozycja: i + 1,
      id,
      glosy: liczba,
      ...profilPoId[id],
    }))

    setWyniki(finalne)
    setLadowanieWynikow(false)
  }

  const oddajGlos = async (kandydatId) => {
    setZapisywanie(true)
    setBlad(null)
    setZaznaczonyKandydat(kandydatId)

    const { error } = await supabase.from('glosy').insert({
      topka_id: topka.id,
      pytanie_id: pytanie.id,
      glosujacy_id: userId,
      zaglosowany_id: kandydatId,
    })

    if (error) {
      setZapisywanie(false)
      setZaznaczonyKandydat(null)
      setBlad(
        error.code === '23505'
          ? 'Już dziś zagłosowałeś/aś w tej Topce.'
          : 'Nie udało się zapisać głosu. Spróbuj ponownie.'
      )
      setJużZagłosowano(error.code === '23505')
      return
    }

    wczytajWyniki()
    setTimeout(() => {
      setZapisywanie(false)
      setJużZagłosowano(true)
    }, 550)
  }

  return (
    <div className="topki-panel">
      <button className="wstecz-btn" onClick={onWstecz}>
        ← Wróć do Topek
      </button>

      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          letterSpacing: '0.02em',
          margin: '0 0 16px',
          overflowWrap: 'anywhere',
        }}
      >
        {topka.nazwa}
      </h1>

      <div className="zakladki">
        <button
          type="button"
          className={`zakladka ${widok === 'glosowanie' ? 'aktywna' : ''}`}
          onClick={() => setWidok('glosowanie')}
        >
          Głosuj
        </button>
        <button
          type="button"
          className={`zakladka ${widok === 'wyniki' ? 'aktywna' : ''}`}
          onClick={() => setWidok('wyniki')}
        >
          Wyniki
        </button>
        <button
          type="button"
          className={`zakladka ${widok === 'czlonkowie' ? 'aktywna' : ''}`}
          onClick={() => setWidok('czlonkowie')}
        >
          Członkowie
        </button>
      </div>

      {widok === 'glosowanie' && (
        <div className="card">
          {ladowanie && <p className="hint">Ładowanie dzisiejszego pytania...</p>}

          {!ladowanie && blad && <p className="blad">{blad}</p>}

          {!ladowanie && !blad && pytanie && (
            <>
              <p className="pytanie-tresc">{pytanie.tresc}</p>

              {jużZagłosowano ? (
                <p className="status-pill">Dzisiejszy głos oddany ✓ Wróć jutro po kolejne pytanie.</p>
              ) : kandydaci.length === 0 ? (
                <p className="hint">Brak innych osób w tej Topce do zagłosowania — zaproś znajomych kodem.</p>
              ) : (
                <div className="lista-kandydatow">
                  {kandydaci.map((k) => (
                    <button
                      key={k.id}
                      className={`kandydat-btn ${zaznaczonyKandydat === k.id ? 'kandydat-wybrany' : ''}`}
                      disabled={zapisywanie}
                      onClick={() => oddajGlos(k.id)}
                    >
                      <Awatar id={k.avatar || 'blyskawica'} rozmiar={22} />
                      <span className="tekst-obciety">@{k.nick}</span>
                      {zaznaczonyKandydat === k.id && (
                        <svg className="kandydat-ptaszek" viewBox="0 0 24 24" width="20" height="20">
                          <path
                            d="M4 12.5l5 5L20 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {widok === 'wyniki' && (
        <div className="card">
          {ladowanieWynikow && <p className="hint">Ładowanie wyników...</p>}
          {!ladowanieWynikow && wyniki.length === 0 && (
            <p className="hint">Jeszcze nikt nie oddał głosu w tej Topce.</p>
          )}
          {!ladowanieWynikow && wyniki.length > 0 && (
            <ol className="ranking-lista">
              {wyniki.map((w) => (
                <li key={w.id} className="ranking-wiersz">
                  <span className="ranking-pozycja">#{w.pozycja}</span>
                  <span className="ranking-avatar"><Awatar id={w.avatar || 'blyskawica'} rozmiar={26} /></span>
                  <span className="ranking-nazwa">
                    {w.imie} <span className="ranking-nick">@{w.nick}</span>
                  </span>
                  <span className="ranking-glosy">
                    {w.glosy} {w.glosy === 1 ? 'głos' : 'głosy'}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
      {widok === 'czlonkowie' && (
        <div className="card">
          {ladowanieCzlonkow && <p className="hint">Ładowanie...</p>}
          {!ladowanieCzlonkow && czlonkowieLista.length === 0 && (
            <p className="hint">Brak innych członków — zaproś znajomych kodem.</p>
          )}
          {!ladowanieCzlonkow && czlonkowieLista.length > 0 && (
            <ul className="ranking-lista">
              {czlonkowieLista.map((c) => (
                <li key={c.id} className="ranking-wiersz">
                  <span className="ranking-avatar"><Awatar id={c.avatar || 'blyskawica'} rozmiar={26} /></span>
                  <span className="ranking-nazwa">
                    {c.imie} <span className="ranking-nick">@{c.nick}</span>
                  </span>
                  {c.id === topka.zalozyciel_id && <span className="znacznik-drugorzedny">założyciel</span>}
                </li>
              ))}
            </ul>
          )}

          {jestZalozycielem && (
            <button
              className="install-btn wyloguj"
              style={{ marginTop: 18 }}
              onClick={usunTopke}
              disabled={usuwanie}
            >
              {usuwanie ? 'Usuwanie...' : 'Usuń Topkę na stałe'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
