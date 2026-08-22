// Własny, spójny zestaw ikon (SVG) — zamiast emoji, które renderują się
// różnie na różnych systemach. Proste linie, jeden styl, kolor dziedziczony
// z CSS (currentColor), więc pasują wszędzie bez dodatkowych plików graficznych.

const baza = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IkonaDom({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 22} height={rozmiar || 22} {...props}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  )
}

export function IkonaUstawienia({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 22} height={rozmiar || 22} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
    </svg>
  )
}

export function IkonaWyjdz({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 22} height={rozmiar || 22} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export function IkonaSzkola({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 20} height={rozmiar || 20} {...props}>
      <path d="M12 3l10 5-10 5L2 8l10-5z" />
      <path d="M6 10.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />
      <path d="M22 8v7" />
    </svg>
  )
}

export function IkonaGrupa({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 20} height={rozmiar || 20} {...props}>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M2 20c0-3.5 2.9-6 6.5-6S15 16.5 15 20" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 13.2c2.6.3 4.5 2.3 4.5 5.3" />
    </svg>
  )
}

export function IkonaOgien({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 18} height={rozmiar || 18} {...props}>
      <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1.5 1 3 1 3a6 6 0 1 1-11-3c0-4 3-4 4-8 0 2 1 3 3 0z" />
    </svg>
  )
}

export function IkonaGlobus({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 20} height={rozmiar || 20} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

export function IkonaOsoba({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 18} height={rozmiar || 18} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

export function IkonaKorona({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 18} height={rozmiar || 18} fill="currentColor" stroke="none" {...props}>
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" />
    </svg>
  )
}

export function IkonaTelefon({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 18} height={rozmiar || 18} {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  )
}

export function IkonaPlus({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 26} height={rozmiar || 26} strokeWidth={2.4} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IkonaPobierz({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 20} height={rozmiar || 20} {...props}>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  )
}

export function IkonaQuersy({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 22} height={rozmiar || 22} {...props}>
      <path d="M4 5h16v10H9l-4 4v-4H4V5z" />
      <path d="M9.5 9.5l2 2 2-2M9.5 12.5l2-2 2 2" strokeWidth={1.6} />
    </svg>
  )
}

export function IkonaFlaga({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 18} height={rozmiar || 18} {...props}>
      <path d="M5 3v18" />
      <path d="M5 4h13l-3 4 3 4H5" />
    </svg>
  )
}

export function IkonaPomoc({ rozmiar, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 18} height={rozmiar || 18} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 1.9-2.3 3.5" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IkonaSerce({ rozmiar, wypelnione, ...props }) {
  return (
    <svg {...baza} width={rozmiar || 15} height={rozmiar || 15} fill={wypelnione ? 'currentColor' : 'none'} {...props}>
      <path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.8 4c2-.3 3.7.6 4.9 2.2C11.9 4.6 13.6 3.7 15.6 4c3.5.5 5.3 3.8 3.8 7.2-2.5 4.7-10 9.3-10 9.3z" />
    </svg>
  )
}
