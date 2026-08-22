import './Portfolio.css'

export default function Portfolio() {
  return (
    <div className="portfolio">
      <div className="portfolio-zdjecie">
        <img src="/portfolio/persona-2.jpg" alt="Krzykorekk" />
      </div>

      <div className="portfolio-tresc">
        <img className="portfolio-logo" src="/brand/emblem.png" alt="SzpontRank" />

        <span className="portfolio-eyebrow">YouTuber · Twórca SzpontRank</span>
        <h1>KRZYKOREKK</h1>
        <p className="portfolio-lead">Robię treści na YouTube i prowadzę własny projekt — SzpontRank.</p>

        <a
          className="portfolio-btn portfolio-btn-glowny"
          href="https://www.youtube.com/@Krzykorekk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mój kanał YouTube
        </a>

        <div className="portfolio-blok">
          <h2>Mój projekt</h2>
          <p>
            SzpontRank — codzienne rankingi i głosowania dla klasy i ekipy znajomych, plus krótkie
            pozytywne mini-ankiety o twórcach internetowych. Zasada „Zero Hejtu" — bez miejsca na
            złośliwości.
          </p>
          <a
            className="portfolio-btn portfolio-btn-cichy"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wypróbuj SzpontRank
          </a>
        </div>

        <div className="portfolio-kontakt">
          <a href="https://www.youtube.com/@Krzykorekk" target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a href="mailto:kontakt@szpontrank.eu">kontakt@szpontrank.eu</a>
        </div>
      </div>
    </div>
  )
}
