import type { Invoice } from '../models/invoice'
import { paraFormatla, tarihFormatla } from '../utils/format'
import styles from './InvoiceRow.module.scss'

interface InvoiceRowProps {
  fatura: Invoice
  onGoruntule: (fatura: Invoice) => void
}

function InvoiceRow({ fatura, onGoruntule }: InvoiceRowProps) {
  const durumClass =
    fatura.durum === 'Ödendi' ? styles.paid :
    fatura.durum === 'Gecikmiş' ? styles.overdue :
    styles.pending

  return (
    <li className={styles.row}>
      <span>{fatura.faturaNo}</span>
      <span>{fatura.musteri}</span>
      <span>{tarihFormatla(fatura.duzenlemeTarihi)}</span>
      <span>{tarihFormatla(fatura.vadeTarihi)}</span>
      <span>{paraFormatla(fatura.tutar)}</span>
      <span>{fatura.tip}</span>
      <span className={durumClass}>
        <span className={styles.status}>{fatura.durum}</span>
      </span>
      <span>
        <button
          type="button"
          className={styles.viewButton}
          onClick={() => onGoruntule(fatura)}
          title="Faturayı görüntüle"
        >
          👁 Görüntüle
        </button>
      </span>
    </li>
  )
}

export default InvoiceRow