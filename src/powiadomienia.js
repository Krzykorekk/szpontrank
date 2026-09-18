import { PushNotifications } from '@capacitor/push-notifications'
import { supabase } from './supabaseClient'

let zarejestrowano = false

export async function zarejestrujPowiadomienia(userId) {
  if (zarejestrowano || !userId) return
  zarejestrowano = true

  try {
    let stan = await PushNotifications.checkPermissions()
    if (stan.receive === 'prompt') {
      stan = await PushNotifications.requestPermissions()
    }
    if (stan.receive !== 'granted') return

    await PushNotifications.register()

    PushNotifications.addListener('registration', async (token) => {
      await supabase.from('profiles').update({ fcm_token: token.value }).eq('id', userId)
    })

    PushNotifications.addListener('registrationError', () => {})

    // Appka na pierwszym planie - powiadomienie przychodzi, ale system go nie pokaze
    // samo z siebie, wiec na razie po prostu je ignorujemy (uzytkownik i tak jest w appce).
    PushNotifications.addListener('pushNotificationReceived', () => {})

    // Kliknieto powiadomienie (appka byla w tle/zamknieta) - przekieruj do wlasciwego ekranu.
    PushNotifications.addListener('pushNotificationActionPerformed', (akcja) => {
      const cel = akcja.notification?.data?.otworz
      if (cel) {
        window.location.href = cel
      }
    })
  } catch (e) {
    // brak Google Play Services, emulator bez GMS itp. - appka ma dzialac dalej bez powiadomien
  }
}
