import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabaseClient'
import PodstronaProfilu from './PodstronaProfilu'

export default function ZglosBlad({ sesja, profil }) {
  const { t } = useTranslation()
  const EKRANY = t('reportBug.screens', { returnObjects: true })
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
      setBlad(t('reportBug.sendFailed'))
      return
    }
    setTresc('')
    setSukces(true)
  }

  return (
    <PodstronaProfilu
      tytul={t('settings.reportTile.title')}
      profil={profil}
      dzieci={
        <form className="card" onSubmit={wyslij}>
          <p className="hint">{t('reportBug.intro')}</p>

          <label className="pole">
            {t('reportBug.whereLabel')}
            <select className="input" value={ekran} onChange={(e) => setEkran(e.target.value)}>
              {EKRANY.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </label>

          <label className="pole">
            {t('reportBug.whatLabel')}
            <textarea
              className="input"
              rows={5}
              required
              maxLength={1000}
              value={tresc}
              onChange={(e) => setTresc(e.target.value)}
              placeholder={t('reportBug.placeholder')}
            />
          </label>

          {blad && <p className="blad">{blad}</p>}
          {sukces && <p className="status-pill">{t('reportBug.sent')}</p>}

          <button className="install-btn" type="submit" disabled={wysylanie || !tresc.trim()}>
            {wysylanie ? t('reportBug.sending') : t('reportBug.send')}
          </button>
        </form>
      }
    />
  )
}
