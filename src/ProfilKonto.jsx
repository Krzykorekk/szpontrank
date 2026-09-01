import { useState } from 'react'
import { supabase } from './supabaseClient'
import PanelAdmina from './PanelAdmina'
import { ADMIN_ID } from './admin'
import PodstronaProfilu from './PodstronaProfilu'

export default function ProfilKonto({ sesja, profil, wyloguj }) {
  const [usuwanieKonta, setUsuwanieKonta] = useState(false)

  async function usunKonto() {
    if (!window.confirm('Na pewno chcesz usunąć konto na stałe? Ta operacja jest nieodwracalna i usunie wszystkie Twoje dane.')) {
      return
    }
    setUsuwanieKonta(true)
    const { error } = await supabase.rpc('usun_moje_konto')
    if (error) {
      setUsuwanieKonta(false)
      window.alert('Nie udało się usunąć konta. Spróbuj ponownie albo napisz do nas.')
      return
    }
    await wyloguj()
  }

  return (
    <PodstronaProfilu
      tytul="Konto"
      profil={profil}
      dzieci={
        <>
          <div className="card">
            <h2>Konto</h2>
            <p className="hint">Zalogowano jako <strong>{sesja.user.email}</strong></p>
            <button className="install-btn wyloguj" onClick={wyloguj}>Wyloguj się</button>
          </div>

          {sesja.user.id === ADMIN_ID && <PanelAdmina />}

          <div className="card karta-niebezpieczna" style={{ marginTop: 18 }}>
            <h2>Strefa niebezpieczna</h2>
            <p className="hint">
              Usunięcie konta jest trwałe — znika Twój profil, głosy i Topki, które założyłeś/aś (razem
              z Topką znikają też inni jej członkowie). Tego nie da się cofnąć.
            </p>
            <button className="install-btn drugorzedny" onClick={usunKonto} disabled={usuwanieKonta}>
              {usuwanieKonta ? 'Usuwanie...' : 'Usuń moje konto na stałe'}
            </button>
          </div>
        </>
      }
    />
  )
}
