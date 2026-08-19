import { Link } from 'react-router-dom'

export default function NieZnaleziono() {
  return (
    <div className="tresc">
      <div className="strona-404">
        <h1>404</h1>
        <p>Nie ma tu nic do zobaczenia — ta strona nie istnieje.</p>
        <Link to="/" className="install-btn">
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  )
}
