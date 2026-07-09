import type { Invoice } from '../models/invoice'

interface InvoiceRowProps {
  fatura: Invoice
}

function InvoiceRow({ fatura }: InvoiceRowProps) {
  return (
    <li>
      {fatura.musteri} - {fatura.tutar} ₺ - {fatura.odendiMi ? 'Ödendi' : 'Bekliyor'}
    </li>
  )
}

export default InvoiceRow