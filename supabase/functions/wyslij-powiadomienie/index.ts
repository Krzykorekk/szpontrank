// Wysyla powiadomienie push do jednego uzytkownika przez Firebase Cloud Messaging (HTTP v1 API).
// Wymaga sekretu FCM_SERVICE_ACCOUNT_JSON (klucz konta uslugi z Firebase, ustawiony jako
// Supabase Edge Function secret) i FCM_PROJECT_ID (id projektu Firebase, np. "szpontrank1").

import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

function base64UrlEncode(dane: ArrayBuffer | string): string {
  const bajty = typeof dane === 'string' ? new TextEncoder().encode(dane) : new Uint8Array(dane)
  let binarny = ''
  bajty.forEach((b) => (binarny += String.fromCharCode(b)))
  return btoa(binarny).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function pobierzTokenDostepu(kontoUslugi: any): Promise<string> {
  const teraz = Math.floor(Date.now() / 1000)
  const naglowek = { alg: 'RS256', typ: 'JWT' }
  const tresc = {
    iss: kontoUslugi.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: teraz,
    exp: teraz + 3600,
  }

  const naglowekB64 = base64UrlEncode(JSON.stringify(naglowek))
  const trescB64 = base64UrlEncode(JSON.stringify(tresc))
  const doPodpisu = `${naglowekB64}.${trescB64}`

  const kluczPem = kontoUslugi.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '')
  const kluczBinarny = Uint8Array.from(atob(kluczPem), (c) => c.charCodeAt(0))

  const klucz = await crypto.subtle.importKey(
    'pkcs8',
    kluczBinarny,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const podpis = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', klucz, new TextEncoder().encode(doPodpisu))
  const jwt = `${doPodpisu}.${base64UrlEncode(podpis)}`

  const odpowiedz = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const dane = await odpowiedz.json()
  if (!dane.access_token) throw new Error('Brak access_token: ' + JSON.stringify(dane))
  return dane.access_token
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ blad: 'method_not_allowed' }), { status: 405 })
  }

  try {
    const { user_id, tytul, tresc, otworz } = await req.json()
    if (!user_id || !tytul || !tresc) {
      return new Response(JSON.stringify({ blad: 'brak_danych' }), { status: 400 })
    }

    const { data: profil } = await supabase
      .from('profiles')
      .select('fcm_token, powiadomienia_wlaczone')
      .eq('id', user_id)
      .maybeSingle()

    if (!profil?.fcm_token || profil.powiadomienia_wlaczone === false) {
      return new Response(JSON.stringify({ pominieto: true }), { status: 200 })
    }

    const kontoUsligiJSON = Deno.env.get('FCM_SERVICE_ACCOUNT_JSON')
    const projectId = Deno.env.get('FCM_PROJECT_ID')
    if (!kontoUsligiJSON || !projectId) {
      return new Response(JSON.stringify({ blad: 'brak_konfiguracji_fcm' }), { status: 500 })
    }
    const kontoUslugi = JSON.parse(kontoUsligiJSON)
    const tokenDostepu = await pobierzTokenDostepu(kontoUslugi)

    const wiadomosc = {
      message: {
        token: profil.fcm_token,
        notification: { title: tytul, body: tresc },
        data: otworz ? { otworz } : {},
        android: { priority: 'high' },
      },
    }

    const odpowiedzFcm = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenDostepu}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wiadomosc),
      }
    )

    if (!odpowiedzFcm.ok) {
      const tekstBledu = await odpowiedzFcm.text()
      // Token nieaktualny (np. user odinstalowal appke) - wyczysc go, zeby nie probowac w kolko
      if (odpowiedzFcm.status === 404 || odpowiedzFcm.status === 400) {
        await supabase.from('profiles').update({ fcm_token: null }).eq('id', user_id)
      }
      return new Response(JSON.stringify({ blad: 'fcm_blad', szczegoly: tekstBledu }), { status: 502 })
    }

    return new Response(JSON.stringify({ wyslano: true }), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ blad: 'wyjatek', szczegoly: String(e) }), { status: 500 })
  }
})
