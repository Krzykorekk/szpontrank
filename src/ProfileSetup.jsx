import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function ProfileSetup({ userId, onGotowe }) {
  const [imie, setImie] = useState('')
  const [nick, setNick] = useState('')
  const [youtube, setYoutube] = useState(false)
  const [instagram, setInstagram] = useState(false)
  const [tiktok, setTiktok] = useState(false)
  const [blad, setBlad] = useState(null)
  const [zapisywanie, setZapisywanie] = useState(false)

  const zapisz = async (e) => {
    e.preventDefault()
    setBlad(null)
    setZapisywanie(true)

    const { error } = await supabase.from('profiles').insert({
      id: userId,
      imie: imie.trim(),
      nick: nick.trim(),
      polaczone_konta: { youtube, instagram, tiktok },
    })

    setZapisywanie(false)

    if (error) {
      if (error.code === '23505') {
        setBlad('Ten pseudonim jest już zajęty — wybierz inny.')
      } else {
        setBlad(`Nie udało się zapisać profilu (${error.code || '?'}: ${error.message})`)
      }
      return
    }

    onGotowe()
  }

  return (
    <form className="card" onSubmit={zapisz}>
      <h2>Dokończ rejestrację</h2>
      <p>Bez nazwiska — tylko imię i pseudonim, którym będziesz widoczny/a w Topkach.</p>

      <label className="pole">
        Imię
        <input
          className="input"
          required
          value={imie}
          onChange={(e) => setImie(e.target.value)}
          placeholder="np. Kamil"
        />
      </label>

      <label className="pole">
        Pseudonim
        <input
          className="input"
          required
          value={nick}
          onChange={(e) => setNick(e.target.value.replace(/\s/g, ''))}
          placeholder="np. kamilo_00"
        />
      </label>

      <fieldset className="checkboxy">
        <legend>Masz już własny kanał/konto twórcy?</legend>
        <label>
          <input type="checkbox" checked={youtube} onChange={(e) => setYoutube(e.target.checked)} />
          YouTube
        </label>
        <label>
          <input
            type="checkbox"
            checked={instagram}
            onChange={(e) => setInstagram(e.target.checked)}
          />
          Instagram
        </label>
        <label>
          <input type="checkbox" checked={tiktok} onChange={(e) => setTiktok(e.target.checked)} />
          TikTok
        </label>
        <p className="hint">
          Zaznaczone platformy nie będą Ci proponowane w pytaniach typu "kto powinien mieć kanał".
        </p>
      </fieldset>

      {blad && <p className="blad">{blad}</p>}

      <button className="install-btn" type="submit" disabled={zapisywanie}>
        {zapisywanie ? 'Zapisywanie...' : 'Zapisz i wejdź do SzpontRank'}
      </button>
    </form>
  )
}
