import './Portfolio.css'

export default function Portfolio() {
  return (
    <div className="portfolio">
      <section className="portfolio-hero">
        <img className="portfolio-hero-tlo" src="/portfolio/night.jpg" alt="" />
        <div className="portfolio-hero-cien" />
        <div className="portfolio-hero-gora">
          <img className="portfolio-hero-logo" src="/brand/emblem.png" alt="SzpontRank" />
          <span className="portfolio-eyebrow">Solo dev</span>
        </div>
        <div className="portfolio-hero-body">
          <span className="portfolio-eyebrow">Twórca SzpontRank</span>
          <h1>
            KRZYKO<span>REKK</span>
          </h1>
          <p>
            Buduję appki, nie tylko o nich mówię. SzpontRank — codzienne rankingi i mini-ankiety
            dla klasy i ekipy — zaprojektowałem, napisałem i utrzymuję sam, od bazy danych po
            ostatni piksel.
          </p>
          <div className="portfolio-cta-rzad">
            <a className="portfolio-cta portfolio-cta-glowny" href="/">
              Zobacz SzpontRank →
            </a>
            <a className="portfolio-cta portfolio-cta-cichy" href="#kontakt">
              Napisz do mnie
            </a>
          </div>
        </div>
      </section>

      <section id="projekt">
        <span className="portfolio-eyebrow">Flagowy projekt</span>
        <h2 className="portfolio-sekcja-tytul">Co zbudowałem</h2>
        <div className="portfolio-projekt-karta">
          <div>
            <div className="portfolio-projekt-glowa">
              <img src="/brand/emblem.png" alt="" />
              <h3>SzpontRank</h3>
            </div>
            <p className="portfolio-opis">
              PWA dla nastolatków 13+ — codzienne głosowania w grupach znajomych i klasach, krótkie
              pozytywne mini-ankiety o twórcach internetowych i automatyczny ranking sumujący głosy
              ze wszystkich Topek. Zasada „Zero Hejtu": tylko pytania systemowe albo pozytywne,
              filtr wulgaryzmów, panel moderatora.
            </p>
            <ul className="portfolio-funkcje-lista">
              <li>Topki — codzienne głosowanie z koroną dnia</li>
              <li>Quersy — mini-ankiety porównawcze z moderacją</li>
              <li>Ogólny Ranking Apki — pasywne zestawienie ze wszystkich Topek</li>
              <li>Panel moderatora, 2FA, tryb ciemny, PWA</li>
            </ul>
            <div className="portfolio-stack-rzad">
              <span>React</span>
              <span>Vite</span>
              <span>Supabase</span>
              <span>Vercel</span>
              <span>Resend</span>
            </div>
          </div>
          <div className="portfolio-projekt-zdjecie">
            <img src="/portfolio/hero.jpg" alt="Laptop z logo SzpontRank na tarasie" />
          </div>
        </div>
      </section>

      <section id="kulisy">
        <span className="portfolio-eyebrow">Poza ekranem</span>
        <h2 className="portfolio-sekcja-tytul">Jak to powstaje</h2>
        <div className="portfolio-kulisy-siatka">
          <div className="portfolio-kulisy-karta">
            <img src="/portfolio/persona-1.jpg" alt="Przerwa w pracy nad appką, w plenerze" />
            <div className="portfolio-kulisy-podpis">
              Przerwa między commitami. Krowy nie mają dostępu do repo.
            </div>
          </div>
          <div className="portfolio-kulisy-karta">
            <img src="/portfolio/persona-2.jpg" alt="Wieczorna przerwa od kodu" />
            <div className="portfolio-kulisy-podpis">
              Koniec dnia, appka i tak działa dalej beze mnie.
            </div>
          </div>
        </div>
        <p className="portfolio-kulisy-nota">// nie zobaczysz tu mojej twarzy — zobaczysz robotę.</p>
      </section>

      <section id="kontakt">
        <span className="portfolio-eyebrow">Kontakt</span>
        <h2 className="portfolio-sekcja-tytul">Pogadajmy</h2>
        <div className="portfolio-kontakt-karta">
          <div>
            <a className="portfolio-kontakt-link" href="mailto:kontakt@szpontrank.eu">
              kontakt@szpontrank.eu
            </a>
            <a
              className="portfolio-kontakt-link"
              href="https://github.com/Krzykorekk"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/Krzykorekk
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

      <footer className="portfolio-stopka">© 2026 KRZYKOREKK — ZBUDOWANE W CAŁOŚCI SAMODZIELNIE</footer>
    </div>
  )
}
