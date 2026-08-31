import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import SidebarNav from './SidebarNav'
import { IkonaOgien, IkonaMoneta } from './Ikony'
import { udostepnijWynik } from './kartaWyniku'

function LicznikCoinow({ wartosc }) {
  const [wyswietlana, setWyswietlana] = useState(wartosc)

  useEffect(() => {
    if (wartosc === wyswietlana) return
    const start = wyswietlana
    const roznica = wartosc - start
    const czasTrwania = 700
    const startCzas = performance.now()

    function krok(teraz) {
      const postep = Math.min((teraz - startCzas) / czasTrwania, 1)
      const wygladzone = 1 - Math.pow(1 - postep, 3)
      setWyswietlana(Math.round(start + roznica * wygladzone))
      if (postep < 1) requestAnimationFrame(krok)
    }
    requestAnimationFrame(krok)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wartosc])

  return <span className="coiny-liczba-duza">{wyswietlana.toLocaleString('pl-PL')}</span>
}

export default function CoinyStronaPage({ sesja, profil, onZaktualizowano }) {
  const [historia, setHistoria] = useState([])
  const [ladowanie, setLadowanie] = useState(true)
  const [kupowanie, setKupowanie] = useState(false)
  const [komunikat, setKomunikat] = useState(null)
  const [udostepniam, setUdostepniam] = useState(false)

  async function obsluzUdostepnianie() {
    setUdostepniam(true)
    try {
      await udostepnijWynik({
        imie: profil.imie,
        nick: profil.nick,
        streakDni: profil.streak_dni,
        coiny: profil.coiny,
        avatar: profil.avatar,
      })
    } catch (e) {
      // uzytkownik anulowal albo blad - nie pokazujemy nic drastycznego
    }
    setUdostepniam(false)
  }

  useEffect(() => {
    supabase
      .from('coiny_historia')
      .select('*')
      .eq('user_id', sesja.user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setHistoria(data || [])
        setLadowanie(false)
      })
  }, [sesja.user.id])

  async function kupZamrozenie() {
    setKupowanie(true)
    setKomunikat(null)
    const { data, error } = await supabase.rpc('kup_zamrozenie_streaka')
    setKupowanie(false)
    if (error || data?.blad) {
      setKomunikat({ typ: 'blad', tekst: 'Za mało Coinów — potrzebujesz 100.' })
      return
    }
    setKomunikat({ typ: 'ok', tekst: 'Kupiono Zamrożenie Streaka! ✓' })
    onZaktualizowano?.()
    const { data: nowaHistoria } = await supabase
      .from('coiny_historia')
      .select('*')
      .eq('user_id', sesja.user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setHistoria(nowaHistoria || [])
  }

  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <div className="coiny-hero">
            <div className="coiny-moneta"><IkonaMoneta rozmiar={48} /></div>
            <LicznikCoinow wartosc={profil.coiny || 0} />
            <p className="coiny-etykieta">Twoje Coiny</p>
            <button className="install-btn coiny-udostepnij-btn" onClick={obsluzUdostepnianie} disabled={udostepniam}>
              {udostepniam ? 'Przygotowuję...' : 'Udostępnij wynik'}
            </button>
          </div>

          <div className="card coiny-sklep-karta">
            <div className="coiny-sklep-info">
              <h2>Zamrożenie Streaka</h2>
              <p className="hint">
                Zapomnisz zagłosować jeden dzień? Zamrożenie automatycznie ochroni Twój streak.
                Masz teraz: <strong>{profil.zamrozenia_streaka || 0}</strong>
              </p>
            </div>
            <button className="install-btn coiny-kup-btn" onClick={kupZamrozenie} disabled={kupowanie}>
              {kupowanie ? '...' : (
                <>
                  <IkonaOgien rozmiar={16} /> 100
                </>
              )}
            </button>
          </div>

          {komunikat && (
            <p className={komunikat.typ === 'blad' ? 'blad' : 'status-pill'} style={{ marginTop: 12 }}>
              {komunikat.tekst}
            </p>
          )}

          <h3 className="znajomi-podtytul" style={{ marginTop: 28 }}>Historia</h3>
          {ladowanie && <p className="debug-status">Ładowanie...</p>}
          <div className="coiny-historia-lista">
            {historia.map((h, i) => (
              <div className="coiny-historia-wiersz" key={h.id} style={{ animationDelay: `${i * 0.03}s` }}>
                <span className="coiny-historia-powod">{h.powod}</span>
                <span className={`coiny-historia-ilosc ${h.ilosc >= 0 ? 'plus' : 'minus'}`}>
                  {h.ilosc >= 0 ? '+' : ''}{h.ilosc}
                </span>
              </div>
            ))}
            {!ladowanie && historia.length === 0 && (
              <p className="hint">Zagłosuj dziś, żeby zdobyć pierwsze Coiny.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
