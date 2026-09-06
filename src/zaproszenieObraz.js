import { wczytajObraz, wczytajAwatarImg, udostepnijCanvas } from './kartaWyniku'

async function rysujZaproszenie({ imie, nick, avatar }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')

  const CZERWIEN = '#ff4d4d'
  const ZLOTO = '#ffc93c'
  const TEKST = '#1f1a2e'
  const PANEL = '#ffffff'
  const LINIA = '#e2e2e8'
  const TEKST_CICHY = '#8a839c'

  ctx.fillStyle = CZERWIEN
  ctx.fillRect(0, 0, 1080, 1350)

  const kartaX = 90, kartaY = 90, kartaW = 900, kartaH = 980
  ctx.fillStyle = PANEL
  ctx.strokeStyle = LINIA
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(kartaX, kartaY, kartaW, kartaH, 36)
  ctx.fill()
  ctx.stroke()

  const logo = await wczytajObraz('/brand/wordmark-jasny.png')
  const logoW = 560
  const logoH = logo.height * (logoW / logo.width)
  ctx.drawImage(logo, 540 - logoW / 2, kartaY + 46, logoW, logoH)

  const avatarImg = await wczytajAwatarImg(avatar)
  const avY = kartaY + 46 + logoH + 44
  ctx.save()
  ctx.beginPath()
  ctx.arc(540, avY + 80, 80, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(avatarImg, 540 - 80, avY, 160, 160)
  ctx.restore()
  ctx.lineWidth = 3
  ctx.strokeStyle = LINIA
  ctx.beginPath()
  ctx.arc(540, avY + 80, 80, 0, Math.PI * 2)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = TEKST
  ctx.font = "bold 40px 'Inter', sans-serif"
  ctx.fillText(`${imie || nick} zaprasza Cię`, 540, avY + 250)
  ctx.font = "bold 40px 'Inter', sans-serif"
  ctx.fillText('do SzpontRank!', 540, avY + 300)

  const nagrodaY = avY + 380
  ctx.fillStyle = ZLOTO
  ctx.font = "bold 30px 'Inter', sans-serif"
  ctx.fillText('+50 Coinów dla Ciebie, gdy dołączysz', 540, nagrodaY)

  ctx.strokeStyle = LINIA
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(kartaX + 60, nagrodaY + 40)
  ctx.lineTo(kartaX + kartaW - 60, nagrodaY + 40)
  ctx.stroke()

  ctx.fillStyle = TEKST_CICHY
  ctx.font = "28px 'Inter', sans-serif"
  ctx.fillText('Kod zaproszenia', 540, nagrodaY + 90)
  ctx.fillStyle = CZERWIEN
  ctx.font = "bold 54px 'Bebas Neue', sans-serif"
  ctx.fillText(`@${nick}`, 540, nagrodaY + 150)

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = "bold 32px 'Inter', sans-serif"
  ctx.fillText('szpontrank.eu', 540, 1240)

  return canvas
}

export async function udostepnijZaproszenie({ imie, nick, avatar }) {
  const canvas = await rysujZaproszenie({ imie, nick, avatar })
  const link = `https://szpontrank.eu/rejestracja?ref=${encodeURIComponent(nick)}`
  await udostepnijCanvas(canvas, {
    nazwaBazowa: 'szpontrank-zaproszenie',
    tytul: 'Dołącz do mnie w SzpontRank!',
    tekst: `Dołącz do mnie w SzpontRank i odbierz +50 Coinów: ${link}`,
  })
}
