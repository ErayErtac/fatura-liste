import type { Invoice } from '../models/invoice'

const musteriler = [
  'Ege Elektronik', 'Kaya Otomotiv', 'Mavi Lojistik A.Ş.', 'Yılmaz Ticaret A.Ş.',
  'Demir İnşaat Ltd. Şti.', 'Aksa Gıda San. A.Ş.', 'Öztürk Tekstil Ltd.',
]

function rastgeleTarih(baslangicYil: number, gunAraligi: number): string {
  const baslangic = new Date(baslangicYil, 0, 1).getTime()
  const rastgeleGun = Math.floor(Math.random() * gunAraligi)
  const tarih = new Date(baslangic + rastgeleGun * 24 * 60 * 60 * 1000)
  return tarih.toISOString().slice(0, 10)
}

function faturaUret(index: number): Invoice {
  const durumlar: Invoice['durum'][] = ['Ödendi', 'Bekliyor', 'Gecikmiş']
  const tipler: Invoice['tip'][] = ['Satış', 'Alış']

  return {
    id: `inv-${index}`,
    faturaNo: `FTR-2026-${String(index).padStart(4, '0')}`,
    musteri: musteriler[index % musteriler.length],
    duzenlemeTarihi: rastgeleTarih(2026, 200),
    vadeTarihi: rastgeleTarih(2026, 250),
    tutar: Math.round((Math.random() * 150000 + 500) * 100) / 100,
    tip: tipler[index % tipler.length],
    durum: durumlar[index % durumlar.length],
  }
}

export const mockInvoices: Invoice[] = Array.from({ length: 120 }, (_, i) =>
  faturaUret(i + 1)
)