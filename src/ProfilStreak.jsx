import { IkonaOgien, IkonaMoneta, IkonaKorona, IkonaFlaga } from './Ikony'
import PodstronaProfilu from './PodstronaProfilu'

function nastepnyKamienMilowy(dni) {
  if (dni < 7) return { cel: 7, nagroda: 50, poprzedni: 0 }
  if (dni < 30) return { cel: 30, nagroda: 200, poprzedni: 7 }
  const kolejny = Math.ceil((dni + 1) / 30) * 30
  return { cel: kolejny, nagroda: 200, poprzedni: kolejny - 30 }
}

export default function ProfilStreak({ profil }) {
  const dni = profil.streak_dni || 0
  const zamrozenia = profil.zamrozenia_streaka || 0
  const kamien = nastepnyKamienMilowy(dni)
  const doCelu = Math.max(0, kamien.cel - dni)
  const postep = Math.min(100, Math.round(((dni - kamien.poprzedni) / (kamien.cel - kamien.poprzedni)) * 100))

  return (
    <PodstronaProfilu
      tytul="Twój Streak"
      profil={profil}
      dzieci={
        <>
          <div className="ranga-hero">
            <IkonaOgien rozmiar={54} style={{ color: 'var(--czerwien)' }} />
            <div className="ranga-hero-tekst" style={{ flex: 1 }}>
              <h2>{dni} {dni === 1 ? 'dzień z rzędu' : 'dni z rzędu'}</h2>
              <p>
                Jeszcze {doCelu} {doCelu === 1 ? 'dzień' : 'dni'} do <strong>+{kamien.nagroda} Coinów</strong>
              </p>
              <div className="ranga-pasek-tlo">
                <div className="ranga-pasek-wypelnienie" style={{ width: `${postep}%` }} />
              </div>
            </div>
          </div>

          <div className="streak-fakty">
            <div className="streak-fakt">
              <IkonaKorona rozmiar={20} />
              <span>Jeden głos dziennie (gdziekolwiek) = streak rośnie o 1</span>
            </div>
            <div className="streak-fakt">
              <IkonaMoneta rozmiar={20} />
              <span>
                Zamrożenia: <strong>{zamrozenia}</strong> — ratują streak, gdy zapomnisz zagłosować
              </span>
            </div>
            <div className="streak-fakt">
              <IkonaFlaga rozmiar={20} />
              <span>7 dni = +50 Coinów, każde kolejne 30 dni = +200 Coinów</span>
            </div>
          </div>
        </>
      }
    />
  )
}
