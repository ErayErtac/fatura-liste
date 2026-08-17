import Modal from 'react-modal'
import styles from './ConfirmDialog.module.scss'

interface ConfirmDialogProps {
  acikMi: boolean
  baslik: string
  mesaj: string
  onOnayla: () => void
  onVazgec: () => void
}

function ConfirmDialog({ acikMi, baslik, mesaj, onOnayla, onVazgec }: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={acikMi}
      onRequestClose={onVazgec}
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      className={styles.content}
    >
      <h3 className={styles.baslik}>{baslik}</h3>
      <p className={styles.mesaj}>{mesaj}</p>
      <div className={styles.butonlar}>
        <button type="button" className={styles.vazgecButon} onClick={onVazgec}>
          Vazgeç
        </button>
        <button type="button" className={styles.onaylaButon} onClick={onOnayla}>
          Sil
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmDialog