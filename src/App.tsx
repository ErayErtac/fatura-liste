import { useMemo, useState } from 'react'
import InvoiceRow from './components/InvoiceRow'
import type { Invoice } from './models/invoice'
import { mockInvoices } from './data/mockInvoices'
import styles from './App.module.scss'
import './App.css'

function App() {
  const [faturalar] = useState<Invoice[]>(mockInvoices)
  const [aramaMetni, setAramaMetni] = useState('')

  const filtrelenmisFaturalar = useMemo(() => {
    const kelime = aramaMetni.trim().toLowerCase()
    if (kelime === '') return faturalar

    return faturalar.filter((fatura) =>
      fatura.musteri.toLowerCase().includes(kelime) ||
      fatura.faturaNo.toLowerCase().includes(kelime)
    )
  }, [faturalar, aramaMetni])

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
          <span>Fatura No</span>
          <span>Müşteri</span>
          <span>Düzenleme Tarihi</span>
          <span>Vade Tarihi</span>
          <span>Tutar</span>
          <span>Tip</span>
          <span>Durum</span>
        </li>
        {filtrelenmisFaturalar.map((fatura) => (
          <InvoiceRow key={fatura.id} fatura={fatura} />
        ))}
      </ul>
    </div>
  )
}

export default App