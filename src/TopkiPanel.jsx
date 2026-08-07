import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import GlosowaniePanel from './GlosowaniePanel'

function losowyKod() {
  const znaki = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // bez znaków łatwych do pomylenia (0/O, 1/I)
  let kod = ''
  for (let i = 0; i < 5; i++) {
    kod += znaki[Math.floor(Math.random() * znaki.length)]
  }
  return kod
}

export default function TopkiPanel({ userId }) {
  const [topki, setTopki] = useState([])
  const [ladowanie, setLadowanie] = useState(true)
  const [wybranaTopka, setWybranaTopka] = useState(null)

  const [nazwa, setNazwa] = useState('')
  const [typ, setTyp] = useState('grupa')
  const [tworzenie, setTworzenie] = useState(false)
  const [bladTworzenia, setBladTworzenia] = useState(null)

  const [kodDolaczenia, setKodDolaczenia] = useState('')
  const [dolaczanie, setDolaczanie] = useState(false)
  const [bladDolaczania, setBladDolaczania] = useState(null)

  const wczytajTopki = async () => {
    setLadowanie(true)
    const { data } = await supabase.from('topki').select('*').order('created_at', { ascending: false })
    setTopki(data || [])
    setLadowanie(false)
  }

  useEffect(() => {
    wczytajTopki()
  }, [])

  const stworzTopke = async (e) => {
    e.preventDefault()
    setBladTworzenia(null)
    setTworzenie(true)

    const { error } = await supabase.from('topki').insert({
      nazwa: nazwa.trim(),
      typ,
      kod_dolaczenia: losowyKod(),
      zalozyciel_id: userId,
    })

    setTworzenie(false)

    if (error) {
      setBladTworzenia(
        error.message.includes('maksymalnie 2')
          ? 'Możesz stworzyć maksymalnie 2 Topki.'
          : 'Nie udało się stworzyć Topki. Spróbuj ponownie.'
      )
      return
    }

    setNazwa('')
    wczytajTopki()
  }

  const dolaczDoTopki = async (e) => {
    e.preventDefault()
    setBladDolaczania(null)
    setDolaczanie(true)

    const { error } = await supabase.rpc('dolacz_po_kodzie', {
      p_kod: kodDolaczenia.trim().toUpperCase(),
    })

    setDolaczanie(false)

    if (error) {
      setBladDolaczania(
        error.message.includes('maksymalnie 5')
          ? 'Należysz już do maksymalnej liczby 5 Topek.'
          : 'Nieprawidłowy kod dołączenia.'
      )
      return
    }

    setKodDolaczenia('')
    wczytajTopki()
  }

  if (wybranaTopka) {
    return (
      <GlosowaniePanel
        topka={wybranaTopka}
        userId={userId}
        onWstecz={() => setWybranaTopka(null)}
      />
    )
  }

  return (
    <div className="topki-panel">
      <div className="card">
        <h2>Twoje Topki</h2>
        {ladowanie && <p className="hint">Ładowanie...</p>}
        {!ladowanie && topki.length === 0 && (
          <p className="hint">Nie należysz jeszcze do żadnej Topki — stwórz swoją albo dołącz po kodzie.</p>
        )}
        {!ladowanie && topki.length > 0 && (
          <ul className="lista-topek">
            {topki.map((t) => (
              <li key={t.id}>
                <button className="topka-item topka-klikalna" onClick={() => setWybranaTopka(t)}>
                  <span className={`typ-pill typ-${t.typ}`}>{t.typ === 'klasa' ? 'Klasa' : 'Grupa'}</span>
                  <span className="topka-nazwa">{t.nazwa}</span>
                  <span className="topka-kod">kod: {t.kod_dolaczenia}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="card" onSubmit={dolaczDoTopki}>
        <h2>Dołącz do Topki</h2>
        <label className="pole">
          Kod dołączenia
          <input
            className="input"
            required
            value={kodDolaczenia}
            onChange={(e) => setKodDolaczenia(e.target.value)}
            placeholder="np. XR7K2"
          />
        </label>
        {bladDolaczania && <p className="blad">{bladDolaczania}</p>}
        <button className="install-btn" type="submit" disabled={dolaczanie}>
          {dolaczanie ? 'Dołączanie...' : 'Dołącz'}
        </button>
      </form>

      <form className="card" onSubmit={stworzTopke}>
        <h2>Stwórz nową Topkę</h2>
        <label className="pole">
          Nazwa
          <input
            className="input"
            required
            value={nazwa}
            onChange={(e) => setNazwa(e.target.value)}
            placeholder="np. Klasa 3A albo Ekipa z osiedla"
          />
        </label>
        <label className="pole">
          Typ
          <select className="input" value={typ} onChange={(e) => setTyp(e.target.value)}>
            <option value="grupa">Grupa (ekipa, znajomi)</option>
            <option value="klasa">Klasa (szkolna)</option>
          </select>
        </label>
        {bladTworzenia && <p className="blad">{bladTworzenia}</p>}
        <button className="install-btn" type="submit" disabled={tworzenie}>
          {tworzenie ? 'Tworzenie...' : 'Stwórz Topkę'}
        </button>
      </form>
    </div>
  )
}
