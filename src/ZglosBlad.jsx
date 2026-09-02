import { useState } from 'react'
import { supabase } from './supabaseClient'
import PodstronaProfilu from './PodstronaProfilu'

const EKRANY = ['Dom', 'Misje', 'Rankingi', 'Znajomi/Czat', 'Profil', 'Coiny', 'Pojedynek Dnia', 'Pytanie Dnia', 'Inne']

export default function ZglosBlad({ sesja, profil }) {
  const [tresc, setTresc] = useState('')
  const [ekran, setEkran] = useState('Inne')
  const [wysylanie, setWysylanie] = useState(false)
  const [sukces, setSukces] = useState(false)
  const [blad, setBlad] = useState(null)

  async function wyslij(e) {
    e.preventDefault()
    if (!tresc.trim()) return
    setWysylanie(true)
    setBlad(null)

    const { error } = await supabase.from('zgloszenia_bledow').insert({
      user_id: sesja.user.id,
      tresc: tresc.trim(),
      ekran,
    })

    setWysylanie(false)
    if (error) {
      setBlad('Nie udało się wysłać — spróbuj ponownie.')
      return
    }
    setTresc('')
    setSukces(true)
  }

  return (
    <PodstronaProfilu
      tytul="Zgłoś błąd"
      profil={profil}
      dzieci={
        <form className="card" onSubmit={wyslij}>
          <p className="hint">
            Coś nie działa albo wygląda dziwnie? Napisz co dokładnie widzisz — im dokładniej, tym szybciej to naprawię.
          </p>

          <label className="pole">
            Gdzie w appce?
            <select className="input" value={ekran} onChange={(e) => setEkran(e.target.value)}>
              {EKRANY.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </label>

          <label className="pole">
            Co się dzieje?
            <textarea
              className="input"
              rows={5}
              required
              maxLength={1000}
              value={tresc}
              onChange={(e) => setTresc(e.target.value)}
              placeholder="Np. po kliknięciu 'Zagłosuj' nic się nie dzieje, ekran zostaje pusty..."
            />
          </label>

          {blad && <p className="blad">{blad}</p>}
          {sukces && <p className="status-pill">Wysłano, dzięki! ✓</p>}

          <button className="install-btn" type="submit" disabled={wysylanie || !tresc.trim()}>
            {wysylanie ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
          </button>
        </form>
      }
    />
  )
}
