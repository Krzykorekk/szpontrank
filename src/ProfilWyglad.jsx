import { useState } from 'react'
import PodstronaProfilu from './PodstronaProfilu'

export default function ProfilWyglad({ profil }) {
  const [motywCiemny, setMotywCiemny] = useState(
    () => localStorage.getItem('szpontrank-motyw') === 'ciemny'
  )

  function przelaczMotyw(wlaczCiemny) {
    setMotywCiemny(wlaczCiemny)
    document.documentElement.setAttribute('data-motyw', wlaczCiemny ? 'ciemny' : 'jasny')
    localStorage.setItem('szpontrank-motyw', wlaczCiemny ? 'ciemny' : 'jasny')
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) metaTheme.setAttribute('content', wlaczCiemny ? '#14121f' : '#f0f1f5')
  }

  return (
    <PodstronaProfilu
      tytul="Wygląd"
      profil={profil}
      dzieci={
        <div className="card">
          <div className="ogolna-topka-baner" style={{ margin: 0 }}>
            <div className="ogolna-topka-tekst">
              <h3>Tryb ciemny</h3>
              <p>Ciemne tło zamiast jasnego — łatwiejsze dla oczu wieczorem.</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={motywCiemny} onChange={(e) => przelaczMotyw(e.target.checked)} />
              <span className="toggle-suwak" />
            </label>
          </div>
        </div>
      }
    />
  )
}
