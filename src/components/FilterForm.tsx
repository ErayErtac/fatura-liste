import { bosFiltre } from './filterDefaults'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './FilterForm.module.scss'

export interface FilterValues {
  baslangicTarihi: Date | null
  bitisTarihi: Date | null
  musteri: string
  durum: string
  tip: string
  aramaMetni: string
}

interface FilterFormProps {
  musteriler: string[]
  onFiltrele: (degerler: FilterValues) => void
}

const dogrulamaSemasi = Yup.object({
  bitisTarihi: Yup.date()
    .nullable()
    .min(Yup.ref('baslangicTarihi'), 'Bitiş tarihi başlangıçtan önce olamaz'),
})

function FilterForm({ musteriler, onFiltrele }: FilterFormProps) {
  const musteriSecenekleri = [
    { value: '', label: 'Tümü' },
    ...musteriler.map((m) => ({ value: m, label: m })),
  ]
  const durumSecenekleri = [
    { value: '', label: 'Tümü' },
    { value: 'Ödendi', label: 'Ödendi' },
    { value: 'Bekliyor', label: 'Bekliyor' },
    { value: 'Gecikmiş', label: 'Gecikmiş' },
  ]
  const tipSecenekleri = [
    { value: '', label: 'Tümü' },
    { value: 'Satış', label: 'Satış' },
    { value: 'Alış', label: 'Alış' },
  ]

  return (
    <Formik
      initialValues={bosFiltre}
      validationSchema={dogrulamaSemasi}
      onSubmit={(degerler) => onFiltrele(degerler)}
    >
      {({ values, setFieldValue, resetForm, errors }) => (
        <Form className={styles.form}>
          <div className={styles.field}>
            <label>Başlangıç Tarihi</label>
            <DatePicker
                selected={values.baslangicTarihi}
                onChange={(tarih: Date | null) => setFieldValue('baslangicTarihi', tarih)}
                dateFormat="dd.MM.yyyy"
                isClearable
                placeholderText="Seç..."
            />
          </div>

          <div className={styles.field}>
            <label>Bitiş Tarihi</label>
            <DatePicker
                selected={values.bitisTarihi}
                onChange={(tarih: Date | null) => setFieldValue('bitisTarihi', tarih)}
                dateFormat="dd.MM.yyyy"
                isClearable
                placeholderText="Seç..."
            />
            {errors.bitisTarihi && (
              <span className={styles.error}>{String(errors.bitisTarihi)}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Müşteri</label>
            <Select
              options={musteriSecenekleri}
              value={musteriSecenekleri.find((s) => s.value === values.musteri)}
              onChange={(secim) => setFieldValue('musteri', secim?.value ?? '')}
            />
          </div>

          <div className={styles.field}>
            <label>Durum</label>
            <Select
              options={durumSecenekleri}
              value={durumSecenekleri.find((s) => s.value === values.durum)}
              onChange={(secim) => setFieldValue('durum', secim?.value ?? '')}
            />
          </div>

          <div className={styles.field}>
            <label>Tip</label>
            <Select
              options={tipSecenekleri}
              value={tipSecenekleri.find((s) => s.value === values.tip)}
              onChange={(secim) => setFieldValue('tip', secim?.value ?? '')}
            />
          </div>

          <div className={styles.field}>
            <label>Ara</label>
            <input
              type="text"
              placeholder="Fatura no / müşteri..."
              value={values.aramaMetni}
              onChange={(e) => setFieldValue('aramaMetni', e.target.value)}
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit">Filtrele</button>
            <button
              type="button"
              onClick={() => {
                resetForm()
                onFiltrele(bosFiltre)
              }}
            >
              Temizle
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default FilterForm