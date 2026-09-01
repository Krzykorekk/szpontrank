import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function PytanieDnia({ userId }) {
  const [pytanie, setPytanie] = useState(null)
  const [glosy, setGlosy] = useState({ a: 0, b: 0 })
  const [mojWybor, setMojWybor] = useState(null)
  const [ladowanie, setLadowanie] = useState(true)
  const [glosowanie, setGlosowanie] = useState(false)

  useEffect(() => {
    wczytaj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function wczytaj() {
    setLadowanie(true)
    const { data, error } = await supabase.rpc('pobierz_pytanie_dnia')
    if (error || data?.blad) {
      setLadowanie(false)
      return
    }
    setPytanie(data)

    const { data: wszystkieGlosy } = await supabase
      .from('pytania_appki_glosy')
      .select('glosujacy_id, wybor')
      .eq('dzien_id', data.dzien_id)

    const a = (wszystkieGlosy || []).filter((g) => g.wybor === 'a').length
    const b = (wszystkieGlosy || []).filter((g) => g.wybor === 'b').length
    setGlosy({ a, b })

    const moj = (wszystkieGlosy || []).find((g) => g.glosujacy_id === userId)
    setMojWybor(moj ? moj.wybor : null)
    setLadowanie(false)
  }

  async function zaglosuj(wybor) {
    if (mojWybor || glosowanie) return
    setGlosowanie(true)
    const { error } = await supabase
      .from('pytania_appki_glosy')
      .insert({ dzien_id: pytanie.dzien_id, glosujacy_id: userId, wybor })
    setGlosowanie(false)
    if (!error) {
      setMojWybor(wybor)
      setGlosy((g) => (wybor === 'a' ? { ...g, a: g.a + 1 } : { ...g, b: g.b + 1 }))
    }
  }

  if (ladowanie || !pytanie) return null

  const suma = glosy.a + glosy.b
  const procentA = suma > 0 ? Math.round((glosy.a / suma) * 100) : 50
  const procentB = 100 - procentA

  return (
    <div className="pytanie-dnia-karta">
      <h3 className="pytanie-dnia-tytul">Pytanie Dnia</h3>
      <p className="pytanie-dnia-tresc">{pytanie.tresc}</p>
      <div className="pytanie-dnia-opcje">
        <button
          className={`pytanie-dnia-opcja ${mojWybor === 'a' ? 'wybrana' : ''}`}
          onClick={() => zaglosuj('a')}
          disabled={!!mojWybor || glosowanie}
        >
          <span>{pytanie.opcja_a}</span>
          {mojWybor && (
            <>
              <div className="pytanie-dnia-pasek-tlo">
                <div className="pytanie-dnia-pasek-wypelnienie" style={{ width: `${procentA}%` }} />
              </div>
              <span className="pytanie-dnia-procent">{procentA}%</span>
            </>
          )}
        </button>
        <span className="pytanie-dnia-vs">czy</span>
        <button
          className={`pytanie-dnia-opcja ${mojWybor === 'b' ? 'wybrana' : ''}`}
          onClick={() => zaglosuj('b')}
          disabled={!!mojWybor || glosowanie}
        >
          <span>{pytanie.opcja_b}</span>
          {mojWybor && (
            <>
              <div className="pytanie-dnia-pasek-tlo">
                <div className="pytanie-dnia-pasek-wypelnienie" style={{ width: `${procentB}%` }} />
              </div>
              <span className="pytanie-dnia-procent">{procentB}%</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
