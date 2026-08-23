export default function TrybKonserwacji({ wiadomosc }) {
  return (
    <div className="tresc" style={{ maxWidth: 420, margin: '80px auto 0', textAlign: 'center' }}>
      <div className="card">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em', fontSize: '1.8rem', margin: '0 0 14px' }}>
          Zaraz wracamy
        </h1>
        <p className="hint">{wiadomosc}</p>
      </div>
    </div>
  )
}
