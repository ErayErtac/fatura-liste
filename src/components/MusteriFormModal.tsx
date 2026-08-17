import Modal from 'react-modal'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import type { Musteri } from '../models/customer'
import styles from './MusteriFormModal.module.scss'

interface MusteriFormModalProps {
  acikMi: boolean
  duzenlenenMusteri: Musteri | null
  onKaydet: (musteri: Omit<Musteri, 'id'> & { id?: string }) => void
  onKapat: () => void
}

interface FormDegerleri {
  ad: string
  email: string
  telefon: string
}

const dogrulamaSemasi = Yup.object({
  ad: Yup.string().required('Müşteri adı gerekli'),
  email: Yup.string().email('Geçerli bir e-posta girin').required('E-posta gerekli'),
  telefon: Yup.string().required('Telefon gerekli'),
})

function MusteriFormModal({ acikMi, duzenlenenMusteri, onKaydet, onKapat }: MusteriFormModalProps) {
  const baslangicDegerleri: FormDegerleri = {
    ad: duzenlenenMusteri?.ad ?? '',
    email: duzenlenenMusteri?.email ?? '',
    telefon: duzenlenenMusteri?.telefon ?? '',
  }

  return (
    <Modal
      isOpen={acikMi}
      onRequestClose={onKapat}
      ariaHideApp={false}
      overlayClassName={styles.overlay}
      className={styles.content}
    >
      <h2 className={styles.baslik}>{duzenlenenMusteri ? 'Müşteri Düzenle' : 'Yeni Müşteri'}</h2>

      <Formik
        enableReinitialize
        initialValues={baslangicDegerleri}
        validationSchema={dogrulamaSemasi}
        onSubmit={(degerler) => {
          onKaydet({ ...degerler, id: duzenlenenMusteri?.id })
        }}
      >
        {({ values, errors, handleChange }) => (
          <Form className={styles.form}>
            <div className={styles.field}>
              <label>Müşteri Adı</label>
              <input type="text" name="ad" value={values.ad} onChange={handleChange} />
              {errors.ad && <span className={styles.error}>{errors.ad}</span>}
            </div>

            <div className={styles.field}>
              <label>E-posta</label>
              <input type="text" name="email" value={values.email} onChange={handleChange} />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label>Telefon</label>
              <input type="text" name="telefon" value={values.telefon} onChange={handleChange} />
              {errors.telefon && <span className={styles.error}>{errors.telefon}</span>}
            </div>

            <div className={styles.butonlar}>
              <button type="button" onClick={onKapat} className={styles.vazgecButon}>
                Vazgeç
              </button>
              <button type="submit" className={styles.kaydetButon}>
                Kaydet
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default MusteriFormModal