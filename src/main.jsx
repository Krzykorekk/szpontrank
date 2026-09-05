import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
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
}
