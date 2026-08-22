import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function Sekcja2FA() {
  const [factor, setFactor] = useState(null) // null = brak, obiekt = wlaczone
  const [ladowanie, setLadowanie] = useState(true)

  const [wlaczanie, setWlaczanie] = useState(false)
  const [qrSvg, setQrSvg] = useState(null)
  const [nowyFactorId, setNowyFactorId] = useState(null)
  const [kod, setKod] = useState('')
  const [blad, setBlad] = useState(null)
  const [przetwarzanie, setPrzetwarzanie] = useState(false)

  async function wczytaj() {
    setLadowanie(true)
    const { data } = await supabase.auth.mfa.listFactors()
    setFactor(data?.totp?.find((f) => f.status === 'verified') || null)
    setLadowanie(false)
  }

  useEffect(() => {
    wczytaj()
  }, [])

  async function rozpocznijWlaczanie() {
    if (przetwarzanie) return
    setBlad(null)
    setPrzetwarzanie(true)

    // usuń niedokończone (niezweryfikowane) próby z poprzednich sesji
    const { data: wszystkie } = await supabase.auth.mfa.listFactors()
    for (const f of wszystkie?.totp || []) {
      if (f.status !== 'verified') await supabase.auth.mfa.unenroll({ factorId: f.id })
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `szpontrank-${Date.now()}`,
    })
    setPrzetwarzanie(false)
    if (error) {
      setBlad(error.message)
      return
    }
    setNowyFactorId(data.id)
    setQrSvg(data.totp.qr_code)
    setWlaczanie(true)
  }

  async function potwierdzWlaczenie(e) {
    e.preventDefault()
    setBlad(null)
    setPrzetwarzanie(true)
    const { data: wyzwanie, error: bladWyzwania } = await supabase.auth.mfa.challenge({ factorId: nowyFactorId })
    if (bladWyzwania) {
      setPrzetwarzanie(false)
      setBlad(bladWyzwania.message)
      return
    }
    const { error } = await supabase.auth.mfa.verify({
      factorId: nowyFactorId,
      challengeId: wyzwanie.id,
      code: kod.trim(),
    })
    setPrzetwarzanie(false)
    if (error) {
      setBlad('Nieprawidłowy kod — spróbuj ponownie.')
      return
    }
    setWlaczanie(false)
    setKod('')
    setQrSvg(null)
    await wczytaj()
  }

  async function wylacz() {
    if (!window.confirm('Wyłączyć weryfikację dwuetapową?')) return
    setPrzetwarzanie(true)
    await supabase.auth.mfa.unenroll({ factorId: factor.id })
    setPrzetwarzanie(false)
    await wczytaj()
  }

  if (ladowanie) {
    return (
      <div className="card" style={{ marginTop: 18 }}>
        <h2>Weryfikacja dwuetapowa (2FA)</h2>
        <p className="debug-status">Ładowanie...</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ marginTop: 18 }}>
      <h2>Weryfikacja dwuetapowa (2FA)</h2>
      <p className="hint">
        Po włączeniu, przy logowaniu będziesz musiał/a dodatkowo podać kod z aplikacji
        uwierzytelniającej (np. Google Authenticator, Authy).
      </p>

      {!wlaczanie && factor && (
        <>
          <p className="status-pill">Włączona ✓</p>
          <button className="install-btn drugorzedny" onClick={wylacz} disabled={przetwarzanie}>
            {przetwarzanie ? 'Wyłączanie...' : 'Wyłącz 2FA'}
          </button>
        </>
      )}

      {!wlaczanie && !factor && (
        <button className="install-btn" onClick={rozpocznijWlaczanie} disabled={przetwarzanie}>
          {przetwarzanie ? 'Rozpoczynanie...' : 'Włącz 2FA'}
        </button>
      )}

      {wlaczanie && (
        <div>
          <p className="hint">Zeskanuj ten kod aplikacją uwierzytelniającą:</p>
          {qrSvg && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <img
                src={qrSvg}
                alt="Kod QR do aplikacji uwierzytelniającej"
                width={180}
                height={180}
                style={{ background: '#fff', padding: 10, borderRadius: 12 }}
              />
            </div>
          )}
          <form onSubmit={potwierdzWlaczenie}>
            <label className="pole">
              Kod z aplikacji
              <input
                className="input"
                inputMode="numeric"
                maxLength={6}
                value={kod}
                onChange={(e) => setKod(e.target.value)}
                placeholder="123456"
              />
            </label>
            {blad && <p className="blad">{blad}</p>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="install-btn" type="submit" disabled={przetwarzanie} style={{ flex: 1 }}>
                {przetwarzanie ? 'Sprawdzanie...' : 'Potwierdź i włącz'}
              </button>
              <button
                type="button"
                className="install-btn drugorzedny"
                style={{ flex: 1 }}
                onClick={() => {
                  setWlaczanie(false)
                  setQrSvg(null)
                  setKod('')
                }}
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
