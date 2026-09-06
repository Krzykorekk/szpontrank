import { useEffect } from 'react'

// Bez react-helmet (niepotrzebna zaleznosc) - prosty hook ktory na wejsciu na
// strone podmienia title/description/canonical, a przy wyjsciu przywraca
// domyslne wartosci (te ze statycznego index.html, dla strony glownej).
const DOMYSLNY_TYTUL = 'SzpontRank — appka do głosowań i rankingów dla klasy i znajomych'
const DOMYSLNY_OPIS = 'SzpontRank — darmowa appka do codziennych głosowań i rankingów dla klasy i znajomych. Zero hejtu, sama zabawa.'
const DOMYSLNY_CANONICAL = 'https://szpontrank.eu/'

export function useSeo({ tytul, opis, canonical }) {
  useEffect(() => {
    const poprzedniTytul = document.title
    const metaOpis = document.querySelector('meta[name="description"]')
    const poprzedniOpis = metaOpis?.getAttribute('content')
    const linkCanonical = document.querySelector('link[rel="canonical"]')
    const poprzedniCanonical = linkCanonical?.getAttribute('href')

    if (tytul) document.title = tytul
    if (opis && metaOpis) metaOpis.setAttribute('content', opis)
    if (canonical && linkCanonical) linkCanonical.setAttribute('href', canonical)

    return () => {
      document.title = poprzedniTytul
      if (metaOpis && poprzedniOpis) metaOpis.setAttribute('content', poprzedniOpis)
      if (linkCanonical && poprzedniCanonical) linkCanonical.setAttribute('href', poprzedniCanonical)
    }
  }, [tytul, opis, canonical])
}

export { DOMYSLNY_TYTUL, DOMYSLNY_OPIS, DOMYSLNY_CANONICAL }
