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

// Druga warstwa moderacji: wywołuje Edge Function 'moderuj-tekst' w Supabase,
// która sprawdza tekst przez OpenAI Moderation API (dowolny język, nie tylko
// PL/EN jak lista słów powyżej). Zawodzi "otwarcie" — jeśli funkcja nie
// odpowie albo zwróci błąd, NIE blokujemy (żeby awaria API nie zablokowała
// całej appki), po prostu polegamy wtedy tylko na liście słów.
export async function zawieraNiedozwoloneTresciAI(supabase, tekst) {
  if (!tekst || !tekst.trim()) return false
  try {
    const { data, error } = await supabase.functions.invoke('moderuj-tekst', {
      body: { tekst },
    })
    if (error) return false
    return data?.zablokowany === true
  } catch {
    return false
  }
}

// Jak wyżej, ale zwraca pełny wynik (w tym kategorię) zamiast samego tak/nie —
// używane w panelu admina do skanowania istniejących kont, gdzie chcemy wiedzieć
// DLACZEGO coś zostało oflagowane, nie tylko że zostało.
export async function sprawdzTresicSzczegolowo(supabase, tekst) {
  if (!tekst || !tekst.trim()) return { zablokowany: false, kategorie: null }
  try {
    const { data, error } = await supabase.functions.invoke('moderuj-tekst', {
      body: { tekst },
    })
    if (error) return { zablokowany: false, kategorie: null, blad: 'blad_polaczenia' }
    return {
      zablokowany: data?.zablokowany === true,
      kategorie: data?.kategorie || null,
      blad: data?.blad || null,
    }
  } catch {
    return { zablokowany: false, kategorie: null, blad: 'wyjatek' }
  }
}

// Wyciąga czytelną nazwę pierwszej "prawdziwej" (true) kategorii z odpowiedzi OpenAI,
// do pokazania adminowi w jednym krótkim słowie zamiast całego obiektu JSON.
export function opiszKategorie(kategorie) {
  if (!kategorie) return null
  const nazwy = {
    harassment: 'nękanie',
    'harassment/threatening': 'nękanie z groźbami',
    hate: 'mowa nienawiści',
    'hate/threatening': 'mowa nienawiści z groźbami',
    violence: 'przemoc',
    'violence/graphic': 'przemoc graficzna',
    sexual: 'treści seksualne',
    'sexual/minors': 'treści seksualne (nieletni)',
    'self-harm': 'samookaleczenie',
    'self-harm/intent': 'samookaleczenie (zamiar)',
    'self-harm/instructions': 'samookaleczenie (instrukcje)',
    illicit: 'nielegalne treści',
    'illicit/violent': 'nielegalne treści z przemocą',
  }
  const trafione = Object.entries(kategorie)
    .filter(([, wartosc]) => wartosc === true)
    .map(([klucz]) => nazwy[klucz] || klucz)
  return trafione.length > 0 ? trafione.join(', ') : null
}
