// Awatary jako własne, wektorowe odznaki (kółko + prosty symbol) zamiast
// emoji zwierzątek — spójny wygląd na każdym urządzeniu. W bazie danych
// zapisujemy tylko krótki identyfikator tekstowy (np. "blyskawica").

const PALETA = {
  blyskawica: ['#f5a623', '#e8492e'],
  gwiazda: ['#f2935c', '#e8492e'],
  ognik: ['#e8492e', '#c92f1a'],
  tarcza: ['#7c8cff', '#4a56c4'],
  diament: ['#5ad0c8', '#2f9d95'],
  pierscien: ['#f5a623', '#c97b0e'],
  szesciokat: ['#b78cff', '#7c4fd6'],
  ksiezyc: ['#8ea3c9', '#54688f'],
  slonce: ['#ffd166', '#f5a623'],
  cel: ['#e8492e', '#a82c17'],
  fala: ['#4fb6e0', '#2c7fa8'],
  kometa: ['#f2935c', '#c94f1a'],
  spirala: ['#c98cff', '#8c4fd6'],
  pik: ['#6b6459', '#3a352d'],
  maska: ['#e05a8a', '#a83060'],
}

export const AWATARY = Object.keys(PALETA)

function Ksztalt({ id }) {
  const s = { stroke: '#17110c', strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (id) {
    case 'blyskawica':
      return <path d="M13 3L6 13h5l-1 8 7-10h-5l1-8z" fill="#17110c" stroke="none" />
    case 'gwiazda':
      return <path d="M12 3l2.4 5.8 6.2.5-4.7 4 1.4 6.1-5.3-3.3-5.3 3.3 1.4-6.1-4.7-4 6.2-.5L12 3z" fill="#17110c" stroke="none" />
    case 'ognik':
      return <path d="M12 3c1 3-2.8 3.6-2.8 7.2a2.8 2.8 0 0 0 5.6 0c.9 1.3.9 2.6.9 2.6A5.4 5.4 0 1 1 6 10.8c0-3.6 2.7-3.6 3.6-7.2 0 1.8.9 2.7 2.4 0z" fill="#17110c" stroke="none" />
    case 'tarcza':
      return <path d="M12 3l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V6l7-3z" {...s} />
    case 'diament':
      return <rect x="7.5" y="7.5" width="9" height="9" transform="rotate(45 12 12)" {...s} />
    case 'pierscien':
      return <circle cx="12" cy="12" r="6" {...s} strokeWidth={2.6} />
    case 'szesciokat':
      return <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3z" {...s} />
    case 'ksiezyc':
      return <path d="M15 3a9 9 0 1 0 6 15 7.2 7.2 0 0 1-6-15z" fill="#17110c" stroke="none" />
    case 'slonce':
      return (
        <>
          <circle cx="12" cy="12" r="4" fill="#17110c" stroke="none" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" {...s} />
        </>
      )
    case 'cel':
      return (
        <>
          <circle cx="12" cy="12" r="7" {...s} />
          <circle cx="12" cy="12" r="3.5" {...s} />
          <circle cx="12" cy="12" r="0.8" fill="#17110c" stroke="none" />
        </>
      )
    case 'fala':
      return <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" {...s} />
    case 'kometa':
      return (
        <>
          <circle cx="16" cy="8" r="3" fill="#17110c" stroke="none" />
          <path d="M14 10L4 20M14 10l-2 6M14 10l6-2" {...s} />
        </>
      )
    case 'spirala':
      return <path d="M12 21a4 4 0 1 1 3-6.7A6 6 0 1 1 12 4a8 8 0 1 1-6 13" {...s} />
    case 'pik':
      return <path d="M12 3c3 3.5 7 6.2 7 10a4 4 0 0 1-6 3.5c.3 1.3 1 2 2 3.5H9c1-1.5 1.7-2.2 2-3.5A4 4 0 0 1 5 13c0-3.8 4-6.5 7-10z" fill="#17110c" stroke="none" />
    case 'maska':
      return (
        <>
          <rect x="4" y="8" width="16" height="8" rx="4" {...s} />
          <circle cx="9" cy="12" r="1.4" fill="#17110c" stroke="none" />
          <circle cx="15" cy="12" r="1.4" fill="#17110c" stroke="none" />
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
