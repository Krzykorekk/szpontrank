import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Capacitor } from '@capacitor/core'
import { IkonaKorona, IkonaOgien, IkonaSzkola, IkonaGlobus, IkonaMoneta, IkonaCzat } from './Ikony'
import PrzelacznikJezyka from './PrzelacznikJezyka'

export default function Landing({ zalogowany, profilGotowy }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const KROKI = [
    { klucz: 'vote' },
    { klucz: 'coins' },
    { klucz: 'ranks' },
  ]

  const FUNKCJE = [
    { Ikona: IkonaMoneta, klucz: 'coins' },
    { Ikona: IkonaKorona, klucz: 'duel' },
    { Ikona: IkonaGlobus, klucz: 'question' },
    { Ikona: IkonaOgien, klucz: 'streaks' },
    { Ikona: IkonaCzat, klucz: 'friends' },
    { Ikona: IkonaSzkola, klucz: 'zeroHate' },
  ]

  useEffect(() => {
    if (Capacitor.isNativePlatform() && !zalogowany) {
      navigate('/rejestracja', { replace: true })
      return
    }
    if (zalogowany && !profilGotowy) {
      navigate('/rejestracja', { replace: true })
    }
  }, [zalogowany, profilGotowy, navigate])

  return (
    <div className="landing-strona">
      <section className="hero-sekcja">
        <div className="hero-jezyk"><PrzelacznikJezyka /></div>
        <div className="hero-polka">
          <div className="ekran-startowy-odznaka ekran-startowy-odznaka--ogien hero-odznaka-ogien">
            <IkonaOgien rozmiar={26} />
          </div>
          <div className="ekran-startowy-odznaka ekran-startowy-odznaka--korona hero-odznaka-korona">
            <IkonaKorona rozmiar={38} />
          </div>
          <div className="ekran-startowy-odznaka ekran-startowy-odznaka--moneta hero-odznaka-moneta">
            <IkonaMoneta rozmiar={26} />
          </div>
        </div>
        <h1 className="hero-tytul">{t('landing.hero.title')}</h1>
        <p className="hero-motto">{t('landing.hero.motto')}</p>
        <p className="hero-opis">{t('landing.hero.description')}</p>
        <div className="hero-cta">
          {zalogowany && profilGotowy ? (
            <Link to="/panel" className="hero-cta-btn">
              {t('landing.hero.ctaLoggedIn')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          ) : (
            <Link to="/rejestracja" className="hero-cta-btn">
              {t('landing.hero.ctaLoggedOut')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          )}
        </div>
        <div className="staty">
          <span><IkonaMoneta rozmiar={15} /> {t('landing.hero.statCoins')}</span>
          <span><IkonaKorona rozmiar={15} /> {t('landing.hero.statZeroHate')}</span>
          <span><IkonaOgien rozmiar={15} /> {t('landing.hero.statFree')}</span>
        </div>
        <Link to="/portfolio" className="hero-portfolio-link">
          {t('landing.hero.portfolioLink')}
        </Link>
      </section>

      <section className="kroki-sekcja">
        <h2 className="sekcja-naglowek">{t('landing.steps.heading')}</h2>
        <div className="kroki">
          {KROKI.map((k, i) => (
            <div className="krok" key={k.klucz}>
              <span className="krok-numer">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{t(`landing.steps.${k.klucz}.title`)}</h3>
                <p>{t(`landing.steps.${k.klucz}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="funkcje-sekcja">
        <h2 className="sekcja-naglowek">{t('landing.features.heading')}</h2>
        <div className="funkcje">
          {FUNKCJE.map((f) => (
            <div className="funkcja-wiersz" key={f.klucz}>
              <span className="funkcja-ikona">
                <f.Ikona rozmiar={20} />
              </span>
              <div>
                <h3>{t(`landing.features.${f.klucz}.title`)}</h3>
                <p>{t(`landing.features.${f.klucz}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
