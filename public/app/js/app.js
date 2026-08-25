import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://yvcukgcjwhmoeudjbwli.supabase.co'
const SUPABASE_KEY = 'sb_publishable_LS7oW2bHZH4h1bsrmaMTgA_I9eFEdWM'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
})

// ============ Pomocnicze ============
function pokazEkran(id) {
  document.querySelectorAll('.ekran').forEach((e) => e.classList.remove('ekran-aktywny'))
  document.getElementById(id).classList.add('ekran-aktywny')
}

function wibruj(wzorzec = 15) {
  if (navigator.vibrate) navigator.vibrate(wzorzec)
}

function dzisiaj() {
  return new Date().toISOString().slice(0, 10)
}

function numerDnia() {
  const teraz = new Date()
  const start = new Date(teraz.getFullYear(), 0, 0)
  const roznica = teraz - start
  return Math.floor(roznica / 86400000)
}

let profil = null
let aktualnaTopka = null

// ============ Logowanie ============
document.getElementById('form-logowanie').addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('pole-email').value
  const haslo = document.getElementById('pole-haslo').value
  const blad = document.getElementById('logowanie-blad')
  const btn = document.getElementById('btn-zaloguj')

  blad.hidden = true
  btn.disabled = true
  btn.textContent = 'Chwila...'

  const { error } = await supabase.auth.signInWithPassword({ email, password: haslo })

  btn.disabled = false
  btn.textContent = 'Zaloguj się'

  if (error) {
    blad.textContent = error.message.includes('Invalid')
      ? 'Nieprawidłowy e-mail lub hasło.'
      : 'Coś poszło nie tak — spróbuj ponownie.'
    blad.hidden = false
    return
  }
  await wczytajProfilIStartuj()
})

document.getElementById('btn-wyloguj').addEventListener('click', async () => {
  await supabase.auth.signOut()
  profil = null
  pokazEkran('ekran-logowanie')
})

// ============ Profil ============
async function wczytajProfilIStartuj() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    pokazEkran('ekran-logowanie')
    return
  }
  const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
  profil = data
  if (!profil) {
    pokazEkran('ekran-logowanie')
    return
  }
  document.getElementById('pasek-nick').textContent = '@' + profil.nick
  pokazEkran('ekran-glowny')
  await wczytajTopki()
}

// ============ Topki ============
async function wczytajTopki() {
  const { data: czlonkostwa } = await supabase
    .from('topka_czlonkowie')
    .select('topka_id')
    .eq('user_id', profil.id)

  const idki = (czlonkostwa || []).map((c) => c.topka_id)
  const lista = document.getElementById('lista-topek')
  const pusto = document.getElementById('topki-pusto')
  lista.innerHTML = ''

  if (idki.length === 0) {
    pusto.hidden = false
    return
  }
  pusto.hidden = true

  const { data: topki } = await supabase.from('topki').select('*').in('id', idki).neq('typ', 'ogolna')

  for (const t of topki || []) {
    const karta = document.createElement('div')
    karta.className = 'karta-topki'
    karta.innerHTML = `
      <div class="karta-topki-tekst">
        <h3>${t.nazwa}</h3>
        <p>${t.typ === 'klasa' ? 'Klasa' : 'Ekipa'}</p>
      </div>
    `
    karta.addEventListener('click', () => {
      wibruj(10)
      otworzGlosowanie(t)
    })
    lista.appendChild(karta)
  }
}

// ============ Głosowanie ============
async function otworzGlosowanie(topka) {
  aktualnaTopka = topka
  document.getElementById('widok-topki').classList.add('widok-ukryty')
  document.getElementById('widok-glosowanie').classList.remove('widok-ukryty')
  document.getElementById('glosowanie-nazwa-topki').textContent = topka.nazwa
  document.getElementById('glosowanie-wynik').hidden = true

  const { data: pytania } = await supabase
    .from('pytania')
    .select('*')
    .eq('tryb', topka.typ)
    .eq('aktywne', true)

  if (!pytania || pytania.length === 0) {
    document.getElementById('glosowanie-pytanie').textContent = 'Brak pytania na dziś.'
    document.getElementById('lista-kandydatow').innerHTML = ''
    return
  }
  const pytanie = pytania[numerDnia() % pytania.length]
  document.getElementById('glosowanie-pytanie').textContent = pytanie.tresc

  const { data: czlonkowie } = await supabase
    .from('topka_czlonkowie')
    .select('user_id')
    .eq('topka_id', topka.id)
  const idki = (czlonkowie || []).map((c) => c.user_id)
  const { data: kandydaci } = await supabase.from('profiles').select('*').in('id', idki)

  const { data: mojGlos } = await supabase
    .from('glosy')
    .select('*')
    .eq('topka_id', topka.id)
    .eq('glosujacy_id', profil.id)
    .eq('dzien', dzisiaj())
    .maybeSingle()

  const lista = document.getElementById('lista-kandydatow')
  lista.innerHTML = ''

  for (const k of kandydaci || []) {
    const btn = document.createElement('button')
    btn.className = 'kandydat-btn' + (mojGlos && mojGlos.zaglosowany_id === k.id ? ' wybrany' : '')
    btn.innerHTML = `<span class="kandydat-avatar">${k.nick[0].toUpperCase()}</span><span>${k.imie} <span style="color:var(--tekst-cichy)">@${k.nick}</span></span>`
    if (mojGlos) {
      btn.disabled = true
    } else {
      btn.addEventListener('click', () => oddajGlos(k.id, pytanie.id, btn))
    }
    lista.appendChild(btn)
  }

  if (mojGlos) {
    pokazWynik('Dzisiejszy głos oddany. Wróć jutro po kolejne pytanie.')
  }
}

async function oddajGlos(kandydatId, pytanieId, przycisk) {
  wibruj([10, 40, 10])
  const { error } = await supabase.from('glosy').insert({
    topka_id: aktualnaTopka.id,
    pytanie_id: pytanieId,
    glosujacy_id: profil.id,
    zaglosowany_id: kandydatId,
    dzien: dzisiaj(),
  })
  if (error) {
    pokazWynik('Już dziś zagłosowałeś/aś w tej Topce.')
    return
  }
  document.querySelectorAll('.kandydat-btn').forEach((b) => (b.disabled = true))
  przycisk.classList.add('wybrany')
  pokazWynik('Głos zapisany! Wróć jutro po kolejne pytanie.')
}

function pokazWynik(tekst) {
  const el = document.getElementById('glosowanie-wynik')
  el.textContent = tekst
  el.hidden = false
}

document.getElementById('btn-wroc-topki').addEventListener('click', () => {
  document.getElementById('widok-glosowanie').classList.add('widok-ukryty')
  document.getElementById('widok-topki').classList.remove('widok-ukryty')
  wczytajTopki()
})

// ============ Natywne udostępnianie ============
document.getElementById('btn-udostepnij').addEventListener('click', async () => {
  wibruj(10)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'SzpontRank',
        text: 'Dołącz do mojej Topki na SzpontRank!',
        url: 'https://szpontrank.eu',
      })
    } catch (e) {
      // użytkownik anulował — nic nie robimy
    }
  } else {
    navigator.clipboard.writeText('https://szpontrank.eu')
    alert('Link skopiowany!')
  }
})

// ============ Start ============
wczytajProfilIStartuj()
