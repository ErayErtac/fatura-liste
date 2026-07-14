import { useState } from 'react'
import InvoiceRow from './components/InvoiceRow'
import type { Invoice } from './models/invoice'
import { mockInvoices } from './data/mockInvoices'
import './App.css'

function App() {
  const [faturalar] = useState<Invoice[]>(mockInvoices)

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