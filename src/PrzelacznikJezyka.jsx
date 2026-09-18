import { useTranslation } from 'react-i18next'

const JEZYKI = [
  { kod: 'pl', etykieta: 'PL' },
  { kod: 'en', etykieta: 'EN' },
]

export default function PrzelacznikJezyka() {
  const { i18n } = useTranslation()
  const aktualny = i18n.language?.startsWith('pl') ? 'pl' : 'en'

  return (
    <div className="przelacznik-jezyka">
      {JEZYKI.map((j) => (
        <button
          key={j.kod}
          type="button"
          className={`przelacznik-jezyka-btn ${aktualny === j.kod ? 'aktywny' : ''}`}
          onClick={() => i18n.changeLanguage(j.kod)}
        >
          {j.etykieta}
        </button>
      ))}
    </div>
  )
}
