import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabaseClient'
import { zawieraNiedozwoloneSlowo, zawieraNiedozwoloneTresciAI } from './moderacja'
import Awatar, { AWATARY, AWATARY_PUBLICZNE } from './Awatar'
import { ADMIN_ID } from './admin'
import PodstronaProfilu from './PodstronaProfilu'

export default function ProfilTozsamosc({ sesja, profil, onZaktualizowano }) {
  const { t } = useTranslation()
  const [imie, setImie] = useState('')
  const [nick, setNick] = useState('')
  const [opis, setOpis] = useState('')
  const [avatar, setAvatar] = useState('blyskawica')
  const [youtube, setYoutube] = useState(false)
  const [youtubeHandle, setYoutubeHandle] = useState('')
  const [instagram, setInstagram] = useState(false)
  const [instagramHandle, setInstagramHandle] = useState('')
  const [tiktok, setTiktok] = useState(false)
  const [tiktokHandle, setTiktokHandle] = useState('')
  const [blad, setBlad] = useState(null)
  const [sukces, setSukces] = useState(false)
  const [zapisywanie, setZapisywanie] = useState(false)

  useEffect(() => {
    if (profil) {
      setImie(profil.imie)
      setNick(profil.nick)
      setOpis(profil.opis || '')
      setAvatar(profil.avatar || 'blyskawica')
      setYoutube(!!profil.polaczone_konta?.youtube)
      setYoutubeHandle(profil.polaczone_konta?.youtube_handle || '')
      setInstagram(!!profil.polaczone_konta?.instagram)
      setInstagramHandle(profil.polaczone_konta?.instagram_handle || '')
      setTiktok(!!profil.polaczone_konta?.tiktok)
      setTiktokHandle(profil.polaczone_konta?.tiktok_handle || '')
    }
  }, [profil])

  const zapisz = async (e) => {
    e.preventDefault()
    setBlad(null)
    setSukces(false)

    if (zawieraNiedozwoloneSlowo(imie) || zawieraNiedozwoloneSlowo(nick) || zawieraNiedozwoloneSlowo(opis)) {
      setBlad(t('identity.forbiddenWord'))
      return
    }

    setZapisywanie(true)

    const [imieAI, nickAI, opisAI] = await Promise.all([
      zawieraNiedozwoloneTresciAI(supabase, imie),
      zawieraNiedozwoloneTresciAI(supabase, nick),
      opis.trim() ? zawieraNiedozwoloneTresciAI(supabase, opis) : Promise.resolve(false),
    ])
    if (imieAI || nickAI || opisAI) {
      setZapisywanie(false)
      setBlad(t('identity.forbiddenWord'))
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        imie: imie.trim(),
        nick: nick.trim(),
        opis: opis.trim() || null,
        avatar,
        polaczone_konta: {
          youtube,
          youtube_handle: youtubeHandle.trim(),
          instagram,
          instagram_handle: instagramHandle.trim(),
          tiktok,
          tiktok_handle: tiktokHandle.trim(),
        },
        moderacja_status: null,
        moderacja_powod: null,
      })
      .eq('id', sesja.user.id)
    setZapisywanie(false)

    if (error) {
      setBlad(error.code === '23505' ? t('identity.nickTaken') : t('identity.saveFailed', { blad: error.message }))
      return
    }
    await onZaktualizowano()
    setSukces(true)
  }

  if (!sesja) {
    return (
      <div className="tresc">
        <p className="debug-status">Ładowanie...</p>
      </div>
    )
  }

  return (
    <PodstronaProfilu
      tytul={t('settings.profileTile.title')}
      profil={profil}
      dzieci={
        <form className="card card-wyroznik" onSubmit={zapisz}>
          <p className="hint">{t('identity.intro')}</p>

          <label className="pole">{t('identity.avatar')}</label>
          <div className="awatar-siatka">
            {(sesja.user.id === ADMIN_ID ? AWATARY : AWATARY_PUBLICZNE).map((a) => (
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
            {t('identity.name')}
            <input className="input" required minLength={1} maxLength={30} value={imie} onChange={(e) => setImie(e.target.value)} />
          </label>

          <label className="pole">
            {t('identity.nickname')}
            <input className="input" required minLength={3} maxLength={20} value={nick} onChange={(e) => setNick(e.target.value.replace(/\s/g, ''))} />
          </label>

          <label className="pole">
            {t('identity.bio')}
            <textarea
              className="input"
              rows={3}
              maxLength={160}
              placeholder={t('identity.bioPlaceholder')}
              value={opis}
              onChange={(e) => setOpis(e.target.value)}
            />
            <span className="hint">{opis.length}/160</span>
          </label>

          <fieldset className="checkboxy">
            <legend>{t('identity.platformsLegend')}</legend>
            <label><input type="checkbox" checked={youtube} onChange={(e) => setYoutube(e.target.checked)} /> YouTube</label>
            {youtube && (
              <input
                className="input"
                style={{ marginTop: 6, marginBottom: 10 }}
                placeholder={t('identity.channelPlaceholder')}
                value={youtubeHandle}
                onChange={(e) => setYoutubeHandle(e.target.value)}
              />
            )}
            <label><input type="checkbox" checked={instagram} onChange={(e) => setInstagram(e.target.checked)} /> Instagram</label>
            {instagram && (
              <input
                className="input"
                style={{ marginTop: 6, marginBottom: 10 }}
                placeholder={t('identity.handlePlaceholder')}
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
              />
            )}
            <label><input type="checkbox" checked={tiktok} onChange={(e) => setTiktok(e.target.checked)} /> TikTok</label>
            {tiktok && (
              <input
                className="input"
                style={{ marginTop: 6, marginBottom: 10 }}
                placeholder={t('identity.handlePlaceholder')}
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
              />
            )}
          </fieldset>

          {blad && <p className="blad">{blad}</p>}
          {sukces && <p className="status-pill">{t('identity.saved')}</p>}

          <button className="install-btn" type="submit" disabled={zapisywanie}>
            {zapisywanie ? t('identity.saving') : t('identity.save')}
          </button>
        </form>
      }
    />
  )
}
