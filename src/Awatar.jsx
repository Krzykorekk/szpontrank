// Awatary jako własne, wektorowe odznaki (kółko + prosty symbol) zamiast
// emoji zwierzątek — spójny wygląd na każdym urządzeniu. W bazie danych
// zapisujemy tylko krótki identyfikator tekstowy (np. "blyskawica").

const PALETA = {
  blyskawica: ['#f5a623', '#e8492e'],
  gwiazda: ['#f2935c', '#e8492e'],
  slonce: ['#ffd166', '#f5a623'],
  robot: ['#9fb0c9', '#5c6f8f'],
  pies: ['#f2935c', '#c9581f'],
  duszek: ['#c9d6e0', '#8ea3b8'],
  kot: ['#e0955a', '#a85e2c'],
  kosmita: ['#5ad0c8', '#2f9d95'],
  sowa: ['#7c8cff', '#4a56c4'],
  panda: ['#8ea3c9', '#54688f'],
  krolik: ['#e05a8a', '#a83060'],
  krysztal: ['#4fb6e0', '#2c7fa8'],
  kompas: ['#e8492e', '#a82c17'],
  klucz: ['#6b6459', '#3a352d'],
  zwoj: ['#b78cff', '#7c4fd6'],
}

export const AWATARY = Object.keys(PALETA)

