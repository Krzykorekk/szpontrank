import { useTranslation } from 'react-i18next'
import PodstronaProfilu from './PodstronaProfilu'
import PrzelacznikJezyka from './PrzelacznikJezyka'

export default function ProfilJezyk({ profil }) {
  const { t } = useTranslation()

  return (
    <PodstronaProfilu
      tytul={t('settings.languageTile.title')}
      profil={profil}
      dzieci={
        <div className="card">
          <p className="hint" style={{ marginBottom: 16 }}>
            {t('settings.languageTile.desc')}
          </p>
          <div className="jezyk-wybor-duzy">
            <PrzelacznikJezyka />
          </div>
        </div>
      }
    />
  )
}
