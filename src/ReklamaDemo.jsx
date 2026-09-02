import { useState } from 'react'
import { IkonaKorona, IkonaMoneta, IkonaOgien } from './Ikony'
import { OdznakaRangi } from './rangi'

const AWATAR_KOLORY = {
  a: ['#f5c542', '#e8492e'],
  b: ['#4fb6e0', '#2c7fa8'],
}

function FalszywyAwatar({ litera, wariant, rozmiar = 44 }) {
  const [k1, k2] = AWATAR_KOLORY[wariant]
  return (
    <div
      style={{
        width: rozmiar,
        height: rozmiar,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${k1}, ${k2})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: rozmiar * 0.45,
        flexShrink: 0,
      }}
    >
      {litera}
    </div>
  )
}

export default function ReklamaDemo() {
  const [wybor, setWybor] = useState(null)
  const [glosPojedynek, setGlosPojedynek] = useState(null)

  return (
    <div className="tresc" style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="/brand/emblem.png" alt="SzpontRank" style={{ width: 48, height: 48 }} />
      </div>

      {/* Pytanie Dnia */}
      <div className="pytanie-dnia-karta">
        <h3 className="pytanie-dnia-tytul">Pytanie Dnia</h3>
        <p className="pytanie-dnia-tresc">Co wolisz?</p>
        <div className="pytanie-dnia-opcje">
          <button
            className={`pytanie-dnia-opcja ${wybor === 'a' ? 'wybrana' : ''}`}
            onClick={() => setWybor('a')}
          >
            <span>Pizza</span>
            {wybor && (
              <>
                <div className="pytanie-dnia-pasek-tlo">
                  <div className="pytanie-dnia-pasek-wypelnienie" style={{ width: '68%' }} />
                </div>
                <span className="pytanie-dnia-procent">68%</span>
              </>
            )}
          </button>
          <span className="pytanie-dnia-vs">czy</span>
          <button
            className={`pytanie-dnia-opcja ${wybor === 'b' ? 'wybrana' : ''}`}
            onClick={() => setWybor('b')}
          >
            <span>Burger</span>
            {wybor && (
              <>
                <div className="pytanie-dnia-pasek-tlo">
                  <div className="pytanie-dnia-pasek-wypelnienie" style={{ width: '32%' }} />
                </div>
                <span className="pytanie-dnia-procent">32%</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pojedynek Dnia */}
      <div className="pojedynek-karta">
        <h3 className="pojedynek-tytul">Pojedynek Dnia</h3>
        <div className="pojedynek-uczestnicy">
          <button
            className={`pojedynek-osoba ${glosPojedynek === 'a' ? 'wybrana' : ''}`}
            onClick={() => setGlosPojedynek('a')}
          >
            <FalszywyAwatar litera="R" wariant="a" rozmiar={54} />
            <span className="pojedynek-nick">@Reksio99</span>
            <OdznakaRangi klucz="zloto" rozmiar={20} />
            {glosPojedynek && (
              <>
                <div className="pojedynek-pasek-tlo">
                  <div className="pojedynek-pasek-wypelnienie" style={{ width: '57%' }} />
                </div>
                <span className="pojedynek-procent">57% (32)</span>
              </>
            )}
          </button>
          <span className="pojedynek-vs">VS</span>
          <button
            className={`pojedynek-osoba ${glosPojedynek === 'b' ? 'wybrana' : ''}`}
            onClick={() => setGlosPojedynek('b')}
          >
            <FalszywyAwatar litera="K" wariant="b" rozmiar={54} />
            <span className="pojedynek-nick">@KosmicznyKot</span>
            <OdznakaRangi klucz="diament" rozmiar={20} />
            {glosPojedynek && (
              <>
                <div className="pojedynek-pasek-tlo">
                  <div className="pojedynek-pasek-wypelnienie" style={{ width: '43%' }} />
                </div>
                <span className="pojedynek-procent">43% (24)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ranga i Coiny */}
      <div className="ranga-hero">
        <OdznakaRangi klucz="zloto" rozmiar={64} />
        <div className="ranga-hero-tekst" style={{ flex: 1 }}>
          <h2>Ranga Złoto</h2>
          <p>340 Coinów do rangi Diament</p>
          <div className="ranga-pasek-tlo">
            <div className="ranga-pasek-wypelnienie" style={{ width: '64%' }} />
          </div>
        </div>
      </div>

      <div className="coiny-hero">
        <div className="coiny-moneta"><IkonaMoneta rozmiar={48} /></div>
        <span className="coiny-liczba-duza">1 260</span>
        <p className="coiny-etykieta">Twoje Coiny</p>
      </div>

      <div className="korona-lidera-karta" style={{ cursor: 'default' }}>
        <div className="korona-lidera-ikona"><IkonaKorona rozmiar={22} /></div>
        <div className="ranking-avatar korona-lidera-avatar">
          <FalszywyAwatar litera="G" wariant="a" rozmiar={44} />
        </div>
        <div className="korona-lidera-tekst">
          <span className="korona-lidera-etykieta">Koronę dziś nosi</span>
          <span className="korona-lidera-nick">@GraczXYZ</span>
        </div>
        <span className="korona-lidera-glosy">89 głosów</span>
      </div>

      <div className="streak-widget" style={{ marginTop: 14 }}>
        <IkonaOgien rozmiar={22} />
        <span className="streak-liczba">17</span>
        <span className="streak-etykieta">dni z rzędu</span>
      </div>
    </div>
  )
}
