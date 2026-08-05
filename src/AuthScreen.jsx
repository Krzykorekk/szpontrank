import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [wyslano, setWyslano] = useState(false)
  const [blad, setBlad] = useState(null)
  const [wysylanie, setWysylanie] = useState(false)

  const wyslijLink = async (e) => {
    e.preventDefault()
    setBlad(null)
    setWysylanie(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setWysylanie(false)
    if (error) {
      setBlad('Coś poszło nie tak. Sprawdź adres e-mail i spróbuj ponownie.')
      return
    }
    setWyslano(true)
  }

  if (wyslano) {
    return (
      <div className="card">
        <h2>Sprawdź skrzynkę 📬</h2>
        <p>
          Wysłaliśmy link logowania na <strong>{email}</strong>. Kliknij go, żeby wejść do
          SzpontRank.
        </p>
      </div>
    )
  }

  return (
    <form className="card" onSubmit={wyslijLink}>
      <h2>Zaloguj się</h2>
      <p>Podaj e-mail, wyślemy Ci link do logowania — bez hasła.</p>
      <input
        type="email"
        required
        placeholder="twoj@email.pl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      {blad && <p className="blad">{blad}</p>}
      <button className="install-btn" type="submit" disabled={wysylanie}>
        {wysylanie ? 'Wysyłanie...' : 'Wyślij link logowania'}
      </button>
    </form>
  )
}
