import { IkonaKorona, IkonaMoneta, IkonaGlobus, IkonaOgien } from './Ikony'
import { OdznakaRangi } from './rangi'

export default function ReklamaDemo() {
  return (
    <div className="xdd-scena">
      <div className="xdd-pasek xdd-pasek-logo">
        <img src="/brand/emblem.png" alt="" className="xdd-logo" />
        <span className="xdd-marka">SZPONTRANK</span>
      </div>

      <div className="xdd-pasek xdd-pasek-a">
        <IkonaGlobus rozmiar={36} />
        <span>CODZIENNE PYTANIE DNIA</span>
      </div>

      <div className="xdd-pasek xdd-pasek-b">
        <IkonaKorona rozmiar={36} />
        <span>POJEDYNKI 1 NA 1</span>
      </div>

      <div className="xdd-pasek xdd-pasek-c">
        <IkonaMoneta rozmiar={36} />
        <span>ZBIERAJ COINY</span>
      </div>

      <div className="xdd-pasek xdd-pasek-d">
        <OdznakaRangi klucz="diament" rozmiar={40} />
        <span>PNIJ SIĘ W RANGACH</span>
      </div>

      <div className="xdd-pasek xdd-pasek-e">
        <IkonaOgien rozmiar={36} />
        <span>BUDUJ STREAK</span>
      </div>

      <div className="xdd-pasek xdd-pasek-cta">
        <span className="xdd-cta-duze">ZDOBĄDŹ RANGĘ.</span>
        <span className="xdd-cta-male">Za darmo. Już dziś.</span>
      </div>
    </div>
  )
}
