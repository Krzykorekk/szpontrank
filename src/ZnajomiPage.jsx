import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabaseClient'
import Awatar from './Awatar'
import { IkonaOgien } from './Ikony'
import Czat from './Czat'
import OdznakaWlasciciela from './OdznakaWlasciciela'
import { udostepnijZaproszenie } from './zaproszenieObraz'

function KartaZnajomego({ inny, children }) {
  const { t } = useTranslation()
  return (
    <div className="znajomy-karta">
      <Link to={`/panel/uzytkownik/${inny?.nick}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit', flex: 1, minWidth: 0 }}>
        <Awatar id={inny?.avatar || 'blyskawica'} rozmiar={40} />
        <div className="znajomy-info">
          <span className="znajomy-nick">
            @{inny?.nick} <OdznakaWlasciciela userId={inny?.id} />
          </span>
          {typeof inny?.streak_dni === 'number' && (
            <span className="znajomy-streak">
              <IkonaOgien rozmiar={13} /> {inny.streak_dni} {t('friends.day', { count: inny.streak_dni })}
            </span>
          )}
        </div>
      </Link>
      <div className="znajomy-akcje">{children}</div>
    </div>
  )
}

export default function ZnajomiPage({ userId, profil }) {
  const { t } = useTranslation()
  const [wiersze, setWiersze] = useState([])
  const [profileInne, setProfileInne] = useState({})
  const [ladowanie, setLadowanie] = useState(true)
  const [otwartyCzat, setOtwartyCzat] = useState(null)
  const [wysylanieZaproszenia, setWysylanieZaproszenia] = useState(false)
  const [pokazDodaj, setPokazDodaj] = useState(false)
  const [pokazJakToDziala, setPokazJakToDziala] = useState(false)
  const [filtr, setFiltr] = useState('')

  const [nick, setNick] = useState('')
  const [wysylanie, setWysylanie] = useState(false)
  const [komunikat, setKomunikat] = useState(null)

  async function wczytaj() {
    setLadowanie(true)
    const { data } = await supabase
      .from('znajomi')
      .select('*')
      .or(`uzytkownik_a_id.eq.${userId},uzytkownik_b_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    const lista = data || []
    setWiersze(lista)

    const inniIds = lista.map((w) => (w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id))
    if (inniIds.length > 0) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nick, avatar, streak_dni')
        .in('id', inniIds)
      setProfileInne(Object.fromEntries((profile || []).map((p) => [p.id, p])))
    }
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  async function wyslij(e) {
    e.preventDefault()
    if (!nick.trim()) return
    setWysylanie(true)
    setKomunikat(null)
    const { data, error } = await supabase.rpc('wyslij_zaproszenie', { docelowy_nick: nick.trim() })
    setWysylanie(false)

    if (error) {
      setKomunikat({ typ: 'blad', tekst: t('friends.errGeneric') })
      return
    }
    if (data?.blad === 'nie_znaleziono') setKomunikat({ typ: 'blad', tekst: t('friends.errNotFound', { nick: nick.trim() }) })
    else if (data?.blad === 'to_ty') setKomunikat({ typ: 'blad', tekst: t('friends.errYourself') })
    else if (data?.blad === 'juz_istnieje') setKomunikat({ typ: 'blad', tekst: t('friends.errExists') })
    else {
      setKomunikat({ typ: 'ok', tekst: t('friends.sent') })
      setNick('')
      wczytaj()
    }
  }

  async function akceptuj(id) {
    await supabase.from('znajomi').update({ status: 'zaakceptowane' }).eq('id', id)
    wczytaj()
  }

  async function usun(id) {
    await supabase.from('znajomi').delete().eq('id', id)
    wczytaj()
  }

  async function zaprosZnajomych() {
    if (!profil) return
    setWysylanieZaproszenia(true)
    try {
      await udostepnijZaproszenie({ imie: profil.imie, nick: profil.nick, avatar: profil.avatar })
    } catch (e) {}
    setWysylanieZaproszenia(false)
  }

  const zaakceptowani = wiersze
    .filter((w) => w.status === 'zaakceptowane')
    .filter((w) => {
      if (!filtr.trim()) return true
      const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
      return inny?.nick?.toLowerCase().includes(filtr.trim().toLowerCase())
    })
  const przychodzace = wiersze.filter((w) => w.status === 'oczekujace' && w.zaproszil_id !== userId)
  const wyslane = wiersze.filter((w) => w.status === 'oczekujace' && w.zaproszil_id === userId)
  const pusto = wiersze.filter((w) => w.status === 'zaakceptowane').length === 0 && wyslane.length === 0 && przychodzace.length === 0

  if (otwartyCzat) {
    return (
      <Czat
        znajomoscId={otwartyCzat.id}
        userId={userId}
        inny={profileInne[otwartyCzat.uzytkownik_a_id === userId ? otwartyCzat.uzytkownik_b_id : otwartyCzat.uzytkownik_a_id]}
        onWstecz={() => setOtwartyCzat(null)}
      />
    )
  }

  return (
    <div>
      {/* Pasek akcji: dodaj znajomego / zaproś - kompaktowe, nie wielkie karty */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <button className="install-btn" style={{ flex: '1 1 auto' }} onClick={() => setPokazDodaj((v) => !v)}>
          {t('friends.addFriend')}
        </button>
        <button className="install-btn drugorzedny" style={{ flex: '1 1 auto' }} onClick={zaprosZnajomych} disabled={wysylanieZaproszenia}>
          {wysylanieZaproszenia ? t('friends.preparing') : t('friends.inviteOutside')}
        </button>
      </div>

      {pokazDodaj && (
        <form className="card" style={{ marginBottom: 14 }} onSubmit={wyslij}>
          <div className="znajomi-formularz">
            <input
              className="input"
              placeholder={t('friends.nickPlaceholder')}
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              autoFocus
            />
            <button className="install-btn" type="submit" disabled={wysylanie}>
              {wysylanie ? '...' : t('friends.add')}
            </button>
          </div>
          {komunikat && <p className={komunikat.typ === 'blad' ? 'blad' : 'status-pill'}>{komunikat.tekst}</p>}
          <button
            type="button"
            className="hint"
            style={{ background: 'none', border: 'none', padding: 0, marginTop: 8, cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setPokazJakToDziala((v) => !v)}
          >
            {t('friends.howItWorks')}
          </button>
          {pokazJakToDziala && (
            <p className="hint" style={{ marginTop: 6 }}>
              {t('friends.howItWorksText')}
            </p>
          )}
        </form>
      )}

      {ladowanie && <p className="debug-status">{t('friends.loading')}</p>}

      {!ladowanie && przychodzace.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3 className="znajomi-podtytul">{t('friends.invitesToYou', { count: przychodzace.length })}</h3>
          <div className="znajomi-lista">
            {przychodzace.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <KartaZnajomego key={w.id} inny={inny}>
                  <button className="install-btn" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={() => akceptuj(w.id)}>
                    {t('friends.accept')}
                  </button>
                  <button className="install-btn drugorzedny" style={{ padding: '8px 18px', fontSize: '0.82rem' }} onClick={() => usun(w.id)}>
                    {t('friends.reject')}
                  </button>
                </KartaZnajomego>
              )
            })}
          </div>
        </div>
      )}

      {!ladowanie && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <h3 className="znajomi-podtytul" style={{ margin: 0 }}>{t('friends.yourFriends', { count: zaakceptowani.length })}</h3>
            {wiersze.filter((w) => w.status === 'zaakceptowane').length > 4 && (
              <input
                className="input"
                style={{ maxWidth: 200 }}
                placeholder={t('friends.filterPlaceholder')}
                value={filtr}
                onChange={(e) => setFiltr(e.target.value)}
              />
            )}
          </div>
          {pusto && <p className="hint" style={{ marginTop: 10 }}>{t('friends.empty')}</p>}
          {!pusto && zaakceptowani.length === 0 && <p className="hint" style={{ marginTop: 10 }}>{t('friends.noResults', { filtr })}</p>}
          <div className="znajomi-lista" style={{ marginTop: 10 }}>
            {zaakceptowani.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <KartaZnajomego key={w.id} inny={inny}>
                  <button
                    className="install-btn"
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    onClick={() => setOtwartyCzat(w)}
                  >
                    {t('friends.write')}
                  </button>
                  <button className="install-btn drugorzedny" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => usun(w.id)}>
                    {t('friends.remove')}
                  </button>
                </KartaZnajomego>
              )
            })}
          </div>
        </div>
      )}

      {!ladowanie && wyslane.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className="znajomi-podtytul">{t('friends.sentInvites')}</h3>
          <div className="znajomi-lista">
            {wyslane.map((w) => {
              const inny = profileInne[w.uzytkownik_a_id === userId ? w.uzytkownik_b_id : w.uzytkownik_a_id]
              return (
                <KartaZnajomego key={w.id} inny={inny}>
                  <span className="hint znajomy-oczekuje">{t('friends.waiting')}</span>
                </KartaZnajomego>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
