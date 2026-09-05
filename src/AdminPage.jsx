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

export default function AdminPage({ sesja }) {
  if (!sesja || sesja.user.id !== ADMIN_ID) {
    return <Navigate to="/panel" replace />
  }

  return (
    <div className="tresc">
      <div className="panel-naglowek">
        <h1>Panel administratora</h1>
      </div>
      <SkanowanieNickow />
      <PanelAdmina />
    </div>
  )
}
