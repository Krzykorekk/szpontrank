import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { zawieraNiedozwoloneSlowo, zawieraNiedozwoloneTresciAI } from './moderacja'

const EMOJI = ['😀', '😂', '😍', '🔥', '👍', '🎉', '😢', '😮', '❤️', '👏', '😎', '🤔', '💪', '⭐', '🙌', '👋']

const ZWROTY = [
  'Cześć!',
  'Super robota!',
  'Gratulacje!',
  'Powodzenia!',
  'Trzymaj się!',
  'Dzięki!',
  'Miłego dnia!',
  'Widzimy się na Topce!',
  'Ekstra!',
  'Do zobaczenia!',
]

export default function Czat({ znajomoscId, userId, inny, onWstecz }) {
  const [wiadomosci, setWiadomosci] = useState([])
  const [ladowanie, setLadowanie] = useState(true)
  const [wysylanie, setWysylanie] = useState(false)
  const [zakladka, setZakladka] = useState('tekst')
  const [tekstWiadomosci, setTekstWiadomosci] = useState('')
  const [bladTekstu, setBladTekstu] = useState(null)
  const dolRef = useRef(null)

  async function wczytaj() {
    const { data } = await supabase
      .from('wiadomosci')
      .select('*')
      .eq('znajomosc_id', znajomoscId)
      .order('created_at', { ascending: true })
    setWiadomosci(data || [])
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [znajomoscId])

  useEffect(() => {
    dolRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [wiadomosci])

  async function wyslijTekst(e) {
    e.preventDefault()
    if (wysylanie) return
    setBladTekstu(null)
    const tekst = tekstWiadomosci.trim()
    if (!tekst) return

    if (zawieraNiedozwoloneSlowo(tekst)) {
      setBladTekstu('Ta wiadomość zawiera niedozwolone słowo.')
      return
    }

    if (await zawieraNiedozwoloneTresciAI(supabase, tekst)) {
      setBladTekstu('Ta wiadomość zawiera niedozwolone słowo.')
      return
    }

    setTekstWiadomosci('')
    await wyslij('tekst', tekst)
  }

  async function wyslij(typ, tresc) {
    if (wysylanie) return
    const tymczasowa = {
      id: `tymczasowa-${Date.now()}`,
      znajomosc_id: znajomoscId,
      nadawca_id: userId,
      typ,
      tresc,
      created_at: new Date().toISOString(),
    }
    setWiadomosci((poprzednie) => [...poprzednie, tymczasowa])
    setWysylanie(true)
    const { error } = await supabase.from('wiadomosci').insert({
      znajomosc_id: znajomoscId,
      nadawca_id: userId,
      typ,
      tresc,
    })
    setWysylanie(false)
    if (!error) {
      wczytaj()
    }
  }

  return (
    <div className="czat">
      <div className="czat-naglowek">
        <button className="czat-wstecz" onClick={onWstecz} aria-label="Wróć">‹</button>
        <Awatar id={inny?.avatar || 'blyskawica'} rozmiar={30} />
        <span className="czat-nick">@{inny?.nick}</span>
      </div>

      <div className="czat-wiadomosci">
        {ladowanie && <p className="debug-status">Ładowanie...</p>}
        {!ladowanie && wiadomosci.length === 0 && (
          <p className="hint" style={{ textAlign: 'center', marginTop: 20 }}>
            Brak wiadomości — napisz coś albo wyślij emotkę.
          </p>
        )}
        {wiadomosci.map((w) => (
          <div key={w.id} className={`czat-babelek ${w.nadawca_id === userId ? 'moja' : 'obca'}`}>
            {w.typ === 'emoji' ? <span className="czat-emoji-tresc">{w.tresc}</span> : w.tresc}
          </div>
        ))}
        <div ref={dolRef} />
      </div>

      <div className="czat-picker">
        <div className="czat-picker-zakladki">
          <button
            className={`czat-picker-zakladka ${zakladka === 'tekst' ? 'aktywna' : ''}`}
            onClick={() => setZakladka('tekst')}
          >
            Wiadomość
          </button>
          <button
            className={`czat-picker-zakladka ${zakladka === 'emoji' ? 'aktywna' : ''}`}
            onClick={() => setZakladka('emoji')}
          >
            Emotki
          </button>
          <button
            className={`czat-picker-zakladka ${zakladka === 'zwroty' ? 'aktywna' : ''}`}
            onClick={() => setZakladka('zwroty')}
          >
            Gotowe zwroty
          </button>
        </div>

        {zakladka === 'tekst' && (
          <form className="czat-tekst-formularz" onSubmit={wyslijTekst}>
            <input
              className="input"
              placeholder="Napisz wiadomość..."
              value={tekstWiadomosci}
              onChange={(e) => setTekstWiadomosci(e.target.value)}
              maxLength={500}
              disabled={wysylanie}
            />
            <button className="install-btn" type="submit" style={{ padding: '10px 20px' }} disabled={wysylanie || !tekstWiadomosci.trim()}>
              Wyślij
            </button>
          </form>
        )}
        {bladTekstu && <p className="blad" style={{ margin: '6px 0 0' }}>{bladTekstu}</p>}

        {zakladka === 'emoji' && (
          <div className="czat-emoji-siatka">
            {EMOJI.map((e) => (
              <button key={e} className="czat-emoji-btn" onClick={() => wyslij('emoji', e)} disabled={wysylanie}>
                {e}
              </button>
            ))}
          </div>
        )}
        {zakladka === 'zwroty' && (
          <div className="czat-zwroty-lista">
            {ZWROTY.map((z) => (
              <button key={z} className="czat-zwrot-btn" onClick={() => wyslij('zwrot', z)} disabled={wysylanie}>
                {z}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
