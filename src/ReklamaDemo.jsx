import { IkonaKorona, IkonaMoneta, IkonaDom, IkonaGrupa, IkonaCzat, IkonaOsoba } from './Ikony'

export default function ReklamaDemo() {
  return (
    <div className="xdd-tlo">
      <div className="xdd-telefon xdd-telefon-duzy">
        <div className="xdd-telefon-ekran">
          <div className="xdd-ekran-naglowek">
            <img src="/brand/emblem.png" alt="" />
            <span>SzpontRank</span>
          </div>

          <div className="xdd-ekran-blok xdd-ekran-blok-zlota" />
          <div className="xdd-ekran-blok xdd-ekran-blok-duzy">
            <IkonaKorona rozmiar={22} />
          </div>
          <div className="xdd-ekran-blok xdd-ekran-blok-duzy">
            <IkonaMoneta rozmiar={22} />
          </div>
          <div className="xdd-ekran-blok" />

          <div className="xdd-telefon-menu">
            <div className="xdd-telefon-pozycja xdd-telefon-aktywna"><IkonaDom rozmiar={20} /></div>
            <div className="xdd-telefon-pozycja"><IkonaKorona rozmiar={20} /></div>
            <div className="xdd-telefon-pozycja"><IkonaGrupa rozmiar={20} /></div>
            <div className="xdd-telefon-pozycja"><IkonaCzat rozmiar={20} /></div>
            <div className="xdd-telefon-pozycja"><IkonaOsoba rozmiar={20} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
