export const RANGI = [
  { klucz: 'brąz', nazwa: 'Brąz', prog: 0, kolor1: '#a9714a', kolor2: '#6e4a2e' },
  { klucz: 'srebro', nazwa: 'Srebro', prog: 200, kolor1: '#d8dde3', kolor2: '#9aa3ac' },
  { klucz: 'złoto', nazwa: 'Złoto', prog: 600, kolor1: '#ffd54f', kolor2: '#e0a423' },
  { klucz: 'diament', nazwa: 'Diament', prog: 1500, kolor1: '#8fe3ff', kolor2: '#3fa8cc' },
  { klucz: 'legenda', nazwa: 'Legenda', prog: 3500, kolor1: '#ff8fd6', kolor2: '#c93a9e' },
]

export function obliczRange(coinyLacznie) {
  const wartosc = coinyLacznie || 0
  let biezaca = RANGI[0]
  let nastepna = RANGI[1]
  for (let i = 0; i < RANGI.length; i++) {
    if (wartosc >= RANGI[i].prog) {
      biezaca = RANGI[i]
      nastepna = RANGI[i + 1] || null
    }
  }
  const postep = nastepna
    ? Math.min(100, Math.round(((wartosc - biezaca.prog) / (nastepna.prog - biezaca.prog)) * 100))
    : 100
  return { biezaca, nastepna, postep, wartosc }
}

export function OdznakaRangi({ klucz, kolor1, kolor2, rozmiar = 48 }) {
  const r = RANGI.find((x) => x.klucz === klucz) || RANGI[0]
  const k1 = kolor1 || r.kolor1
  const k2 = kolor2 || r.kolor2
  const idGradientu = 'ranga-grad-' + klucz
  return (
    <svg width={rozmiar} height={rozmiar} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id={idGradientu} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={k1} />
          <stop offset="100%" stopColor={k2} />
        </linearGradient>
      </defs>
      <path
        d="M20 2l14 6v10c0 9-6 15-14 20C12 33 6 27 6 18V8l14-6z"
        fill={`url(#${idGradientu})`}
        stroke="#1f1a2e"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 20l4 4 8-9" stroke="#1f1a2e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
