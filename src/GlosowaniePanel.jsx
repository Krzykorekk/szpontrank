import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

function numerDnia() {
  const teraz = new Date()
  const start = new Date(teraz.getFullYear(), 0, 0)
  const roznica = teraz - start
  return Math.floor(roznica / (1000 * 60 * 60 * 24))
}

export default function GlosowaniePanel({ topka, userId, onWstecz }) {
  const [ladowanie, setLadowanie] = useState(true)
  const [blad, setBlad] = useState(null)
  const [pytanie, setPytanie] = useState(null)
  const [kandydaci, setKandydaci] = useState([])
  const [jużZagłosowano, setJużZagłosowano] = useState(false)
  const [zapisywanie, setZapisywanie] = useState(false)

  useEffect(() => {
    wczytajWszystko()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topka.id])

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
      .select('id, imie, nick, polaczone_konta')
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

  const oddajGlos = async (kandydatId) => {
    setZapisywanie(true)
    setBlad(null)

    const { error } = await supabase.from('glosy').insert({
      topka_id: topka.id,
      pytanie_id: pytanie.id,
      glosujacy_id: userId,
      zaglosowany_id: kandydatId,
    })

    setZapisywanie(false)

    if (error) {
      setBlad(
        error.code === '23505'
          ? 'Już dziś zagłosowałeś/aś w tej Topce.'
          : 'Nie udało się zapisać głosu. Spróbuj ponownie.'
      )
      setJużZagłosowano(error.code === '23505')
      return
    }

    setJużZagłosowano(true)
  }

  return (
    <div className="card glosowanie">
      <button className="wstecz-btn" onClick={onWstecz}>
        ← Wróć do Topek
      </button>

      <h2>{topka.nazwa}</h2>

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
                  className="kandydat-btn"
                  disabled={zapisywanie}
                  onClick={() => oddajGlos(k.id)}
                >
                  @{k.nick}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
