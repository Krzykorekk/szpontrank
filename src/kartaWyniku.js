import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'

const KOLORY_AVATAROW = {
  blyskawica: ['#f5c542', '#e8492e'],
  gwiazda: ['#f5d76e', '#f5a623'],
  slonce: ['#ffd166', '#f2935c'],
  robot: ['#8ea3b8', '#4f6b85'],
  pies: ['#c9a06e', '#8a6a3f'],
  duszek: ['#c9d6e0', '#8ea3b8'],
  kot: ['#e0a6c9', '#b8608e'],
  kosmita: ['#8ee0b8', '#3fa870'],
  sowa: ['#c98e4f', '#8a5a2a'],
  panda: ['#e0e0e0', '#3a3a3a'],
  krolik: ['#f0c9d6', '#d68ea8'],
  krysztal: ['#4fb6e0', '#2c7fa8'],
  kompas: ['#d4af37', '#8a6a1a'],
  klucz: ['#c9c9c9', '#7a7a7a'],
  zwoj: ['#d6c19a', '#8a6a3f'],
}

async function rysujKarte({ imie, nick, streakDni, coiny, avatar }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')

  // tlo - gradient marki
  const tlo = ctx.createLinearGradient(0, 0, 1080, 1350)
  tlo.addColorStop(0, '#e8492e')
  tlo.addColorStop(1, '#f5a623')
  ctx.fillStyle = tlo
  ctx.fillRect(0, 0, 1080, 1350)

  // delikatne plamy
  ctx.globalAlpha = 0.15
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(900, 200, 300, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(100, 1100, 260, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  // logo/marka
  ctx.fillStyle = '#ffffff'
  ctx.font = "bold 44px 'Inter', sans-serif"
  ctx.textAlign = 'center'
  ctx.fillText('SZPONTRANK', 540, 110)

  // biala karta srodkowa
  const kartaX = 90, kartaY = 220, kartaW = 900, kartaH = 900
  ctx.fillStyle = 'rgba(255,255,255,0.96)'
  ctx.beginPath()
  ctx.roundRect(kartaX, kartaY, kartaW, kartaH, 40)
  ctx.fill()

  // awatar - kolko z gradientem
  const [k1, k2] = KOLORY_AVATAROW[avatar] || ['#e8492e', '#f5a623']
  const avatarGrad = ctx.createLinearGradient(390, 300, 690, 600)
  avatarGrad.addColorStop(0, k1)
  avatarGrad.addColorStop(1, k2)
  ctx.fillStyle = avatarGrad
  ctx.beginPath()
  ctx.arc(540, 450, 150, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = "bold 110px 'Bebas Neue', sans-serif"
  ctx.fillText((nick || '?')[0].toUpperCase(), 540, 495)

  // imie + nick
  ctx.fillStyle = '#241f1a'
  ctx.font = "bold 56px 'Inter', sans-serif"
  ctx.fillText(imie || '', 540, 690)
  ctx.fillStyle = '#837f78'
  ctx.font = "42px 'Inter', sans-serif"
  ctx.fillText('@' + (nick || ''), 540, 745)

  // staty: streak i coiny
  ctx.font = "bold 90px 'Bebas Neue', sans-serif"
  ctx.fillStyle = '#e8492e'
  ctx.fillText(String(streakDni || 0), 340, 950)
  ctx.font = "32px 'Inter', sans-serif"
  ctx.fillStyle = '#837f78'
  ctx.fillText(streakDni === 1 ? 'DZIEŃ STREAKA' : 'DNI STREAKA', 340, 995)

  ctx.font = "bold 90px 'Bebas Neue', sans-serif"
  ctx.fillStyle = '#f5a623'
  ctx.fillText(String(coiny || 0), 740, 950)
  ctx.font = "32px 'Inter', sans-serif"
  ctx.fillStyle = '#837f78'
  ctx.fillText('COINÓW', 740, 995)

  ctx.fillStyle = '#ffffff'
  ctx.font = "32px 'Inter', sans-serif"
  ctx.fillText('szpontrank.eu', 540, 1290)

  return canvas
}

export async function udostepnijWynik({ imie, nick, streakDni, coiny, avatar }) {
  const canvas = await rysujKarte({ imie, nick, streakDni, coiny, avatar })
  const dataUrl = canvas.toDataURL('image/png')

  if (Capacitor.isNativePlatform()) {
    const base64 = dataUrl.split(',')[1]
    const nazwaPliku = `szpontrank-wynik-${Date.now()}.png`
    await Filesystem.writeFile({
      path: nazwaPliku,
      data: base64,
      directory: Directory.Cache,
    })
    const { uri } = await Filesystem.getUri({ path: nazwaPliku, directory: Directory.Cache })
    await Share.share({
      title: 'Mój wynik w SzpontRank',
      text: 'Zobacz mój wynik w SzpontRank!',
      url: uri,
      dialogTitle: 'Udostępnij wynik',
    })
    return
  }

  // web: pobierz plik albo Web Share API jesli dostepne
  const odpowiedz = await fetch(dataUrl)
  const blob = await odpowiedz.blob()
  const plik = new File([blob], 'szpontrank-wynik.png', { type: 'image/png' })

  if (navigator.share && navigator.canShare?.({ files: [plik] })) {
    await navigator.share({ files: [plik], title: 'Mój wynik w SzpontRank' })
  } else {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'szpontrank-wynik.png'
    link.click()
  }
}
