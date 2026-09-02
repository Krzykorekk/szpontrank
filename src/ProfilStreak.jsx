import { IkonaOgien, IkonaMoneta } from './Ikony'
import PodstronaProfilu from './PodstronaProfilu'

export default function ProfilStreak({ profil }) {
  return (
    <PodstronaProfilu
      tytul="Twój Streak"
      profil={profil}
      dzieci={
        <>
          <div className="ranga-hero">
            <IkonaOgien rozmiar={54} style={{ color: 'var(--czerwien)' }} />
            <div className="ranga-hero-tekst">
              <h2>{profil.streak_dni || 0} {profil.streak_dni === 1 ? 'dzień z rzędu' : 'dni z rzędu'}</h2>
              <p>Zagłosuj dziś, żeby utrzymać serię.</p>
            </div>
          </div>

          <div className="card">
            <h2>Jak działa Streak?</h2>
            <p className="hint">
              Za każdy dzień, w którym oddasz choć jeden głos (w Rankingach, Pojedynku Dnia albo Pytaniu
              Dnia — cokolwiek się liczy), Twój streak rośnie o 1. Jeśli przegapisz cały dzień bez
              żadnego głosu, streak wraca do zera — chyba że masz Zamrożenie.
            </p>
          </div>

          <div className="card">
            <h2><IkonaMoneta rozmiar={18} style={{ verticalAlign: '-3px', marginRight: 6 }} />Zamrożenie Streaka</h2>
            <p className="hint">
              Masz teraz: <strong>{profil.zamrozenia_streaka || 0}</strong>. Jeśli zapomnisz zagłosować
              jeden dzień, a masz choć jedno Zamrożenie — zużyje się automatycznie i streak przetrwa.
              Kupisz je za Coiny na ekranie Coinów.
            </p>
          </div>

          <div className="card">
            <h2>Kamienie milowe</h2>
            <p className="hint">
              7 dni z rzędu = <strong>+50 Coinów</strong> bonusu. 30 dni (i każde kolejne 30) =
              <strong> +200 Coinów</strong>. Im dłuższy streak, tym więcej zarabiasz za sam fakt, że
              wracasz codziennie.
            </p>
          </div>
        </>
      }
    />
  )
}
