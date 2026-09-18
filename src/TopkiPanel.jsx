import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabaseClient'
import { IkonaSzkola, IkonaGrupa, IkonaKorona, IkonaGlobus } from './Ikony'
import Awatar from './Awatar'
import GlosowaniePanel from './GlosowaniePanel'
import OgolnyRanking from './OgolnyRanking'

function losowyKod() {
  const znaki = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // bez znaków łatwych do pomylenia (0/O, 1/I)
  let kod = ''
  for (let i = 0; i < 5; i++) {
    kod += znaki[Math.floor(Math.random() * znaki.length)]
  }
  return kod
}

export default function TopkiPanel({ userId, profil, onProfilZmieniony }) {
  const { t } = useTranslation()
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
  const [przelaczanieOgolnej, setPrzelaczanieOgolnej] = useState(false)
  const [pokazRanking, setPokazRanking] = useState(false)

  const jestWOgolnej = !!profil?.ogolna_topka

  const przelaczOgolnaTopke = async () => {
    setPrzelaczanieOgolnej(true)
    await supabase.rpc('ustaw_ogolna_topke', { wlacz: !jestWOgolnej })
    setPrzelaczanieOgolnej(false)
    onProfilZmieniony?.()
  }

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
      let najlepszaLiczba = 0
      Object.values(glosyNaOsoby).forEach((liczba) => {
        if (liczba > najlepszaLiczba) najlepszaLiczba = liczba
      })
      const remisujacy = Object.entries(glosyNaOsoby)
        .filter(([, liczba]) => liczba === najlepszaLiczba)
        .map(([uid]) => uid)

      zwyciezcaPerTopka[topkaId] = {
        id: remisujacy.length === 1 ? remisujacy[0] : null,
        glosy: najlepszaLiczba,
        remis: remisujacy.length > 1,
      }
    })

    const idki = [...new Set(Object.values(zwyciezcaPerTopka).map((w) => w.id).filter(Boolean))]

    const { data: profile } =
      idki.length > 0
        ? await supabase.from('profiles').select('id, nick, avatar').in('id', idki)
        : { data: [] }
    const nickPoId = Object.fromEntries((profile || []).map((p) => [p.id, p.nick]))
    const avatarPoId = Object.fromEntries((profile || []).map((p) => [p.id, p.avatar]))

    const finalne = {}
    Object.entries(zwyciezcaPerTopka).forEach(([topkaId, w]) => {
      finalne[topkaId] = w.remis
        ? { remis: true, glosy: w.glosy }
        : { nick: nickPoId[w.id], avatar: avatarPoId[w.id], glosy: w.glosy }
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
          ? t('topki.maxTwo')
          : t('topki.createFailed', { blad: error.message })
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
          ? t('topki.maxFive')
          : t('topki.invalidCode', { blad: error.message })
      )
      return
    }

    setKodDolaczenia('')
    setPokazDodawanie(false)
    wczytajTopki()
  }

  if (pokazRanking) {
    return <OgolnyRanking onWstecz={() => setPokazRanking(false)} />
  }

  if (wybranaTopka) {
    return (
      <GlosowaniePanel
        topka={wybranaTopka}
        userId={userId}
        onWstecz={() => {
          setWybranaTopka(null)
          wczytajTopki()
        }}
      />
    )
  }

  return (
    <div className="topki-panel">
      <div className="panel-naglowek">
        <h1>{t('topki.title')}</h1>
      </div>

      <p className="hint">{t('topki.intro')}</p>

      <div className="ogolna-topka-karta card">
        <div className="ogolna-topka-karta-tekst">
          <span className="topka-kafelek-ikona"><IkonaGlobus rozmiar={22} /></span>
          <div>
            <h3>{t('topki.appRankingTitle')}</h3>
            <p className="hint">{t('topki.appRankingDesc')}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button className="install-btn drugorzedny" onClick={() => setPokazRanking(true)}>
            {t('topki.seeRanking')}
          </button>
          <button className="install-btn" onClick={przelaczOgolnaTopke} disabled={przelaczanieOgolnej}>
            {przelaczanieOgolnej ? '...' : jestWOgolnej ? t('topki.leave') : t('topki.join')}
          </button>
        </div>
      </div>

      {!ladowanie && topki.filter((t2) => t2.typ !== 'ogolna').length > 0 && (
        <div className="zakladki-podkreslenie">
          <button
            className={`zakladka-podkreslenie ${!pokazDodawanie ? 'aktywna' : ''}`}
            onClick={() => setPokazDodawanie(false)}
          >
            {t('topki.yourRankings')}
          </button>
          <button
            className={`zakladka-podkreslenie ${pokazDodawanie ? 'aktywna' : ''}`}
            onClick={() => setPokazDodawanie(true)}
          >
            {t('topki.addRanking')}
          </button>
        </div>
      )}

      {(pokazDodawanie || (!ladowanie && topki.filter((t2) => t2.typ !== 'ogolna').length === 0)) && (
        <div className="card">
          <div className="zakladki">
            <button
              type="button"
              className={`zakladka ${tryb === 'dolacz' ? 'aktywna' : ''}`}
              onClick={() => setTryb('dolacz')}
            >
              {t('topki.joinByCode')}
            </button>
            <button
              type="button"
              className={`zakladka ${tryb === 'stworz' ? 'aktywna' : ''}`}
              onClick={() => setTryb('stworz')}
            >
              {t('topki.createNew')}
            </button>
          </div>

          {tryb === 'dolacz' ? (
            <form onSubmit={dolaczDoTopki}>
              <label className="pole">
                {t('topki.joinCodeLabel')}
                <input
                  className="input"
                  required
                  value={kodDolaczenia}
                  onChange={(e) => setKodDolaczenia(e.target.value)}
                  placeholder={t('topki.joinCodePlaceholder')}
                />
              </label>
              {bladDolaczania && <p className="blad">{bladDolaczania}</p>}
              <button className="install-btn" type="submit" disabled={dolaczanie}>
                {dolaczanie ? t('topki.joining') : t('topki.joinBtn')}
              </button>
            </form>
          ) : (
            <form onSubmit={stworzTopke}>
              <label className="pole">
                {t('topki.nameLabel')}
                <input
                  className="input"
                  required
                  value={nazwa}
                  onChange={(e) => setNazwa(e.target.value)}
                  placeholder={t('topki.namePlaceholder')}
                />
              </label>
              <label className="pole">{t('topki.typeLabel')}</label>
              <div className="typ-wybor">
                <button
                  type="button"
                  className={`typ-opcja ${typ === 'grupa' ? 'aktywna' : ''}`}
                  onClick={() => setTyp('grupa')}
                >
                  <IkonaGrupa /> {t('topki.typeGroup')}
                </button>
                <button
                  type="button"
                  className={`typ-opcja ${typ === 'klasa' ? 'aktywna' : ''}`}
                  onClick={() => setTyp('klasa')}
                >
                  <IkonaSzkola /> {t('topki.typeClass')}
                </button>
              </div>
              {bladTworzenia && <p className="blad">{bladTworzenia}</p>}
              <button className="install-btn" type="submit" disabled={tworzenie}>
                {tworzenie ? t('topki.creating') : t('topki.createBtn')}
              </button>
            </form>
          )}
        </div>
      )}

      {ladowanie && <p className="hint">{t('topki.loading')}</p>}

      {!pokazDodawanie && !ladowanie && topki.filter((t2) => t2.typ !== 'ogolna').length > 0 && (
        <div className="topki-siatka">
          {topki.filter((t2) => t2.typ !== 'ogolna').map((t2) => (
            <button key={t2.id} className="topka-kafelek" onClick={() => setWybranaTopka(t2)}>
              <span className="topka-kafelek-ikona">
                {t2.typ === 'klasa' ? <IkonaSzkola rozmiar={22} /> : <IkonaGrupa rozmiar={22} />}
              </span>
              <span className="topka-kafelek-tekst">
                <span className="topka-kafelek-gorna-linia">
                  <span className="topka-kafelek-nazwa tekst-obciety">{t2.nazwa}</span>
                  <span className={`typ-pill typ-${t2.typ}`}>{t2.typ === 'klasa' ? t('topki.typeClass') : t('topki.typeGroup')}</span>
                </span>
                {liderzy[t2.id]?.remis ? (
                  <span className="korona-dnia">
                    <IkonaKorona className="korona-animowana" />
                    <span className="tekst-obciety">
                      {t('topki.tieResult', { count: liderzy[t2.id].glosy, slowo: t('topki.vote', { count: liderzy[t2.id].glosy }) })}
                    </span>
                  </span>
                ) : liderzy[t2.id] ? (
                  <span className="korona-dnia">
                    <IkonaKorona className="korona-animowana" />
                    <Awatar id={liderzy[t2.id].avatar} rozmiar={16} />
                    <span className="tekst-obciety">
                      @{liderzy[t2.id].nick} ({liderzy[t2.id].glosy}{' '}
                      {t('topki.vote', { count: liderzy[t2.id].glosy })})
                    </span>
                  </span>
                ) : (
                  <span className="korona-dnia korona-pusta">{t('topki.noVotesYet')}</span>
                )}
                <span className="topka-kod">{t('topki.codeLabel', { kod: t2.kod_dolaczenia })}</span>
              </span>
              <span className="topka-strzalka">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
