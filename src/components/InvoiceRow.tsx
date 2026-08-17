import type { Invoice } from '../models/invoice'
import { paraFormatla, tarihFormatla } from '../utils/format'
import styles from './InvoiceRow.module.scss'
import { Link } from 'react-router-dom'

interface InvoiceRowProps {
  fatura: Invoice
  onGoruntule: (fatura: Invoice) => void
  onSilmeTalebi: (fatura: Invoice) => void
}

function InvoiceRow({ fatura, onGoruntule, onSilmeTalebi }: InvoiceRowProps) {
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
      <td className={styles.islemHucresi}>
        <button
          type="button"
          className={styles.viewButton}
          onClick={() => onGoruntule(fatura)}
          title="Faturayı görüntüle"
        >
          👁 Görüntüle
        </button>
        <Link to={`/fatura-duzenle/${fatura.id}`} className={styles.editButton} title="Faturayı düzenle">
          ✎ Düzenle
        </Link>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onSilmeTalebi(fatura)}
          title="Faturayı sil"
        >
          🗑
        </button>
      </td>
    </tr>
  )
}

export default InvoiceRow