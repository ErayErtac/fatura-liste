import { useEffect, useMemo, useState } from 'react'
import InvoiceRow from './components/InvoiceRow'
import InvoiceDetailModal from './components/InvoiceDetailModal'
import FilterForm, { bosFiltre } from './components/FilterForm'
import type { FilterValues } from './components/FilterForm'
import type { Invoice } from './models/invoice'
import { faturalariGetir } from './api/resources/invoice'
import styles from './App.module.scss'
import './App.css'

type SiralamaAlani = keyof Pick<Invoice, 'faturaNo' | 'musteri' | 'tutar' | 'duzenlemeTarihi' | 'vadeTarihi'>
type SiralamaYonu = 'asc' | 'desc'

function App() {
  const [faturalar, setFaturalar] = useState<Invoice[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState<string | null>(null)

  const [filtre, setFiltre] = useState<FilterValues>(bosFiltre)
  const [siralamaAlani, setSiralamaAlani] = useState<SiralamaAlani>('faturaNo')
  const [siralamaYonu, setSiralamaYonu] = useState<SiralamaYonu>('asc')
  const [sayfaNo, setSayfaNo] = useState(1)
  const [sayfaBoyutu, setSayfaBoyutu] = useState(10)
  const [seciliFatura, setSeciliFatura] = useState<Invoice | null>(null)

  useEffect(() => {
    async function veriyiYukle() {
      try {
        setYukleniyor(true)
        setHata(null)
        const veri = await faturalariGetir()
        setFaturalar(veri)
      } catch (err) {
        setHata('Faturalar yüklenirken bir hata oluştu. json-server çalışıyor mu?')
      } finally {
        setYukleniyor(false)
      }
    }

    veriyiYukle()
  }, [])

  const musteriler = useMemo(() => {
    const benzersiz = new Set(faturalar.map((f) => f.musteri))
    return Array.from(benzersiz).sort()
  }, [faturalar])

  const gorunenFaturalar = useMemo(() => {
    const kelime = filtre.aramaMetni.trim().toLowerCase()

    const filtrelenmis = faturalar.filter((fatura) => {
      if (
        kelime !== '' &&
        !fatura.musteri.toLowerCase().includes(kelime) &&
        !fatura.faturaNo.toLowerCase().includes(kelime)
      ) return false

      if (filtre.musteri && fatura.musteri !== filtre.musteri) return false
      if (filtre.durum && fatura.durum !== filtre.durum) return false
      if (filtre.tip && fatura.tip !== filtre.tip) return false

      const duzenlemeTarihi = new Date(fatura.duzenlemeTarihi)
      if (filtre.baslangicTarihi && duzenlemeTarihi < filtre.baslangicTarihi) return false
      if (filtre.bitisTarihi && duzenlemeTarihi > filtre.bitisTarihi) return false

      return true
    })

    return [...filtrelenmis].sort((a, b) => {
      const aDeger = a[siralamaAlani]
      const bDeger = b[siralamaAlani]
      if (aDeger < bDeger) return siralamaYonu === 'asc' ? -1 : 1
      if (aDeger > bDeger) return siralamaYonu === 'asc' ? 1 : -1
      return 0
    })
  }, [faturalar, filtre, siralamaAlani, siralamaYonu])

  const toplamSayfa = Math.max(1, Math.ceil(gorunenFaturalar.length / sayfaBoyutu))

  const sayfadakiFaturalar = useMemo(() => {
    const baslangic = (sayfaNo - 1) * sayfaBoyutu
    return gorunenFaturalar.slice(baslangic, baslangic + sayfaBoyutu)
  }, [gorunenFaturalar, sayfaNo, sayfaBoyutu])

  function kolonaTikla(alan: SiralamaAlani) {
    if (alan === siralamaAlani) {
      setSiralamaYonu((onceki) => (onceki === 'asc' ? 'desc' : 'asc'))
    } else {
      setSiralamaAlani(alan)
      setSiralamaYonu('asc')
    }
  }

  function okIsareti(alan: SiralamaAlani) {
    if (alan !== siralamaAlani) return ''
    return siralamaYonu === 'asc' ? ' ▲' : ' ▼'
  }

  function filtreUygula(yeniFiltre: FilterValues) {
    setFiltre(yeniFiltre)
    setSayfaNo(1)
  }

  function sayfaBoyutuDegisti(yeniBoyut: number) {
    setSayfaBoyutu(yeniBoyut)
    setSayfaNo(1)
  }

  if (yukleniyor) {
    return <div className={styles.durumMesaji}>Yükleniyor...</div>
  }

  if (hata) {
    return <div className={styles.durumMesaji}>{hata}</div>
  }

  return (
    <div>
      <h1>Fatura Listesi</h1>

      <FilterForm musteriler={musteriler} onFiltrele={filtreUygula} />

      {sayfadakiFaturalar.length === 0 ? (
        <p className={styles.durumMesaji}>Kriterlere uyan fatura bulunamadı.</p>
      ) : (
        <ul className={styles.list}>
          <li className={styles.headerRow}>
            <span onClick={() => kolonaTikla('faturaNo')}>Fatura No{okIsareti('faturaNo')}</span>
            <span onClick={() => kolonaTikla('musteri')}>Müşteri{okIsareti('musteri')}</span>
            <span onClick={() => kolonaTikla('duzenlemeTarihi')}>Düzenleme Tarihi{okIsareti('duzenlemeTarihi')}</span>
            <span onClick={() => kolonaTikla('vadeTarihi')}>Vade Tarihi{okIsareti('vadeTarihi')}</span>
            <span onClick={() => kolonaTikla('tutar')}>Tutar{okIsareti('tutar')}</span>
            <span>Tip</span>
            <span>Durum</span>
            <span>İşlem</span>
          </li>
          {sayfadakiFaturalar.map((fatura) => (
            <InvoiceRow key={fatura.id} fatura={fatura} onGoruntule={setSeciliFatura} />
          ))}
        </ul>
      )}

      <div className={styles.pagination}>
        <button disabled={sayfaNo === 1} onClick={() => setSayfaNo((s) => s - 1)}>
          Önceki
        </button>
        <span>Sayfa {sayfaNo} / {toplamSayfa}</span>
        <button disabled={sayfaNo === toplamSayfa} onClick={() => setSayfaNo((s) => s + 1)}>
          Sonraki
        </button>
        <select
          value={sayfaBoyutu}
          onChange={(e) => sayfaBoyutuDegisti(Number(e.target.value))}
        >
          <option value={10}>10 / sayfa</option>
          <option value={25}>25 / sayfa</option>
          <option value={50}>50 / sayfa</option>
        </select>
      </div>

      <InvoiceDetailModal fatura={seciliFatura} onClose={() => setSeciliFatura(null)} />
    </div>
  )
}

export default App