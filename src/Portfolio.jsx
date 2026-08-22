export default function Portfolio() {
  return (
    <>
      <section className="hero-sekcja">
        <img src="/brand/emblem.png" alt="SzpontRank" className="hero-godlo" />
        <h1 className="hero-tytul">Krzykorekk</h1>
        <p className="hero-opis">
          Robię treści na YouTube i prowadzę własny projekt — SzpontRank.
        </p>
        <div className="hero-cta">
          <a
            className="install-btn"
            href="https://www.youtube.com/@Krzykorekk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mój kanał YouTube
          </a>
          <a className="install-btn drugorzedny" href="#projekt">
            Zobacz SzpontRank
          </a>
        </div>
      </section>

      <section className="kroki-sekcja">
        <h2 className="sekcja-naglowek">Poznaj mnie</h2>
        <div className="portfolio-zdjecia">
          <div className="portfolio-zdjecie-karta">
            <img src="/portfolio/persona-1.jpg" alt="Krzykorekk w plenerze" />
          </div>
          <div className="portfolio-zdjecie-karta">
            <img src="/portfolio/persona-2.jpg" alt="Krzykorekk" />
          </div>
        </div>
      </section>

      <section id="projekt" className="funkcje-sekcja">
        <h2 className="sekcja-naglowek">Mój projekt</h2>
        <div className="card card-wyroznik">
          <h2>SzpontRank</h2>
          <p className="hint">
            Codzienne rankingi i głosowania dla klasy i ekipy znajomych — kto zbierze najwięcej
            głosów, nosi koronę. Do tego krótkie, pozytywne mini-ankiety o twórcach internetowych.
            Zasada „Zero Hejtu" — bez miejsca na złośliwości.
          </p>
          <a className="install-btn" href="/" style={{ marginTop: 12 }}>
            Wypróbuj SzpontRank
          </a>
        </div>
      </section>

      <section className="funkcje-sekcja">
        <h2 className="sekcja-naglowek">O mnie</h2>
        <div className="card">
          <p className="hint">
            Tworzę treści na YouTube i buduję SzpontRank, swój własny projekt. Więcej o mnie
            już wkrótce.
          </p>
        </div>
      </section>

      <section className="funkcje-sekcja">
        <h2 className="sekcja-naglowek">Kontakt</h2>
        <div className="card">
          <p style={{ margin: '0 0 10px' }}>
            <a href="https://www.youtube.com/@Krzykorekk" target="_blank" rel="noopener noreferrer">
              YouTube — @Krzykorekk
            </a>
          </p>
          <p style={{ margin: '0 0 10px' }}>
            <a href="mailto:kontakt@szpontrank.eu">kontakt@szpontrank.eu</a>
          </p>
          <p style={{ margin: 0 }}>
            <a href="https://szpontrank.vercel.app" target="_blank" rel="noopener noreferrer">
              szpontrank.vercel.app
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
