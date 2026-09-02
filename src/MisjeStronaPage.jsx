import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import SidebarNav from './SidebarNav'
import { IkonaMoneta } from './Ikony'

const DEFINICJE = [
  { klucz: 'glos_prywatna', tytul: 'Zagłosuj w Rankingach', opis: 'Oddaj dziś głos w dowolnym Rankingu Prywatnym.', do: '/panel/topki' },
  { klucz: 'glos_pojedynek', tytul: 'Zagłosuj w Pojedynku Dnia', opis: 'Wybierz zwycięzcę dzisiejszego Pojedynku.', do: '/panel' },
  { klucz: 'skrzynka', tytul: 'Otwórz Skrzynkę Dnia', opis: 'Odbierz dzisiejszą losową nagrodę.', do: '/panel' },
  { klucz: 'wiadomosc_znajomemu', tytul: 'Napisz do znajomego', opis: 'Wyślij dziś wiadomość na czacie.', do: '/panel/znajomi' },
]

export default function MisjeStronaPage({ ladowanie, sesja, profil, onZaktualizowano }) {
  const navigate = useNavigate()
  const [dzis, setDzis] = useState({})
  const [odebrane, setOdebrane] = useState({})
  const [ladowanieMisji, setLadowanieMisji] = useState(true)
  const [odbieranie, setOdbieranie] = useState(null)

  useEffect(() => {
    if (!ladowanie && (!sesja || !profil)) {
      navigate('/rejestracja', { replace: true })
      return
    }
    if (sesja?.user?.id) wczytaj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ladowanie, sesja, profil])

  async function wczytaj() {
    setLadowanieMisji(true)
    const dzisiaj = new Date().toISOString().slice(0, 10)
    const userId = sesja.user.id

    const [{ data: glos }, { data: pojedynek }, { data: odebraneDzis }, { data: wiadomosc }] = await Promise.all([
      supabase.from('glosy').select('id').eq('glosujacy_id', userId).eq('dzien', dzisiaj).limit(1),
      supabase
        .from('pojedynki_glosy')
        .select('id, pojedynki!inner(dzien)')
        .eq('glosujacy_id', userId)
        .eq('pojedynki.dzien', dzisiaj)
        .limit(1),
      supabase.from('misje_odebrane').select('klucz').eq('user_id', userId).eq('dzien', dzisiaj),
      supabase.from('wiadomosci').select('id').eq('nadawca_id', userId).gte('created_at', dzisiaj).limit(1),
    ])

    setDzis({
      glos_prywatna: (glos || []).length > 0,
      glos_pojedynek: (pojedynek || []).length > 0,
      skrzynka: profil?.skrzynka_ostatnio === dzisiaj,
      wiadomosc_znajomemu: (wiadomosc || []).length > 0,
    })
    setOdebrane(Object.fromEntries((odebraneDzis || []).map((m) => [m.klucz, true])))
    setLadowanieMisji(false)
  }

  async function odbierz(klucz) {
    setOdbieranie(klucz)
    const { data, error } = await supabase.rpc('odbierz_misje', { p_klucz: klucz })
    setOdbieranie(null)
    if (!error && data?.ok) {
      setOdebrane((o) => ({ ...o, [klucz]: true }))
      onZaktualizowano?.()
    }
  }

  if (ladowanie || !sesja || !profil) {
    return (
      <div className="tresc">
        <p className="debug-status">Ładowanie...</p>
      </div>
    )
  }

  const ileZrobione = DEFINICJE.filter((d) => odebrane[d.klucz]).length

  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <div className="panel-naglowek">
            <h1>Misje Dnia</h1>
          </div>

          <p className="hint">{ileZrobione} / {DEFINICJE.length} misji ukończonych dzisiaj — wróć jutro po nowe.</p>

          {ladowanieMisji && <p className="debug-status">Sprawdzam postęp...</p>}

          {!ladowanieMisji && (
            <div className="misje-lista">
              {DEFINICJE.map((m) => {
                const spelniona = dzis[m.klucz]
                const juzOdebrana = odebrane[m.klucz]
                return (
                  <div key={m.klucz} className={`misja-karta ${juzOdebrana ? 'ukonczona' : ''}`}>
                    <div className="misja-tekst">
                      <h3>{m.tytul}</h3>
                      <p>{m.opis}</p>
                    </div>
                    {juzOdebrana ? (
                      <span className="misja-status">✓ Odebrano</span>
                    ) : spelniona ? (
                      <button className="install-btn" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={() => odbierz(m.klucz)} disabled={odbieranie === m.klucz}>
                        {odbieranie === m.klucz ? '...' : (<><IkonaMoneta rozmiar={14} /> +25</>)}
                      </button>
                    ) : (
                      <button className="install-btn drugorzedny" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={() => navigate(m.do)}>
                        Zrób to
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
