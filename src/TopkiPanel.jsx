import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { IkonaSzkola, IkonaGrupa, IkonaKorona, IkonaGlobus } from './Ikony'
import Awatar from './Awatar'
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
  const [liderzy, setLiderzy] = useState({})
  const [wybranaTopka, setWybranaTopka] = useState(null)
  const [pokazDodawanie, setPokazDodawanie] = useState(false)
  const [tryb, setTryb] = useState('dolacz') // 'dolacz' | 'stworz'

  const [nazwa, setNazwa] = useState('')
  const [typ, setTyp] = useState('grupa')
  const [tworzenie, setTworzenie] = useState(false)
  const [bladTworzenia, setBladTworzenia] = useState(null)

  const [kodDolaczenia, setKodDolaczenia] = useState('')
  const [dolaczanie, setDolaczanie] = useState(false)
  const [bladDolaczania, setBladDolaczania] = useState(null)

  const wczytajLiderowDnia = async (listaTopek) => {
    if (listaTopek.length === 0) {
      setLiderzy({})
      return
    }
    const dzisiaj = new Date().toISOString().slice(0, 10)
    const { data: glosyDzis } = await supabase
      .from('glosy')
      .select('topka_id, zaglosowany_id')
      .in(
        'topka_id',
        listaTopek.map((t) => t.id)
      )
      .eq('dzien', dzisiaj)

    const licznik = {}
    ;(glosyDzis || []).forEach((g) => {
      licznik[g.topka_id] = licznik[g.topka_id] || {}
      licznik[g.topka_id][g.zaglosowany_id] = (licznik[g.topka_id][g.zaglosowany_id] || 0) + 1
    })

    const zwyciezcaPerTopka = {}
    Object.entries(licznik).forEach(([topkaId, glosyNaOsoby]) => {
      let najlepszyId = null
      let najlepszaLiczba = 0
      Object.entries(glosyNaOsoby).forEach(([uid, liczba]) => {
        if (liczba > najlepszaLiczba) {
          najlepszyId = uid
          najlepszaLiczba = liczba
        }
      })
      zwyciezcaPerTopka[topkaId] = { id: najlepszyId, glosy: najlepszaLiczba }
    })

    const idki = [...new Set(Object.values(zwyciezcaPerTopka).map((w) => w.id))]
    if (idki.length === 0) {
      setLiderzy({})
      return
    }

    const { data: profile } = await supabase.from('profiles').select('id, nick, avatar').in('id', idki)
    const nickPoId = Object.fromEntries((profile || []).map((p) => [p.id, p.nick]))
    const avatarPoId = Object.fromEntries((profile || []).map((p) => [p.id, p.avatar]))

    const finalne = {}
    Object.entries(zwyciezcaPerTopka).forEach(([topkaId, w]) => {
      finalne[topkaId] = { nick: nickPoId[w.id], avatar: avatarPoId[w.id], glosy: w.glosy }
    })
    setLiderzy(finalne)
  }

  const wczytajTopki = async () => {
    setLadowanie(true)
    const { data } = await supabase.from('topki').select('*').order('created_at', { ascending: false })
    setTopki(data || [])
    setLadowanie(false)
    await wczytajLiderowDnia(data || [])
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
          : `Nie udało się stworzyć Topki (${error.message})`
      )
      return
    }

    setNazwa('')
    setPokazDodawanie(false)
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
          : `Nieprawidłowy kod dołączenia (${error.message})`
      )
      return
    }

    setKodDolaczenia('')
    setPokazDodawanie(false)
    wczytajTopki()
  }

  if (wybranaTopka) {
    return <GlosowaniePanel topka={wybranaTopka} userId={userId} onWstecz={() => setWybranaTopka(null)} />
  }

  return (
    <div className="topki-panel">
      <div className="panel-naglowek">
        <h1>Twoje Topki</h1>
      </div>
      <p className="hint">
        Głosujcie codziennie w swojej klasie albo wśród znajomych — kto zbierze najwięcej głosów, nosi
        koronę do jutra.
      </p>

      {!ladowanie && topki.length > 0 && (
        <div className="zakladki-podkreslenie">
          <button
            className={`zakladka-podkreslenie ${!pokazDodawanie ? 'aktywna' : ''}`}
            onClick={() => setPokazDodawanie(false)}
          >
            Twoje Topki
          </button>
          <button
            className={`zakladka-podkreslenie ${pokazDodawanie ? 'aktywna' : ''}`}
            onClick={() => setPokazDodawanie(true)}
          >
            + Dodaj Topkę
          </button>
        </div>
      )}

      {(pokazDodawanie || (!ladowanie && topki.length === 0)) && (
        <div className="card">
          <div className="zakladki">
            <button
              type="button"
              className={`zakladka ${tryb === 'dolacz' ? 'aktywna' : ''}`}
              onClick={() => setTryb('dolacz')}
            >
              Dołącz po kodzie
            </button>
            <button
              type="button"
              className={`zakladka ${tryb === 'stworz' ? 'aktywna' : ''}`}
              onClick={() => setTryb('stworz')}
            >
              Stwórz nową
            </button>
          </div>

          {tryb === 'dolacz' ? (
            <form onSubmit={dolaczDoTopki}>
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
          ) : (
            <form onSubmit={stworzTopke}>
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
              <label className="pole">Typ</label>
              <div className="typ-wybor">
                <button
                  type="button"
                  className={`typ-opcja ${typ === 'grupa' ? 'aktywna' : ''}`}
                  onClick={() => setTyp('grupa')}
                >
                  <IkonaGrupa /> Grupa
                </button>
                <button
                  type="button"
                  className={`typ-opcja ${typ === 'klasa' ? 'aktywna' : ''}`}
                  onClick={() => setTyp('klasa')}
                >
                  <IkonaSzkola /> Klasa
                </button>
              </div>
              {bladTworzenia && <p className="blad">{bladTworzenia}</p>}
              <button className="install-btn" type="submit" disabled={tworzenie}>
                {tworzenie ? 'Tworzenie...' : 'Stwórz Topkę'}
              </button>
            </form>
          )}
        </div>
      )}

      {ladowanie && <p className="hint">Ładowanie...</p>}

      {!ladowanie && topki.length > 0 && (
        <div className="topki-siatka">
          {topki.map((t) => (
            <button key={t.id} className="topka-kafelek" onClick={() => setWybranaTopka(t)}>
              <span className="topka-kafelek-ikona">
                {t.typ === 'klasa' ? (
                  <IkonaSzkola rozmiar={22} />
                ) : t.typ === 'ogolna' ? (
                  <IkonaGlobus rozmiar={22} />
                ) : (
                  <IkonaGrupa rozmiar={22} />
                )}
              </span>
              <span className="topka-kafelek-tekst">
                <span className="topka-kafelek-gorna-linia">
                  <span className="topka-kafelek-nazwa tekst-obciety">{t.nazwa}</span>
                  <span className={`typ-pill typ-${t.typ === 'ogolna' ? 'grupa' : t.typ}`}>
                    {t.typ === 'klasa' ? 'Klasa' : t.typ === 'ogolna' ? 'Ogólna' : 'Grupa'}
                  </span>
                </span>
                {liderzy[t.id] ? (
                  <span className="korona-dnia">
                    <IkonaKorona />
                    <Awatar id={liderzy[t.id].avatar} rozmiar={16} />
                    <span className="tekst-obciety">
                      @{liderzy[t.id].nick} ({liderzy[t.id].glosy}{' '}
                      {liderzy[t.id].glosy === 1 ? 'głos' : 'głosy'})
                    </span>
                  </span>
                ) : (
                  <span className="korona-dnia korona-pusta">Jeszcze nikt dziś nie głosował</span>
                )}
                {t.typ !== 'ogolna' && <span className="topka-kod">kod: {t.kod_dolaczenia}</span>}
              </span>
              <span className="topka-strzalka">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
