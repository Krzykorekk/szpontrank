import './Portfolio.css'

export default function Portfolio() {
  return (
    <div className="portfolio">
      <section className="portfolio-hero">
        <img className="portfolio-hero-tlo" src="/portfolio/persona-2.jpg" alt="Krzykorekk" />
        <div className="portfolio-hero-cien" />
        <div className="portfolio-hero-gora">
          <img className="portfolio-hero-logo" src="/brand/emblem.png" alt="SzpontRank" />
        </div>
        <div className="portfolio-hero-body">
          <span className="portfolio-eyebrow">YouTuber · Twórca SzpontRank</span>
          <h1>KRZYKOREKK</h1>
          <p>Robię treści na YouTube i prowadzę własny projekt — SzpontRank.</p>
          <div className="portfolio-cta-rzad">
            <a
              className="portfolio-cta portfolio-cta-glowny"
              href="https://www.youtube.com/@Krzykorekk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mój kanał YouTube →
            </a>
            <a className="portfolio-cta portfolio-cta-cichy" href="#projekt">
              Zobacz SzpontRank
            </a>
          </div>
        </div>
      </section>

      <section id="projekt">
        <span className="portfolio-eyebrow">Mój projekt</span>
        <h2 className="portfolio-sekcja-tytul">SzpontRank</h2>
        <div className="portfolio-projekt-karta">
          <div>
            <div className="portfolio-projekt-glowa">
              <img src="/brand/emblem.png" alt="" />
              <h3>SzpontRank</h3>
            </div>
            <p className="portfolio-opis">
              Codzienne rankingi i głosowania dla klasy i ekipy znajomych — kto zbierze najwięcej
              głosów, nosi koronę. Do tego krótkie, pozytywne mini-ankiety o twórcach internetowych.
              Zasada „Zero Hejtu" — bez miejsca na złośliwości.
            </p>
          </div>
          <div className="portfolio-projekt-zdjecie">
            <img src="/portfolio/persona-1.jpg" alt="Krzykorekk w plenerze" />
          </div>
        </div>
        <div className="portfolio-cta-rzad" style={{ marginTop: 24 }}>
          <a
            className="portfolio-cta portfolio-cta-glowny"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wypróbuj SzpontRank →
          </a>
        </div>
      </section>

      <section id="o-mnie">
        <span className="portfolio-eyebrow">Kim jestem</span>
        <h2 className="portfolio-sekcja-tytul">O mnie</h2>
        <p className="portfolio-o-mnie-tekst">
          Krzykorekk — tworzę treści na YouTube i buduję SzpontRank, swój własny projekt.
          Więcej o mnie już wkrótce.
        </p>
      </section>

      <section id="kontakt">
        <span className="portfolio-eyebrow">Kontakt</span>
        <h2 className="portfolio-sekcja-tytul">Pogadajmy</h2>
        <div className="portfolio-kontakt-karta">
          <div>
            <a
              className="portfolio-kontakt-link"
              href="https://www.youtube.com/@Krzykorekk"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube — @Krzykorekk
            </a>
            <a className="portfolio-kontakt-link" href="mailto:kontakt@szpontrank.eu">
              kontakt@szpontrank.eu
            </a>
          </div>
          <div>
            <a
              className="portfolio-kontakt-link"
              href="https://szpontrank.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              szpontrank.vercel.app
            </a>
          </div>
        </div>
      </section>

      <footer className="portfolio-stopka">© 2026 Krzykorekk</footer>
    </div>
  )
}
