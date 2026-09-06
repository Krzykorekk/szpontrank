import { createClient } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Brak VITE_SUPABASE_URL lub VITE_SUPABASE_ANON_KEY — sprawdź plik .env (lokalnie) lub ustawienia Environment Variables w Vercelu.'
  )
}

// Na Androidzie/iOS uzywamy trwalej pamieci natywnej (Preferences) zamiast
// localStorage - system potrafi wyczyscic localStorage WebView, gdy appka
// idzie w tlo (np. otwiera sie przegladarka do logowania Google), co psuje
// PKCE (kod weryfikacyjny znika i logowanie konczy sie bledem "invalid flow
// state, no valid flow state found"). Preferences przezywa to bez problemu.
const capacitorStorageAdapter = {
  getItem: async (key) => {
    const { value } = await Preferences.get({ key })
    return value
  },
  setItem: async (key, value) => {
    await Preferences.set({ key, value })
  },
  removeItem: async (key) => {
    await Preferences.remove({ key })
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // zapamiętuje zalogowanie w przeglądarce (nie trzeba logować się od nowa po odświeżeniu)
    autoRefreshToken: true,
    flowType: 'pkce', // wymagane, żeby exchangeCodeForSession (logowanie OAuth w appce natywnej) dzialalo poprawnie
    ...(Capacitor.isNativePlatform() ? { storage: capacitorStorageAdapter } : {}),
  },
})
