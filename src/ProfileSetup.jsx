import { useState } from 'react'
import { supabase } from './supabaseClient'
import { zawieraNiedozwoloneSlowo } from './moderacja'
import Awatar, { AWATARY, AWATARY_PUBLICZNE } from './Awatar'
import { ADMIN_ID } from './admin'
import { IkonaGlobus } from './Ikony'

export default function ProfileSetup({ userId, onGotowe }) {
  const [imie, setImie] = useState('')
  const [nick, setNick] = useState('')
  const [avatar, setAvatar] = useState(AWATARY[0])
  const [ogolnaTopka, setOgolnaTopka] = useState(false)
  const [youtube, setYoutube] = useState(false)
  const [instagram, setInstagram] = useState(false)
  const [tiktok, setTiktok] = useState(false)
  const [blad, setBlad] = useState(null)
  const [zapisywanie, setZapisywanie] = useState(false)

  const zapisz = async (e) => {
    e.preventDefault()
    setBlad(null)

    if (zawieraNiedozwoloneSlowo(imie) || zawieraNiedozwoloneSlowo(nick)) {
      setBlad('Imię lub pseudonim zawiera niedozwolone słowo — wybierz inne.')
      return
    }

    setZapisywanie(true)

    const { error } = await supabase.from('profiles').insert({
      id: userId,
      imie: imie.trim(),
      nick: nick.trim(),
      avatar,
      ogolna_topka: ogolnaTopka,
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

    if (ogolnaTopka) {
      await supabase.rpc('ustaw_ogolna_topke', { wlacz: true })
    }

    onGotowe()
  }

  return (
    <form className="card card-wyroznik" onSubmit={zapisz}>
      <h2>Dokończ rejestrację</h2>
      <p>Bez nazwiska — tylko imię i pseudonim, którym będziesz widoczny/a w Rankingach.</p>

      <label className="pole">Wybierz awatar</label>
      <div className="awatar-siatka">
        {(userId === ADMIN_ID ? AWATARY : AWATARY_PUBLICZNE).map((a) => (
          <button
            type="button"
            key={a}
            className={`awatar-opcja ${avatar === a ? 'aktywna' : ''}`}
            onClick={() => setAvatar(a)}
          >
            <Awatar id={a} rozmiar={34} />
          </button>
        ))}
      </div>

      <label className="pole">
        Imię
        <input
          className="input"
          required
          minLength={1}
          maxLength={30}
          value={imie}
          onChange={(e) => setImie(e.target.value)}
          placeholder="np. Krzykor"
        />
      </label>

      <label className="pole">
        Pseudonim
        <input
          className="input"
          required
          minLength={3}
          maxLength={20}
          value={nick}
          onChange={(e) => setNick(e.target.value.replace(/\s/g, ''))}
          placeholder="np. Krzykorekk"
        />
      </label>

      <fieldset className="checkboxy">
        <legend>Masz już konto na którejś z tych platform?</legend>
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

      <div className="ogolna-topka-baner">
        <div className="ogolna-topka-tekst">
          <h3><IkonaGlobus rozmiar={16} style={{ verticalAlign: '-3px', marginRight: '6px' }} />Ogólny Ranking Apki</h3>
          <p>
            Oprócz Twoich Rankingów istnieje jeden wspólny ranking obejmujący wszystkich użytkowników
            SzpontRank. To Twój wybór — możesz to włączyć albo wyłączyć w każdej chwili w Ustawieniach.
          </p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={ogolnaTopka}
            onChange={(e) => setOgolnaTopka(e.target.checked)}
          />
          <span className="toggle-suwak" />
        </label>
      </div>

      {blad && <p className="blad">{blad}</p>}

      <button className="install-btn" type="submit" disabled={zapisywanie}>
        {zapisywanie ? 'Zapisywanie...' : 'Zapisz i wejdź do SzpontRank'}
      </button>
    </form>
  )
}
