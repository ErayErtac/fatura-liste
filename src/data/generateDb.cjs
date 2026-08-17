const musteriler = [
  'Ege Elektronik', 'Kaya Otomotiv', 'Mavi Lojistik A.Ş.', 'Yılmaz Ticaret A.Ş.',
  'Demir İnşaat Ltd. Şti.', 'Aksa Gıda San. A.Ş.', 'Öztürk Tekstil Ltd.',
]

function rastgeleTarih(baslangicYil, gunAraligi) {
  const baslangic = new Date(baslangicYil, 0, 1).getTime()
  const rastgeleGun = Math.floor(Math.random() * gunAraligi)
  const tarih = new Date(baslangic + rastgeleGun * 24 * 60 * 60 * 1000)
  return tarih.toISOString().slice(0, 10)
}

function faturaUret(index) {
  const durumlar = ['Ödendi', 'Bekliyor', 'Gecikmiş']
  const tipler = ['Satış', 'Alış']

  return {
    id: `inv-${index}`,
    faturaNo: `FTR2026${String(index).padStart(4, '0')}`,
    musteri: musteriler[index % musteriler.length],
    duzenlemeTarihi: rastgeleTarih(2026, 200),
    vadeTarihi: rastgeleTarih(2026, 250),
    tutar: Math.round((Math.random() * 150000 + 500) * 100) / 100,
    tip: tipler[index % tipler.length],
    durum: durumlar[index % durumlar.length],
  }
}

const invoices = Array.from({ length: 120 }, (_, i) => faturaUret(i + 1))

const musterilerListesi = musteriler.map((isim, index) => ({
  id: `musteri-${index + 1}`,
  ad: isim,
  email: `${isim.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '')}@ornek.com`,
  telefon: `05${String(300000000 + index * 1111111).slice(0, 9)}`,
}))

const fs = require('fs')
fs.writeFileSync('db.json', JSON.stringify({ invoices, musteriler: musterilerListesi }, null, 2))
console.log('db.json olusturuldu:', invoices.length, 'fatura,', musterilerListesi.length, 'musteri')