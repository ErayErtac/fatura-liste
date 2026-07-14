import Modal from 'react-modal'
import type { Invoice } from '../models/invoice'
import { paraFormatla, tarihFormatla } from '../utils/format'

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
    >
      {fatura && (
        <div>
          <h2>{fatura.faturaNo}</h2>
          <p><strong>Müşteri:</strong> {fatura.musteri}</p>
          <p><strong>Düzenleme Tarihi:</strong> {tarihFormatla(fatura.duzenlemeTarihi)}</p>
          <p><strong>Vade Tarihi:</strong> {tarihFormatla(fatura.vadeTarihi)}</p>
          <p><strong>Tutar:</strong> {paraFormatla(fatura.tutar)}</p>
          <p><strong>Tip:</strong> {fatura.tip}</p>
          <p><strong>Durum:</strong> {fatura.durum}</p>
          <button onClick={onClose}>Kapat</button>
        </div>
      )}
    </Modal>
  )
}

export default InvoiceDetailModal