import type { Invoice } from '../models/invoice'
import { paraFormatla } from '../utils/format'
import styles from './SummaryCards.module.scss'
import { useTranslation } from 'react-i18next'

interface SummaryCardsProps {
  faturalar: Invoice[]
}

function SummaryCards({ faturalar }: SummaryCardsProps) {
  const toplamAdet = faturalar.length

  const toplamTutar = faturalar.reduce((toplam, fatura) => toplam + fatura.tutar, 0)

  const gecikenFaturalar = faturalar.filter((fatura) => fatura.durum === 'Gecikmiş')
  const gecikenTutar = gecikenFaturalar.reduce((toplam, fatura) => toplam + fatura.tutar, 0)
  const gecikenAdet = gecikenFaturalar.length
  const { t } = useTranslation()

  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.icon}>🧾</div>
        <div className={styles.info}>
          <div className={styles.label}>{t('ozet.toplamFatura')}</div>
          <div className={styles.value}>{toplamAdet} adet</div>
          <div className={styles.hint}>{t('ozet.seciliDonem')}</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.icon}>💰</div>
        <div className={styles.info}>
          <div className={styles.label}>{t('ozet.toplamTutar')}</div>
          <div className={styles.value}>{paraFormatla(toplamTutar)}</div>
          <div className={styles.hint}>{t('ozet.kdvDahil')}</div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.overdueCard}`}>
        <div className={styles.icon}>⏰</div>
        <div className={styles.info}>
          <div className={styles.label}>{t('ozet.gecikenTutar')}</div>
          <div className={styles.value}>{paraFormatla(gecikenTutar)}</div>
          <div className={styles.hint}>{t('ozet.gecikenFaturalar', { count: gecikenAdet })}</div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCards