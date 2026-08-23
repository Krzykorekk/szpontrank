import { ADMIN_ID } from './admin'
import { IkonaKorona } from './Ikony'

export default function OdznakaWlasciciela({ userId }) {
  if (userId !== ADMIN_ID) return null
  return (
    <span className="odznaka-wlasciciela" title="Właściciel SzpontRank">
      <IkonaKorona rozmiar={11} /> Właściciel
    </span>
  )
}
