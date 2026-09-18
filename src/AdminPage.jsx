import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { ADMIN_ID } from './admin'
import PanelAdmina from './PanelAdmina'
import { sprawdzTresicSzczegolowo, opiszKategorie } from './moderacja'
import Awatar from './Awatar'

function SkanowanieNickow() {
  const [profile, setProfile] = useState([])
  const [skanowanie, setSkanowanie] = useState(false)
  const [postep, setPostep] = useState(null)
  const [tylkoNowe, setTylkoNowe] = useState(true)

  async function wczytaj() {
    const { data } = await supabase
      .from('profiles')
      .select('id, imie, nick, avatar, moderacja_status, moderacja_powod, moderacja_sprawdzono_at, created_at')
      .order('created_at', { ascending: false })
    setProfile(data || [])
  }

  useEffect(() => {
    wczytaj()
  }, [])

  async function skanuj() {
    setSkanowanie(true)
    const doSprawdzenia = tylkoNowe
      ? profile.filter((p) => !p.moderacja_sprawdzono_at)
      : profile.filter((p) => p.id !== ADMIN_ID)

    for (let i = 0; i < doSprawdzenia.length; i++) {
      const p = doSprawdzenia[i]
      setPostep(`${i + 1} / ${doSprawdzenia.length} — @${p.nick}`)

      const [wynikImie, wynikNick] = await Promise.all([
        sprawdzTresicSzczegolowo(supabase, p.imie),
        sprawdzTresicSzczegolowo(supabase, p.nick),
      ])

      const zablokowany = wynikImie.zablokowany || wynikNick.zablokowany
      const powod = opiszKategorie(wynikImie.kategorie) || opiszKategorie(wynikNick.kategorie)

      await supabase
        .from('profiles')
        .update({
          moderacja_status: zablokowany ? 'do_zmiany' : null,
          moderacja_powod: zablokowany ? powod : null,
          moderacja_sprawdzono_at: new Date().toISOString(),
        })
        .eq('id', p.id)
    }

    setPostep(null)
    setSkanowanie(false)
    wczytaj()
  }

  async function ustawStatus(id, status) {
    await supabase.from('profiles').update({ moderacja_status: status, moderacja_powod: status ? profile.find(p=>p.id===id)?.moderacja_powod : null }).eq('id', id)
    wczytaj()
  }

  const oflagowani = profile.filter((p) => p.moderacja_status && p.id !== ADMIN_ID)
  const nieSprawdzeni = profile.filter((p) => !p.moderacja_sprawdzono_at && p.id !== ADMIN_ID).length

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h2>Skanowanie nicków (AI)</h2>
      <p className="hint">
        Sprawdza imię i pseudonim wszystkich kont przez tę samą AI, która moderuje appkę na
        bieżąco — łapie treści, które istniały zanim ta warstwa moderacji powstała, albo które
        AI oceni inaczej niż wcześniej. Oflagowane konto musi zmienić dane, zanim będzie mogło
        dalej korzystać z appki (Ty jesteś zawsze wyłączony z tej blokady).
      </p>

      <label className="pole" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <input type="checkbox" checked={tylkoNowe} onChange={(e) => setTylkoNowe(e.target.checked)} />
        Skanuj tylko konta jeszcze niesprawdzone ({nieSprawdzeni})
      </label>

      <button className="install-btn" onClick={skanuj} disabled={skanowanie} style={{ marginTop: 10 }}>
        {skanowanie ? (postep || 'Skanowanie...') : 'Uruchom skanowanie'}
      </button>

      <h3 style={{ margin: '22px 0 8px' }}>Oflagowane konta ({oflagowani.length})</h3>
      {oflagowani.length === 0 && <p className="hint">Brak — wszystko czyste.</p>}
      <div className="misje-lista">
        {oflagowani.map((p) => (
          <div key={p.id} className="misja-karta" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
              <Awatar id={p.avatar || 'blyskawica'} rozmiar={32} />
              <div style={{ flex: 1 }}>
                <strong>@{p.nick}</strong> <span className="hint">({p.imie})</span>
              </div>
              <span className="hint">{p.moderacja_status === 'zbanowany' ? '🚫 Zbanowany' : '⚠️ Wymaga zmiany'}</span>
            </div>
            {p.moderacja_powod && <p className="hint" style={{ margin: 0 }}>Powód: {p.moderacja_powod}</p>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {p.moderacja_status !== 'zbanowany' && (
                <button className="install-btn drugorzedny" onClick={() => ustawStatus(p.id, 'zbanowany')}>
                  Zbanuj
                </button>
              )}
              {p.moderacja_status !== 'do_zmiany' && (
                <button className="install-btn drugorzedny" onClick={() => ustawStatus(p.id, 'do_zmiany')}>
                  Wymagaj zmiany zamiast bana
                </button>
              )}
              <button className="install-btn drugorzedny" onClick={() => ustawStatus(p.id, null)}>
                To pomyłka — odflaguj
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SzukajUzytkownika() {
  const [wszyscy, setWszyscy] = useState([])
  const [fraza, setFraza] = useState('')
  const [wczytywanie, setWczytywanie] = useState(true)
  const [edytowany, setEdytowany] = useState(null)
  const [nowyNick, setNowyNick] = useState('')
  const [noweImie, setNoweImie] = useState('')
  const [zapisywanie, setZapisywanie] = useState(false)
  const [blad, setBlad] = useState(null)

  async function wczytajWszystkich() {
    setWczytywanie(true)
    setBlad(null)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, imie, nick, avatar, moderacja_status, moderacja_powod')
      .neq('id', ADMIN_ID)
      .order('nick', { ascending: true })
    if (error) {
      setWczytywanie(false)
      setBlad(error.message)
      return
    }

    const lista = data || []
    const { data: emaile } = await supabase.rpc('pobierz_emaile_dla_admina', {
      id_userow: lista.map((p) => p.id),
    })
    const emailePodId = Object.fromEntries((emaile || []).map((e) => [e.id, e.email]))
    setWczytywanie(false)
    setWszyscy(lista.map((p) => ({ ...p, email: emailePodId[p.id] })))
  }

  useEffect(() => {
    wczytajWszystkich()
  }, [])

  const wyniki = fraza.trim()
    ? wszyscy.filter(
        (p) =>
          p.nick?.toLowerCase().includes(fraza.trim().toLowerCase()) ||
          p.email?.toLowerCase().includes(fraza.trim().toLowerCase())
      )
    : wszyscy

  function zacznijEdycje(p) {
    setEdytowany(p.id)
    setNowyNick(p.nick || '')
    setNoweImie(p.imie || '')
    setBlad(null)
  }

  async function zapiszDane(id) {
    if (!nowyNick.trim() || !noweImie.trim()) {
      setBlad('Imię i nick nie mogą być puste.')
      return
    }
    setZapisywanie(true)
    setBlad(null)
    const { error } = await supabase
      .from('profiles')
      .update({ nick: nowyNick.trim(), imie: noweImie.trim() })
      .eq('id', id)
    setZapisywanie(false)
    if (error) {
      // najczesciej: nick juz zajety (unique constraint)
      setBlad(error.message.includes('duplicate') ? 'Ten nick jest już zajęty.' : error.message)
      return
    }
    setWszyscy((w) => w.map((p) => (p.id === id ? { ...p, nick: nowyNick.trim(), imie: noweImie.trim() } : p)))
    setEdytowany(null)
  }

  async function przelaczBan(p) {
    const nowyStatus = p.moderacja_status === 'zbanowany' ? null : 'zbanowany'
    if (nowyStatus === 'zbanowany' && !window.confirm(`Na pewno zbanować @${p.nick}? Straci dostęp do appki natychmiast.`)) {
      return
    }
    const { error } = await supabase
      .from('profiles')
      .update({ moderacja_status: nowyStatus, moderacja_powod: nowyStatus ? 'Zbanowany ręcznie przez admina' : null })
      .eq('id', p.id)
    if (!error) {
      setWszyscy((w) => w.map((x) => (x.id === p.id ? { ...x, moderacja_status: nowyStatus } : x)))
    }
  }

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h2>Wszyscy użytkownicy ({wszyscy.length})</h2>
      <p className="hint">
        Zmień imię/nick albo zbanuj dowolne konto — niezależnie od skanowania AI poniżej.
        Wpisz coś w polu, żeby zawęzić listę.
      </p>

      <input
        className="input"
        placeholder="Filtruj po nicku..."
        value={fraza}
        onChange={(e) => setFraza(e.target.value)}
      />

      {blad && <p className="blad" style={{ marginTop: 10 }}>{blad}</p>}
      {wczytywanie && <p className="hint" style={{ marginTop: 10 }}>Wczytywanie...</p>}

      <div className="misje-lista" style={{ marginTop: 14 }}>
        {wyniki.map((p) => (
          <div key={p.id} className="misja-karta" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
              <Awatar id={p.avatar || 'blyskawica'} rozmiar={32} />
              <div style={{ flex: 1 }}>
                <div>
                  <strong>@{p.nick}</strong> <span className="hint">({p.imie})</span>
                </div>
                {p.email && <div className="hint" style={{ fontSize: '0.78rem' }}>{p.email}</div>}
              </div>
              {p.moderacja_status === 'zbanowany' && <span className="hint">🚫 Zbanowany</span>}
            </div>

            {edytowany === p.id ? (
              <>
                <label className="pole" style={{ width: '100%' }}>
                  Imię
                  <input className="input" value={noweImie} onChange={(e) => setNoweImie(e.target.value)} />
                </label>
                <label className="pole" style={{ width: '100%' }}>
                  Nick
                  <input className="input" value={nowyNick} onChange={(e) => setNowyNick(e.target.value)} />
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="install-btn" onClick={() => zapiszDane(p.id)} disabled={zapisywanie}>
                    {zapisywanie ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </button>
                  <button className="install-btn drugorzedny" onClick={() => setEdytowany(null)}>
                    Anuluj
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="install-btn drugorzedny" onClick={() => zacznijEdycje(p)}>
                  Zmień imię/nick
                </button>
                <button className="install-btn drugorzedny" onClick={() => przelaczBan(p)}>
                  {p.moderacja_status === 'zbanowany' ? 'Odbanuj' : 'Zbanuj'}
                </button>
              </div>
            )}
          </div>
        ))}
        {wyniki.length === 0 && !wczytywanie && <p className="hint">Brak wyników.</p>}
      </div>
    </div>
  )
}

export default function AdminPage({ ladowanie, sesja }) {
  if (ladowanie) return null
  if (!sesja || sesja.user.id !== ADMIN_ID) {
    return <Navigate to="/panel" replace />
  }

  return (
    <div className="tresc">
      <div className="panel-naglowek">
        <h1>Panel administratora</h1>
      </div>
      <SzukajUzytkownika />
      <SkanowanieNickow />
      <PanelAdmina />
    </div>
  )
}
