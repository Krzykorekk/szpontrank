import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { obliczRange, OdznakaRangi } from './rangi'

export default function PojedynekDnia({ userId }) {
  const [pojedynek, setPojedynek] = useState(null)
  const [uczestnicy, setUczestnicy] = useState({})
  const [glosy, setGlosy] = useState({ a: 0, b: 0 })
  const [mojGlos, setMojGlos] = useState(null)
  const [ladowanie, setLadowanie] = useState(true)
  const [glosowanie, setGlosowanie] = useState(false)
  const [blad, setBlad] = useState(null)

  useEffect(() => {
    wczytaj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function wczytaj() {
    setLadowanie(true)
    setBlad(null)
    const { data, error } = await supabase.rpc('pobierz_pojedynek_dnia')

    if (error || data?.blad) {
      setBlad('Za mało osób zapisanych do Rankingu Ogólnego, żeby stworzyć dzisiejszy pojedynek.')
      setLadowanie(false)
      return
    }
    setPojedynek(data)

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, imie, nick, avatar, coiny_lacznie')
      .in('id', [data.uczestnik_a, data.uczestnik_b])
    setUczestnicy(Object.fromEntries((profile || []).map((p) => [p.id, p])))

    const { data: wszystkieGlosy } = await supabase
      .from('pojedynki_glosy')
      .select('glosujacy_id, wybrany_id')
      .eq('pojedynek_id', data.id)

    const a = (wszystkieGlosy || []).filter((g) => g.wybrany_id === data.uczestnik_a).length
    const b = (wszystkieGlosy || []).filter((g) => g.wybrany_id === data.uczestnik_b).length
    setGlosy({ a, b })

    const moj = (wszystkieGlosy || []).find((g) => g.glosujacy_id === userId)
    setMojGlos(moj ? moj.wybrany_id : null)

    setLadowanie(false)
  }

  async function zaglosuj(wybranyId) {
    if (mojGlos || glosowanie) return
    setGlosowanie(true)
    const { error } = await supabase
      .from('pojedynki_glosy')
      .insert({ pojedynek_id: pojedynek.id, glosujacy_id: userId, wybrany_id: wybranyId })
    setGlosowanie(false)
    if (!error) {
      setMojGlos(wybranyId)
      setGlosy((g) => ({
        a: wybranyId === pojedynek.uczestnik_a ? g.a + 1 : g.a,
        b: wybranyId === pojedynek.uczestnik_b ? g.b + 1 : g.b,
      }))
    }
  }

  if (ladowanie) return <p className="debug-status">Ładowanie pojedynku...</p>
  if (blad) return null
  if (!pojedynek) return null

  const a = uczestnicy[pojedynek.uczestnik_a]
  const b = uczestnicy[pojedynek.uczestnik_b]
  if (!a || !b) return null

  const suma = glosy.a + glosy.b
  const procentA = suma > 0 ? Math.round((glosy.a / suma) * 100) : 50
  const procentB = 100 - procentA

  return (
    <div className="pojedynek-karta">
      <h3 className="pojedynek-tytul">Pojedynek Dnia</h3>
      <div className="pojedynek-uczestnicy">
        <PojedynekOsoba osoba={a} procent={procentA} glosy={glosy.a} wybrany={mojGlos === a.id} onKlik={() => zaglosuj(a.id)} zablokowane={!!mojGlos || glosowanie} />
        <span className="pojedynek-vs">VS</span>
        <PojedynekOsoba osoba={b} procent={procentB} glosy={glosy.b} wybrany={mojGlos === b.id} onKlik={() => zaglosuj(b.id)} zablokowane={!!mojGlos || glosowanie} />
      </div>
      {mojGlos && <p className="hint" style={{ textAlign: 'center', marginTop: 10 }}>Zagłosowano — wróć jutro po kolejny pojedynek.</p>}
    </div>
  )
}

function PojedynekOsoba({ osoba, procent, glosy, wybrany, onKlik, zablokowane }) {
  const { biezaca } = obliczRange(osoba.coiny_lacznie)
  return (
    <button className={`pojedynek-osoba ${wybrany ? 'wybrana' : ''}`} onClick={onKlik} disabled={zablokowane}>
      <div className="ranking-avatar"><Awatar id={osoba.avatar || 'blyskawica'} rozmiar={54} /></div>
      <span className="pojedynek-nick">@{osoba.nick}</span>
      <OdznakaRangi klucz={biezaca.klucz} rozmiar={20} />
      {zablokowane && (
        <div className="pojedynek-pasek-tlo">
          <div className="pojedynek-pasek-wypelnienie" style={{ width: `${procent}%` }} />
        </div>
      )}
      {zablokowane && <span className="pojedynek-procent">{procent}% ({glosy})</span>}
    </button>
  )
}
