import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Capacitor } from '@capacitor/core'
import { supabase } from './supabaseClient'
import { ADMIN_ID } from './admin'
import PodstronaProfilu from './PodstronaProfilu'

export default function ProfilKonto({ sesja, profil, wyloguj }) {
  const { t } = useTranslation()
  const [usuwanieKonta, setUsuwanieKonta] = useState(false)
  const [powiadomienia, setPowiadomienia] = useState(profil?.powiadomienia_wlaczone ?? true)
  const [zapisywaniePowiadomien, setZapisywaniePowiadomien] = useState(false)

  if (!sesja) {
    return (
      <div className="tresc">
        <p className="debug-status">Ładowanie...</p>
      </div>
    )
  }

  async function przelaczPowiadomienia() {
    const nowa = !powiadomienia
    setPowiadomienia(nowa)
    setZapisywaniePowiadomien(true)
    await supabase.from('profiles').update({ powiadomienia_wlaczone: nowa }).eq('id', sesja.user.id)
    setZapisywaniePowiadomien(false)
  }

  async function usunKonto() {
    if (!window.confirm(t('account.confirmDelete'))) {
      return
    }
    setUsuwanieKonta(true)
    const { error } = await supabase.rpc('usun_moje_konto')
    if (error) {
      setUsuwanieKonta(false)
      window.alert(t('account.deleteFailed'))
      return
    }
    await wyloguj()
  }

  return (
    <PodstronaProfilu
      tytul={t('account.title')}
      profil={profil}
      dzieci={
        <>
          <div className="card">
            <h2>{t('account.title')}</h2>
            <p className="hint">{t('account.loggedInAs')} <strong>{sesja.user.email}</strong></p>
            <button className="install-btn wyloguj" onClick={wyloguj}>{t('account.logout')}</button>
          </div>

          {Capacitor.isNativePlatform() ? (
            <div className="card" style={{ marginTop: 18 }}>
              <h2>{t('account.notifications')}</h2>
              <p className="hint">{t('account.notificationsDesc')}</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={powiadomienia} onChange={przelaczPowiadomienia} disabled={zapisywaniePowiadomien} />
                {t('account.enablePush')}
              </label>
            </div>
          ) : (
            <div className="card" style={{ marginTop: 18 }}>
              <h2>{t('account.notifications')}</h2>
              <p className="hint">{t('account.mobileOnly')}</p>
            </div>
          )}

          {sesja.user.id === ADMIN_ID && (
            <Link to="/admin" className="install-btn" style={{ display: 'inline-block', marginTop: 18, textDecoration: 'none' }}>
              {t('account.adminPanel')}
            </Link>
          )}

          <div className="card karta-niebezpieczna" style={{ marginTop: 18 }}>
            <h2>{t('account.dangerZone')}</h2>
            <p className="hint">{t('account.deleteWarning')}</p>
            <button className="install-btn drugorzedny" onClick={usunKonto} disabled={usuwanieKonta}>
              {usuwanieKonta ? t('account.deleting') : t('account.deleteBtn')}
            </button>
          </div>
        </>
      }
    />
  )
}
