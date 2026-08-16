// Prosty filtr nazw — blokuje wulgaryzmy (PL/EN) i popularne obraźliwe slova
// oraz próby podszywania się pod administrację appki.
// Sprawdzanie odbywa się po znormalizowaniu tekstu (małe litery, bez polskich
// znaków diakrytycznych), żeby złapać też proste próby obejścia filtra.

const SLOWA_ZAKAZANE = [
  // polskie wulgaryzmy i obelgi (rdzenie słów)
  'kurw', 'chuj', 'chuw', 'huj', 'pierdol', 'pierdal', 'jeban', 'jebal', 'jebac',
  'spierdal', 'skurwi', 'skurwy', 'cwel', 'cwelu', 'pizd', 'zajeb', 'wyjeb',
  'dziwka', 'debil', 'idiota', 'kretyn', 'matole',
  // angielskie wulgaryzmy i obelgi (rdzenie słów)
  'fuck', 'shit', 'bitch', 'cunt', 'asshole', 'nigger', 'nigga', 'faggot',
  'whore', 'retard', 'dick', 'pussy',
  // podszywanie się pod appkę/administrację
  'admin', 'administrator', 'moderator', 'moderacja', 'support', 'szpontrank_official',
]

function normalizuj(tekst) {
  return tekst
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // usuwa polskie ogonki/kreski, np. ż -> z
}

export function zawieraNiedozwoloneSlowo(tekst) {
  if (!tekst) return false
  const znormalizowany = normalizuj(tekst)
  return SLOWA_ZAKAZANE.some((slowo) => znormalizowany.includes(slowo))
}

// Prosta heurystyka: łapie popularne angielskie słowa funkcyjne, których nie da
// się pomylić z polskimi (very, best, who, than, the...). Nie jest to pełny
// wykrywacz języka — jak każdy darmowy filtr słów-kluczy da się obejść — ale
// odcina większość prób pisania Questów po angielsku zamiast po polsku.
const ANGIELSKIE_SLOWA_FUNKCYJNE = [
  'the', 'who', 'than', 'best', 'better', 'worse', 'worst', 'is', 'are',
  'you', 'your', 'which', 'what', 'and', 'or', 'more', 'most', 'good',
  'bad', 'like', 'love', 'hate', 'with', 'this', 'that', 'have', 'has',
]

export function zawieraObcyJezyk(tekst) {
  if (!tekst) return false
  const znormalizowany = normalizuj(tekst)
  const slowa = znormalizowany.match(/[a-z]+/g) || []
  const trafienia = slowa.filter((s) => ANGIELSKIE_SLOWA_FUNKCYJNE.includes(s))
  return trafienia.length >= 2
}
