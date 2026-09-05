import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PALETA, Ksztalt } from './Awatar'

function svgAwatara(id) {
  const kolory = PALETA[id] || PALETA.blyskawica
  const svg = h(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', width: 300, height: 300, viewBox: '0 0 40 40' },
    h(
      'defs',
      null,
      h(
        'linearGradient',
        { id: 'g', x1: 0, y1: 0, x2: 1, y2: 1 },
        h('stop', { offset: '0%', stopColor: kolory[0] }),
        h('stop', { offset: '100%', stopColor: kolory[1] })
      )
    ),
    h('circle', { cx: 20, cy: 20, r: 19, fill: 'url(#g)' }),
    h('g', { transform: 'translate(8,8)' }, h(Ksztalt, { id }))
  )
  return renderToStaticMarkup(svg)
}

function wczytajObraz(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function wczytajAwatarImg(avatarId) {
  if (avatarId === 'legenda') return wczytajObraz('/avatars/legenda.png')
  return wczytajObraz('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgAwatara(avatarId)))
}

async function rysujKarte({ imie, nick, streakDni, coiny, avatar }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')

  // Kolory 1:1 z appki (--czerwien, --zloto, --tekst, --panel, --linia, --tekst-cichy)
  const CZERWIEN = '#ff4d4d'
  const ZLOTO = '#ffc93c'
  const TEKST = '#1f1a2e'
  const PANEL = '#ffffff'
  const LINIA = '#e2e2e8'
  const TEKST_CICHY = '#8a839c'

  // tlo - lity kolor marki, plasko (appka nie uzywa juz gradientow/szkla w tle)
  ctx.fillStyle = CZERWIEN
  ctx.fillRect(0, 0, 1080, 1350)

  // biala karta srodkowa - plasko, cienka obwodka (jak .card w appce), bez przezroczystosci/szkla
  const kartaX = 90, kartaY = 90, kartaW = 900, kartaH = 900
  ctx.fillStyle = PANEL
  ctx.strokeStyle = LINIA
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(kartaX, kartaY, kartaW, kartaH, 36)
  ctx.fill()
  ctx.stroke()

  // dlugie logo appki (czarna wersja - "jasny" - w srodku bialej karty, dobry kontrast;
  // biala/czerwona wersja na czerwonym tle byla slabo widoczna)
  const logo = await wczytajObraz('/brand/wordmark-jasny.png')
  const logoW = 620
  const logoH = logo.height * (logoW / logo.width)
  ctx.drawImage(logo, 540 - logoW / 2, kartaY + 50, logoW, logoH)

  // awatar - PRAWDZIWY ksztalt usera (ten sam co w appce), nie tylko litera
  const avatarImg = await wczytajAwatarImg(avatar)
  ctx.save()
  ctx.beginPath()
  ctx.arc(540, 469, 140, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(avatarImg, 400, 329, 280, 280)
  ctx.restore()
  ctx.lineWidth = 3
  ctx.strokeStyle = LINIA
  ctx.beginPath()
  ctx.arc(540, 469, 140, 0, Math.PI * 2)
  ctx.stroke()

  // imie + nick
  ctx.fillStyle = TEKST
  ctx.font = "bold 56px 'Inter', sans-serif"
  ctx.fillText(imie || '', 540, 669)
  ctx.fillStyle = TEKST_CICHY
  ctx.font = "42px 'Inter', sans-serif"
  ctx.fillText('@' + (nick || ''), 540, 724)

  // cienka linia oddzielajaca (jak <hr> w appce)
  ctx.strokeStyle = LINIA
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(kartaX + 60, 794)
  ctx.lineTo(kartaX + kartaW - 60, 794)
  ctx.stroke()

  // staty: streak i coiny
  ctx.font = "bold 90px 'Bebas Neue', sans-serif"
  ctx.fillStyle = CZERWIEN
  ctx.fillText(String(streakDni || 0), 340, 904)
  ctx.font = "bold 30px 'Inter', sans-serif"
  ctx.fillStyle = TEKST_CICHY
  ctx.fillText(streakDni === 1 ? 'DZIEŃ STREAKA' : 'DNI STREAKA', 340, 949)

  ctx.font = "bold 90px 'Bebas Neue', sans-serif"
  ctx.fillStyle = ZLOTO
  ctx.fillText(String(coiny || 0), 740, 904)
  ctx.font = "bold 30px 'Inter', sans-serif"
  ctx.fillStyle = TEKST_CICHY
  ctx.fillText('COINÓW', 740, 949)

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = "bold 32px 'Inter', sans-serif"
  ctx.fillText('szpontrank.eu', 540, 1170)

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
