import { useEffect, useState } from 'react'

function useOdliczanie(dataStartu) {
  const [pozostalo, setPozostalo] = useState(null)

  useEffect(() => {
    if (!dataStartu) return
    const cel = new Date(dataStartu).getTime()

    function przelicz() {
      const roznica = cel - Date.now()
      if (roznica <= 0) {
        setPozostalo({ dni: 0, godziny: 0, minuty: 0, sekundy: 0, minelo: true })
        return
      }
      setPozostalo({
        dni: Math.floor(roznica / 86400000),
        godziny: Math.floor((roznica / 3600000) % 24),
        minuty: Math.floor((roznica / 60000) % 60),
        sekundy: Math.floor((roznica / 1000) % 60),
        minelo: false,
      })
    }

    przelicz()
    const interwal = setInterval(przelicz, 1000)
    return () => clearInterval(interwal)
  }, [dataStartu])

  return pozostalo
}

export default function TrybKonserwacji({ tytul, wiadomosc, dataStartu, pokazOdliczanie }) {
  const pozostalo = useOdliczanie(pokazOdliczanie ? dataStartu : null)

  return (
    <div className="tresc" style={{ maxWidth: 440, margin: '70px auto 0', textAlign: 'center' }}>
      <div className="card">
        <img src="/brand/emblem.png" alt="SzpontRank" style={{ width: 64, height: 64, margin: '0 auto 18px' }} />
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em', fontSize: '1.9rem', margin: '0 0 12px' }}>
          {tytul}
        </h1>
        <p className="hint">{wiadomosc}</p>

        {pozostalo && !pozostalo.minelo && (
          <div className="odliczanie-siatka">
            <div className="odliczanie-blok">
              <span className="odliczanie-liczba">{pozostalo.dni}</span>
              <span className="odliczanie-etykieta">dni</span>
            </div>
            <div className="odliczanie-blok">
              <span className="odliczanie-liczba">{pozostalo.godziny}</span>
              <span className="odliczanie-etykieta">godz.</span>
            </div>
            <div className="odliczanie-blok">
              <span className="odliczanie-liczba">{pozostalo.minuty}</span>
              <span className="odliczanie-etykieta">min.</span>
            </div>
            <div className="odliczanie-blok">
              <span className="odliczanie-liczba">{pozostalo.sekundy}</span>
              <span className="odliczanie-etykieta">sek.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
