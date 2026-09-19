import { useTranslation } from 'react-i18next'
import { IkonaOgien, IkonaMoneta, IkonaKorona, IkonaFlaga } from './Ikony'
import PodstronaProfilu from './PodstronaProfilu'

function nastepnyKamienMilowy(dni) {
  if (dni < 7) return { cel: 7, nagroda: 50, poprzedni: 0 }
  if (dni < 30) return { cel: 30, nagroda: 200, poprzedni: 7 }
  const kolejny = Math.ceil((dni + 1) / 30) * 30
  return { cel: kolejny, nagroda: 200, poprzedni: kolejny - 30 }
}

export default function ProfilStreak({ profil }) {
  const { t } = useTranslation()
  const dni = profil.streak_dni || 0
  const zamrozenia = profil.zamrozenia_streaka || 0
  const kamien = nastepnyKamienMilowy(dni)
  const doCelu = Math.max(0, kamien.cel - dni)
  const postep = Math.min(100, Math.round(((dni - kamien.poprzedni) / (kamien.cel - kamien.poprzedni)) * 100))

  return (
    <PodstronaProfilu
      tytul={t('settings.streakTile.title')}
      profil={profil}
      dzieci={
        <>
          <div className="ranga-hero">
            <IkonaOgien rozmiar={54} style={{ color: 'var(--czerwien)' }} />
            <div className="ranga-hero-tekst" style={{ flex: 1 }}>
              <h2>{dni} {t('streak.day', { count: dni })}</h2>
              <p>
                {t('streak.toGoal', { count: doCelu })} <strong>{t('streak.coinsReward', { count: kamien.nagroda })}</strong>
              </p>
              <div className="ranga-pasek-tlo">
                <div className="ranga-pasek-wypelnienie" style={{ width: `${postep}%` }} />
              </div>
            </div>
          </div>

          <div className="streak-fakty">
            <div className="streak-fakt">
              <IkonaKorona rozmiar={20} />
              <span>{t('streak.fact1')}</span>
            </div>
            <div className="streak-fakt">
              <IkonaMoneta rozmiar={20} />
              <span>
                {t('streak.fact2', { count: zamrozenia })}
              </span>
            </div>
            <div className="streak-fakt">
              <IkonaFlaga rozmiar={20} />
              <span>{t('streak.fact3')}</span>
            </div>
          </div>
        </>
      }
    />
  )
}
