export default function Download() {
  const adres = 'https://szpontrank.eu'

  return (
    <div className="tresc">
      <div className="strona-download card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em', fontSize: '1.8rem', margin: '0 0 12px' }}>
          Zainstaluj SzpontRank
        </h1>
        <p className="hint" style={{ marginBottom: 24 }}>
          Zeskanuj kod telefonem, otwórz stronę i dodaj ją do ekranu głównego — appka instaluje się
          bezpośrednio z przeglądarki, bez sklepu.
        </p>
        <img
          className="qr-kod"
          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(adres)}`}
          alt="Kod QR do SzpontRank"
          width={220}
          height={220}
        />
        <p className="qr-adres">{adres}</p>

        <div className="download-play-wkrotce">
          <p className="hint" style={{ margin: 0 }}>
            Wersja z Google Play — wkrótce. Kod QR do sklepu pojawi się tutaj, jak tylko appka zostanie
            tam opublikowana.
          </p>
        </div>
      </div>
    </div>
  )
}
