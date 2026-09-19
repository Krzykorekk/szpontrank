import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SidebarNav from './SidebarNav'

export default function PodstronaProfilu({ tytul, profil, dzieci }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="tresc">
      <div className="panel-uklad-v2">
        <SidebarNav profil={profil} />
        <main className="panel-main">
          <div className="panel-naglowek">
            <button className="btn-wstecz-profil" onClick={() => navigate('/panel/ustawienia')}>
              ‹ {t('settings.title')}
            </button>
            <h1>{tytul}</h1>
          </div>
          {dzieci}
        </main>
      </div>
    </div>
  )
}
