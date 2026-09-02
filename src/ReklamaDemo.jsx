import { IkonaKorona, IkonaMoneta, IkonaGlobus, IkonaOgien, IkonaDom, IkonaGrupa, IkonaCzat, IkonaOsoba } from './Ikony'
import { OdznakaRangi } from './rangi'

function IlustracjaMenu() {
  return (
    <div className="xdd-telefon">
      <div className="xdd-telefon-ekran">
        <div className="xdd-telefon-logo">
          <img src="/brand/emblem.png" alt="" />
        </div>
        <div className="xdd-telefon-menu">
          <div className="xdd-telefon-pozycja xdd-telefon-aktywna">
            <IkonaDom rozmiar={22} />
            <span>Dom</span>
          </div>
          <div className="xdd-telefon-pozycja">
            <IkonaKorona rozmiar={22} />
            <span>Misje</span>
          </div>
          <div className="xdd-telefon-pozycja">
            <IkonaGrupa rozmiar={22} />
            <span>Rankingi</span>
          </div>
          <div className="xdd-telefon-pozycja">
            <IkonaCzat rozmiar={22} />
            <span>Znajomi</span>
          </div>
          <div className="xdd-telefon-pozycja">
            <IkonaOsoba rozmiar={22} />
            <span>Profil</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReklamaDemo() {
  return (
    <div className="xdd-scena">
      <div className="xdd-pasek xdd-pasek-logo">
        <span className="xdd-marka">SZPONTRANK</span>
      </div>

      <div className="xdd-pasek xdd-pasek-ilustracja">
        <IlustracjaMenu />
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
