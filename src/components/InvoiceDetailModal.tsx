import Modal from 'react-modal'
import type { Invoice } from '../models/invoice'
import { paraFormatla, tarihFormatla } from '../utils/format'
import styles from './InvoiceDetailModal.module.scss'

interface InvoiceDetailModalProps {
  fatura: Invoice | null
  onClose: () => void
}

function InvoiceDetailModal({ fatura, onClose }: InvoiceDetailModalProps) {
  if (!fatura) {
    return (
      <Modal
        isOpen={false}
        onRequestClose={onClose}
        ariaHideApp={false}
        overlayClassName={styles.overlay}
        className={styles.content}
      >
        <div />
      </Modal>
    )
  }

  const durumClass =
    fatura.durum === 'Ödendi' ? styles.paid :
    fatura.durum === 'Gecikmiş' ? styles.overdue :
    styles.pending

  return (
    <Modal
      isOpen={fatura !== null}
      onRequestClose={onClose}
      contentLabel="Fatura Detayı"
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      className={styles.content}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.companyName}>Önizleme</div>
          <div className={styles.companyTagline}>Fatura Detayı</div>
        </div>
        <div className={styles.invoiceNo}>
          <div className={styles.invoiceLabel}>Fatura No</div>
          {fatura.faturaNo}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.row}>
            <span className={styles.label}>Müşteri</span>
            <span className={styles.value}>{fatura.musteri}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Düzenleme Tarihi</span>
            <span className={styles.value}>{tarihFormatla(fatura.duzenlemeTarihi)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Vade Tarihi</span>
            <span className={styles.value}>{tarihFormatla(fatura.vadeTarihi)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fatura Tipi</span>
            <span className={styles.value}>{fatura.tip}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Durum</span>
            <span className={`${styles.statusBadge} ${durumClass}`}>{fatura.durum}</span>
          </div>
        </div>

        {fatura.kalemler && fatura.kalemler.length > 0 && (
        <div className={styles.kalemDokumu}>
          <div className={styles.kalemDokumuBaslik}>Kalemler</div>
          {fatura.kalemler.map((kalem) => (
            <div className={styles.kalemDokumuSatiri} key={kalem.id}>
              <span>{kalem.aciklama}</span>
              <span>{kalem.miktar} × {paraFormatla(kalem.birimFiyat)}</span>
            </div>
          ))}
        </div>
        )}

        <hr className={styles.divider} />

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Toplam</span>
          <span className={styles.totalValue}>{paraFormatla(fatura.tutar)}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.closeButton} onClick={onClose}>
          Kapat
        </button>
      </div>
    </Modal>
  )
}

export default InvoiceDetailModal