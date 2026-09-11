import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { inicjalizujSentry } from './sentry'
import App from './App.jsx'
import './App.css'

inicjalizujSentry()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Service Worker (cache + baner "nowa wersja") ma sens WYLACZNIE w przegladarce
// (PWA) - appka natywna (Android) ma pliki wbudowane na stale w kazdy nowy
// build, wiec SW tam tylko szkodzi: potrafi serwowac stary, zcache'owany kod
// mimo zainstalowania swiezego APK, i myli userow banerem "trzeba odswiezyc".
if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((rejestracja) => {
        function zglosCzekajacego(worker) {
          if (worker) {
            window.dispatchEvent(new CustomEvent('szpontrank-nowa-wersja', { detail: worker }))
          }
        }

        // Ktoś już czeka w tle w momencie rejestracji (np. odświeżenie karty
        // po tym, jak nowa wersja zdążyła się ściągnąć wcześniej)
        zglosCzekajacego(rejestracja.waiting)

        rejestracja.addEventListener('updatefound', () => {
          const nowyWorker = rejestracja.installing
          if (!nowyWorker) return
          nowyWorker.addEventListener('statechange', () => {
            // 'installed' + istniejący controller = to jest AKTUALIZACJA,
            // nie pierwsza instalacja (przy pierwszej nie ma jeszcze controllera)
            if (nowyWorker.state === 'installed' && navigator.serviceWorker.controller) {
              zglosCzekajacego(nowyWorker)
            }
          })
        })
      })
      .catch(() => {
        // cicho ignorujemy błąd rejestracji SW — appka nadal działa bez niej
      })

    let odswiezanie = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (odswiezanie) return
      odswiezanie = true
      window.location.reload()
    })
  })
} else if (Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  // Sprzatanie: jesli jakis stary Service Worker z wczesniejszej wersji appki
  // zdazyl sie juz zarejestrowac w WebView na tym urzadzeniu, wyrejestruj go
  // i wyczysc jego cache, zeby raz na zawsze przestal serwowac stare pliki.
  navigator.serviceWorker.getRegistrations().then((rejestracje) => {
    rejestracje.forEach((r) => r.unregister())
  })
  if ('caches' in window) {
    caches.keys().then((klucze) => klucze.forEach((k) => caches.delete(k)))
  }
}
