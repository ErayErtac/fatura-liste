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
    <tr className={styles.row}>
      <td className={styles.faturaNo}>{fatura.faturaNo}</td>
      <td>{fatura.musteri}</td>
      <td>{tarihFormatla(fatura.duzenlemeTarihi)}</td>
      <td>{tarihFormatla(fatura.vadeTarihi)}</td>
      <td className={styles.tutar}>{paraFormatla(fatura.tutar)}</td>
      <td>{fatura.tip}</td>
      <td>
        <span className={`${styles.status} ${durumClass}`}>{fatura.durum}</span>
      </td>
      <td>
        <button
          type="button"
          className={styles.viewButton}
          onClick={() => onGoruntule(fatura)}
          title="Faturayı görüntüle"
        >
          👁 Görüntüle
        </button>
      </td>
    </tr>
  )
}

export default InvoiceRow