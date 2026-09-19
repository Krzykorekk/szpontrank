import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabaseClient'
import Sekcja2FA from './Sekcja2FA'
import PodstronaProfilu from './PodstronaProfilu'

export default function ProfilBezpieczenstwo({ sesja, profil }) {
  const { t } = useTranslation()
  const [noweHaslo, setNoweHaslo] = useState('')
  const [powtorzHaslo, setPowtorzHaslo] = useState('')
  const [bladHasla, setBladHasla] = useState(null)
  const [sukcesHasla, setSukcesHasla] = useState(false)
  const [zmienianieHasla, setZmienianieHasla] = useState(false)
  const maJuzHaslo = sesja?.user?.app_metadata?.provider === 'email'

  async function zmienHaslo(e) {
    e.preventDefault()
    setBladHasla(null)
    setSukcesHasla(false)

    if (noweHaslo.length < 6) {
      setBladHasla(t('security.tooShort'))
      return
    }
    if (noweHaslo !== powtorzHaslo) {
      setBladHasla(t('security.mismatch'))
      return
    }

    setZmienianieHasla(true)
    const { error } = await supabase.auth.updateUser({ password: noweHaslo })
    setZmienianieHasla(false)

    if (error) {
      setBladHasla(t('security.changeFailed', { blad: error.message }))
      return
    }
    setNoweHaslo('')
    setPowtorzHaslo('')
    setSukcesHasla(true)
  }

  return (
    <PodstronaProfilu
      tytul={t('settings.securityTile.title')}
      profil={profil}
      dzieci={
        <>
          <form className="card" onSubmit={zmienHaslo}>
            <h2>{maJuzHaslo ? t('security.changePassword') : t('security.setPassword')}</h2>
            {!maJuzHaslo && (
              <p className="hint">{t('security.googleHint')}</p>
            )}
            <label className="pole">
              {maJuzHaslo ? t('security.newPassword') : t('security.password')}
              <input className="input" type="password" minLength={6} required value={noweHaslo} onChange={(e) => setNoweHaslo(e.target.value)} />
            </label>
            <label className="pole">
              {t('security.repeatPassword')}
              <input className="input" type="password" minLength={6} required value={powtorzHaslo} onChange={(e) => setPowtorzHaslo(e.target.value)} />
            </label>
            {bladHasla && <p className="blad">{bladHasla}</p>}
            {sukcesHasla && <p className="status-pill">{t('security.saved')}</p>}
            <button className="install-btn" type="submit" disabled={zmienianieHasla}>
              {zmienianieHasla ? t('security.saving') : maJuzHaslo ? t('security.changePassword') : t('security.setPassword')}
            </button>
          </form>

          <Sekcja2FA />
        </>
      }
    />
  )
}
