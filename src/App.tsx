import { useState } from 'react'
import InvoiceRow from './components/InvoiceRow'
import type { Invoice } from './models/invoice'
import './App.css'

function App() {
  const [faturalar] = useState<Invoice[]>([
    { id: 'FTR-2026-0001', musteri: 'Ege Elektronik', tutar: 1500, odendiMi: false },
    { id: 'FTR-2026-0002', musteri: 'Kaya Otomotiv', tutar: 3200, odendiMi: true },
    { id: 'FTR-2026-0003', musteri: 'Mavi Lojistik A.Ş.', tutar: 890, odendiMi: false },
  ])

  return (
    <div>
      <h1>Fatura Listesi</h1>
      <ul>
        {faturalar.map((fatura) => (
          <InvoiceRow key={fatura.id} fatura={fatura} />
        ))}
      </ul>
    </div>
  )
}

export default App