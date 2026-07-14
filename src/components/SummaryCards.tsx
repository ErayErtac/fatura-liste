import type { Invoice } from '../models/invoice'
import { paraFormatla } from '../utils/format'
import styles from './SummaryCards.module.scss'

interface SummaryCardsProps {
  faturalar: Invoice[]
}

function SummaryCards({ faturalar }: SummaryCardsProps) {
  const toplamAdet = faturalar.length

  const toplamTutar = faturalar.reduce((toplam, fatura) => toplam + fatura.tutar, 0)

  const gecikenTutar = faturalar
    .filter((fatura) => fatura.durum === 'Gecikmiş')
    .reduce((toplam, fatura) => toplam + fatura.tutar, 0)

  const gecikenAdet = faturalar.filter((fatura) => fatura.durum === 'Gecikmiş').length

  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.label}>Toplam Fatura</div>
        <div className={styles.value}>{toplamAdet} adet</div>
        <div className={styles.hint}>Seçili dönem</div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Toplam Tutar</div>
        <div className={styles.value}>{paraFormatla(toplamTutar)}</div>
        <div className={styles.hint}>KDV dahil</div>
      </div>

      <div className={`${styles.card} ${styles.overdueCard}`}>
        <div className={styles.label}>Geciken Tutar</div>
        <div className={styles.value}>{paraFormatla(gecikenTutar)}</div>
        <div className={styles.hint}>{gecikenAdet} fatura vadesi geçmiş</div>
      </div>
    </div>
  )
}

export default SummaryCards