import { useEffect, useMemo, useState } from 'react'
import InvoiceRow from '../components/InvoiceRow'
import InvoiceDetailModal from '../components/InvoiceDetailModal'
import FilterForm from '../components/FilterForm'
import SummaryCards from '../components/SummaryCards'
import ConfirmDialog from '../components/ConfirmDialog'
import { bosFiltre } from '../components/filterDefaults'
import type { FilterValues } from '../components/FilterForm'
import type { Invoice } from '../models/invoice'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { faturalariYukle, faturaKaldir } from '../store/invoice/invoiceSlice'
import { faturalariExceleAktar } from '../utils/excelAktar'
import styles from './FaturaListesiSayfasi.module.scss'

type SiralamaAlani = keyof Pick<Invoice, 'faturaNo' | 'musteri' | 'tutar' | 'duzenlemeTarihi' | 'vadeTarihi'>
type SiralamaYonu = 'asc' | 'desc'

function FaturaListesiSayfasi() {
  const dispatch = useAppDispatch()
  const faturalar = useAppSelector((state) => state.invoice.liste)
  const yukleniyor = useAppSelector((state) => state.invoice.yukleniyor)
  const hata = useAppSelector((state) => state.invoice.hata)

  const [filtre, setFiltre] = useState<FilterValues>(bosFiltre)
  const [siralamaAlani, setSiralamaAlani] = useState<SiralamaAlani>('faturaNo')
  const [siralamaYonu, setSiralamaYonu] = useState<SiralamaYonu>('asc')
  const [sayfaNo, setSayfaNo] = useState(1)
  const [sayfaBoyutu, setSayfaBoyutu] = useState(10)
  const [seciliFatura, setSeciliFatura] = useState<Invoice | null>(null)
  const [silinecekFatura, setSilinecekFatura] = useState<Invoice | null>(null)
  const [seciliIdler, setSeciliIdler] = useState<string[]>([])
  const [topluSilmeOnayAcik, setTopluSilmeOnayAcik] = useState(false)

  useEffect(() => {
    dispatch(faturalariYukle())
  }, [dispatch])

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

  async function silmeyiOnayla() {
    if (!silinecekFatura) return
    await dispatch(faturaKaldir(silinecekFatura.id))
    setSilinecekFatura(null)
  }

  function secimiDegistir(id: string) {
    setSeciliIdler((onceki) =>
      onceki.includes(id) ? onceki.filter((seciliId) => seciliId !== id) : [...onceki, id]
    )
  }

  function tumunuSec() {
    const sayfadakiIdler = sayfadakiFaturalar.map((f) => f.id)
    const hepsiSeciliMi = sayfadakiIdler.every((id) => seciliIdler.includes(id))

    if (hepsiSeciliMi) {
      setSeciliIdler((onceki) => onceki.filter((id) => !sayfadakiIdler.includes(id)))
    } else {
      setSeciliIdler((onceki) => Array.from(new Set([...onceki, ...sayfadakiIdler])))
    }
  }

  async function topluSilmeyiOnayla() {
    await Promise.all(seciliIdler.map((id) => dispatch(faturaKaldir(id))))
    setSeciliIdler([])
    setTopluSilmeOnayAcik(false)
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

      <SummaryCards faturalar={gorunenFaturalar} />

      <button
        type="button"
        className={styles.exceleAktarButon}
        onClick={() => faturalariExceleAktar(gorunenFaturalar)}
      >
        📊 Excel'e Aktar
      </button>

      {seciliIdler.length > 0 && (
        <div className={styles.topluIslemCubugu}>
          <span>{seciliIdler.length} fatura seçildi</span>
          <button type="button" onClick={() => setTopluSilmeOnayAcik(true)}>
            Seçilenleri Sil
          </button>
          <button type="button" onClick={() => setSeciliIdler([])}>
            Seçimi Temizle
          </button>
        </div>
      )}

      {sayfadakiFaturalar.length === 0 ? (
        <p className={styles.durumMesaji}>Kriterlere uyan fatura bulunamadı.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={sayfadakiFaturalar.length > 0 && sayfadakiFaturalar.every((f) => seciliIdler.includes(f.id))}
                    onChange={tumunuSec}
                  />
                </th>
                <th onClick={() => kolonaTikla('faturaNo')}>Fatura No{okIsareti('faturaNo')}</th>
                <th onClick={() => kolonaTikla('musteri')}>Müşteri{okIsareti('musteri')}</th>
                <th onClick={() => kolonaTikla('duzenlemeTarihi')}>Düzenleme Tarihi{okIsareti('duzenlemeTarihi')}</th>
                <th onClick={() => kolonaTikla('vadeTarihi')}>Vade Tarihi{okIsareti('vadeTarihi')}</th>
                <th onClick={() => kolonaTikla('tutar')}>Tutar{okIsareti('tutar')}</th>
                <th>Tip</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sayfadakiFaturalar.map((fatura) => (
                <InvoiceRow
                  key={fatura.id}
                  fatura={fatura}
                  onGoruntule={setSeciliFatura}
                  onSilmeTalebi={setSilinecekFatura}
                  secili={seciliIdler.includes(fatura.id)}
                  onSecimDegistir={secimiDegistir}
                />
              ))}
            </tbody>
          </table>
        </div>
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

      <ConfirmDialog
        acikMi={silinecekFatura !== null}
        baslik="Faturayı Sil"
        mesaj={silinecekFatura ? `"${silinecekFatura.faturaNo}" numaralı faturayı silmek istediğinize emin misiniz?` : ''}
        onOnayla={silmeyiOnayla}
        onVazgec={() => setSilinecekFatura(null)}
      />

      <ConfirmDialog
        acikMi={topluSilmeOnayAcik}
        baslik="Seçili Faturaları Sil"
        mesaj={`${seciliIdler.length} faturayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        onOnayla={topluSilmeyiOnayla}
        onVazgec={() => setTopluSilmeOnayAcik(false)}
      />
    </div>
  )
}

export default FaturaListesiSayfasi