function Ksztalt({ id }) {
  const s = { stroke: '#17110c', strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (id) {
    case 'blyskawica':
      return <path d="M13 3L6 13h5l-1 8 7-10h-5l1-8z" fill="#17110c" stroke="none" />
    case 'gwiazda':
      return <path d="M12 3l2.4 5.8 6.2.5-4.7 4 1.4 6.1-5.3-3.3-5.3 3.3 1.4-6.1-4.7-4 6.2-.5L12 3z" fill="#17110c" stroke="none" />
    case 'slonce':
      return (
        <>
          <circle cx="12" cy="12" r="4" fill="#17110c" stroke="none" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" {...s} />
        </>
      )
    case 'robot':
      return (
        <>
          <rect x="6" y="8" width="12" height="10" rx="3" {...s} />
          <line x1="12" y1="8" x2="12" y2="4" {...s} />
          <circle cx="12" cy="3.2" r="1.2" fill="#17110c" stroke="none" />
          <circle cx="9.5" cy="13" r="1.3" fill="#17110c" stroke="none" />
          <circle cx="14.5" cy="13" r="1.3" fill="#17110c" stroke="none" />
        </>
      )
    case 'pies':
      return (
        <>
          <path d="M5 8l3-4 2 3M19 8l-3-4-2 3" {...s} />
          <path d="M6 9c1-3 3-4 6-4s5 1 6 4c1 4-1 8-3 10l-3 2-3-2c-2-2-4-6-3-10z" {...s} />
          <circle cx="9.5" cy="10" r="1" fill="#17110c" stroke="none" />
          <circle cx="14.5" cy="10" r="1" fill="#17110c" stroke="none" />
        </>
      )
    case 'duszek':
      return (
        <>
          <path d="M6 19V11a6 6 0 0 1 12 0v8l-2-2-2 2-2-2-2 2-2-2-2 2z" {...s} />
          <circle cx="9.5" cy="11" r="1.1" fill="#17110c" stroke="none" />
          <circle cx="14.5" cy="11" r="1.1" fill="#17110c" stroke="none" />
        </>
      )
    case 'kot':
      return (
        <>
          <path d="M6 10l1.5-4 3 3M18 10l-1.5-4-3 3" {...s} />
          <circle cx="12" cy="13" r="7" {...s} />
          <circle cx="9.3" cy="12.5" r="1" fill="#17110c" stroke="none" />
          <circle cx="14.7" cy="12.5" r="1" fill="#17110c" stroke="none" />
        </>
      )
    case 'kosmita':
      return (
        <>
          <path d="M12 3a7 6.5 0 0 1 7 6.5c0 5-3 9-7 11-4-2-7-6-7-11A7 6.5 0 0 1 12 3z" {...s} />
          <ellipse cx="9.5" cy="10.5" rx="1.4" ry="2" fill="#17110c" stroke="none" />
          <ellipse cx="14.5" cy="10.5" rx="1.4" ry="2" fill="#17110c" stroke="none" />
        </>
      )
    case 'sowa':
      return (
        <>
          <circle cx="12" cy="12" r="7.5" {...s} />
          <circle cx="9" cy="11" r="2" {...s} strokeWidth={1.5} />
          <circle cx="15" cy="11" r="2" {...s} strokeWidth={1.5} />
          <circle cx="9" cy="11" r="0.6" fill="#17110c" stroke="none" />
          <circle cx="15" cy="11" r="0.6" fill="#17110c" stroke="none" />
          <path d="M12 15l-1.5 2h3L12 15z" fill="#17110c" stroke="none" />
          <path d="M6 6l2 3M18 6l-2 3" stroke="#17110c" strokeWidth={1.5} strokeLinecap="round" />
        </>
      )
    case 'panda':
      return (
        <>
          <circle cx="6" cy="4" r="3.6" fill="#17110c" stroke="none" />
          <circle cx="18" cy="4" r="3.6" fill="#17110c" stroke="none" />
          <circle cx="12" cy="13" r="8" {...s} />
          <ellipse cx="8.5" cy="11.5" rx="2.2" ry="2.8" fill="#17110c" stroke="none" />
          <ellipse cx="15.5" cy="11.5" rx="2.2" ry="2.8" fill="#17110c" stroke="none" />
          <circle cx="8.5" cy="11.8" r="0.7" fill="#f4f1ea" stroke="none" />
          <circle cx="15.5" cy="11.8" r="0.7" fill="#f4f1ea" stroke="none" />
          <ellipse cx="12" cy="16" rx="1.6" ry="1" fill="#17110c" stroke="none" />
        </>
      )
    case 'krolik':
      return (
        <>
          <ellipse cx="7.5" cy="3" rx="2.2" ry="7" {...s} />
          <ellipse cx="16.5" cy="3" rx="2.2" ry="7" {...s} />
          <circle cx="12" cy="14" r="7.5" {...s} />
          <circle cx="9.3" cy="13" r="1" fill="#17110c" stroke="none" />
          <circle cx="14.7" cy="13" r="1" fill="#17110c" stroke="none" />
          <path d="M12 15.5l-1 1.5h2l-1-1.5z" fill="#17110c" stroke="none" />
        </>
      )
    case 'krysztal':
      return (
        <>
          <path d="M12 3l6 6-6 12-6-12z" {...s} strokeLinejoin="round" />
          <path d="M6 9h12M12 3v18" stroke="#17110c" strokeWidth={1.2} />
        </>
      )
    case 'kompas':
      return (
        <>
          <circle cx="12" cy="12" r="8" {...s} />
          <path d="M15 8l-4.5 2.5-1.5 5.5 4.5-2.5 1.5-5.5z" fill="#17110c" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="#f4f1ea" stroke="none" />
        </>
      )
    case 'klucz':
      return (
        <>
          <circle cx="8" cy="16" r="3.2" {...s} />
          <path d="M10.2 13.8L19 5" stroke="#17110c" strokeWidth={1.7} strokeLinecap="round" />
          <path d="M15.5 8.5l2 2M17.5 6.5l2 2" stroke="#17110c" strokeWidth={1.5} strokeLinecap="round" />
        </>
      )
    case 'zwoj':
      return (
        <>
          <rect x="5" y="4" width="14" height="17" rx="2" {...s} />
          <path d="M8 9h8M8 13h8M8 17h5" stroke="#17110c" strokeWidth={1.4} strokeLinecap="round" />
        </>
      )
    default:
      return <circle cx="12" cy="12" r="4" fill="#17110c" stroke="none" />
  }
}

export default function Awatar({ id, rozmiar = 40 }) {
  const kolory = PALETA[id] || PALETA.blyskawica
  return (
    <svg width={rozmiar} height={rozmiar} viewBox="0 0 40 40">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={kolory[0]} />
          <stop offset="100%" stopColor={kolory[1]} />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#grad-${id})`} />
      <g transform="translate(8,8) scale(1)">
        <Ksztalt id={id} />
      </g>
    </svg>
  )
}
