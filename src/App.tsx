import { useMemo, useState } from 'react'
import InvoiceRow from './components/InvoiceRow'
import type { Invoice } from './models/invoice'
import { mockInvoices } from './data/mockInvoices'
import styles from './App.module.scss'
import './App.css'

type SiralamaAlani = keyof Pick<Invoice, 'faturaNo' | 'musteri' | 'tutar' | 'duzenlemeTarihi' | 'vadeTarihi'>
type SiralamaYonu = 'asc' | 'desc'

function App() {
  const [faturalar] = useState<Invoice[]>(mockInvoices)
  const [aramaMetni, setAramaMetni] = useState('')
  const [siralamaAlani, setSiralamaAlani] = useState<SiralamaAlani>('faturaNo')
  const [siralamaYonu, setSiralamaYonu] = useState<SiralamaYonu>('asc')

  const gorunenFaturalar = useMemo(() => {
    const kelime = aramaMetni.trim().toLowerCase()

    const filtrelenmis = kelime === ''
      ? faturalar
      : faturalar.filter((fatura) =>
          fatura.musteri.toLowerCase().includes(kelime) ||
          fatura.faturaNo.toLowerCase().includes(kelime)
        )

    const siralanmis = [...filtrelenmis].sort((a, b) => {
      const aDeger = a[siralamaAlani]
      const bDeger = b[siralamaAlani]

      if (aDeger < bDeger) return siralamaYonu === 'asc' ? -1 : 1
      if (aDeger > bDeger) return siralamaYonu === 'asc' ? 1 : -1
      return 0
    })

    return siralanmis
  }, [faturalar, aramaMetni, siralamaAlani, siralamaYonu])

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

  return (
    <div>
      <h1>Fatura Listesi</h1>

      <input
        type="text"
        placeholder="Fatura no / müşteri ara..."
        value={aramaMetni}
        onChange={(e) => setAramaMetni(e.target.value)}
      />

      <ul className={styles.list}>
        <li className={styles.headerRow}>
          <span onClick={() => kolonaTikla('faturaNo')}>Fatura No{okIsareti('faturaNo')}</span>
          <span onClick={() => kolonaTikla('musteri')}>Müşteri{okIsareti('musteri')}</span>
          <span onClick={() => kolonaTikla('duzenlemeTarihi')}>Düzenleme Tarihi{okIsareti('duzenlemeTarihi')}</span>
          <span onClick={() => kolonaTikla('vadeTarihi')}>Vade Tarihi{okIsareti('vadeTarihi')}</span>
          <span onClick={() => kolonaTikla('tutar')}>Tutar{okIsareti('tutar')}</span>
          <span>Tip</span>
          <span>Durum</span>
        </li>
        {gorunenFaturalar.map((fatura) => (
          <InvoiceRow key={fatura.id} fatura={fatura} />
        ))}
      </ul>
    </div>
  )
}

export default App