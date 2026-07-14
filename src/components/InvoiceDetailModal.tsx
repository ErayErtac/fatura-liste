import Modal from 'react-modal'
import type { Invoice } from '../models/invoice'
import { paraFormatla, tarihFormatla } from '../utils/format'
import styles from './InvoiceDetailModal.module.scss'

interface InvoiceDetailModalProps {
  fatura: Invoice | null
  onClose: () => void
}

function InvoiceDetailModal({ fatura, onClose }: InvoiceDetailModalProps) {
  return (
    <Modal
      isOpen={fatura !== null}
      onRequestClose={onClose}
      contentLabel="Fatura Detayı"
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      className={styles.content}
    >
      {fatura && (
        <div>
          <h2 className={styles.title}>{fatura.faturaNo}</h2>

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
            <span className={styles.label}>Tutar</span>
            <span className={styles.value}>{paraFormatla(fatura.tutar)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Tip</span>
            <span className={styles.value}>{fatura.tip}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Durum</span>
            <span className={styles.value}>{fatura.durum}</span>
          </div>

          <button className={styles.closeButton} onClick={onClose}>
            Kapat
          </button>
        </div>
      )}
    </Modal>
  )
}

export default InvoiceDetailModal