import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { FaturaKalemi, FaturaTipi, Invoice } from '../models/invoice'
import { paraFormatla } from '../utils/format'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { faturaEkle } from '../store/invoice/invoiceSlice'
import styles from './YeniFaturaSayfasi.module.scss'

interface YeniFaturaFormValues {
  musteri: string
  duzenlemeTarihi: Date | null
  vadeTarihi: Date | null
  tip: FaturaTipi | ''
  kalemler: FaturaKalemi[]
}

function bosKalem(id: string): FaturaKalemi {
  return { id, aciklama: '', miktar: 1, birimFiyat: 0 }
}

function genelToplamHesapla(kalemler: FaturaKalemi[]): number {
  return kalemler.reduce((toplam, kalem) => toplam + kalem.miktar * kalem.birimFiyat, 0)
}

const dogrulamaSemasi = Yup.object({
  musteri: Yup.string().required('Müşteri seçilmeli'),
  duzenlemeTarihi: Yup.date().nullable().required('Düzenleme tarihi seçilmeli'),
  vadeTarihi: Yup.date()
    .nullable()
    .required('Vade tarihi seçilmeli')
    .min(Yup.ref('duzenlemeTarihi'), 'Vade tarihi düzenleme tarihinden önce olamaz'),
  tip: Yup.string().required('Fatura tipi seçilmeli'),
  kalemler: Yup.array()
    .of(
      Yup.object({
        aciklama: Yup.string().required('Açıklama gerekli'),
        miktar: Yup.number().min(1, 'En az 1 olmalı'),
        birimFiyat: Yup.number().min(0, 'Negatif olamaz'),
      })
    )
    .min(1, 'En az bir kalem eklenmeli'),
})

function YeniFaturaSayfasi() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const faturalar = useAppSelector((state) => state.invoice.liste)
  const kalemSayaci = useRef(0)

  const musteriler = Array.from(new Set(faturalar.map((f) => f.musteri))).sort()
  const musteriSecenekleri = musteriler.map((m) => ({ value: m, label: m }))
  const tipSecenekleri = [
    { value: 'Satış', label: 'Satış' },
    { value: 'Alış', label: 'Alış' },
  ]

  function yeniKalemId() {
    kalemSayaci.current += 1
    return `kalem-${kalemSayaci.current}`
  }

  const baslangicDegerleri: YeniFaturaFormValues = {
    musteri: '',
    duzenlemeTarihi: null,
    vadeTarihi: null,
    tip: '',
    kalemler: [bosKalem('kalem-0')],
  }

  return (
    <div>
      <h1>Yeni Fatura</h1>

      <Formik
        initialValues={baslangicDegerleri}
        validationSchema={dogrulamaSemasi}
        onSubmit={async (degerler, { setSubmitting }) => {
          const yeniFatura: Invoice = {
            id: `inv-${Date.now()}`,
            faturaNo: `FTR2026${String(faturalar.length + 1).padStart(4, '0')}`,
            musteri: degerler.musteri,
            duzenlemeTarihi: degerler.duzenlemeTarihi!.toISOString().slice(0, 10),
            vadeTarihi: degerler.vadeTarihi!.toISOString().slice(0, 10),
            tutar: genelToplamHesapla(degerler.kalemler),
            tip: degerler.tip as FaturaTipi,
            durum: 'Bekliyor',
            kalemler: degerler.kalemler,
          }

          try {
            await dispatch(faturaEkle(yeniFatura)).unwrap()
            navigate('/')
          } catch {
            setSubmitting(false)
            alert('Fatura kaydedilirken bir hata oluştu. json-server çalışıyor mu?')
          }
        }}
      >
        {({ values, errors, setFieldValue, isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.baslikForm}>
              <div className={styles.field}>
                <label>Müşteri</label>
                <Select
                  options={musteriSecenekleri}
                  value={musteriSecenekleri.find((s) => s.value === values.musteri) ?? null}
                  onChange={(secim) => setFieldValue('musteri', secim?.value ?? '')}
                  placeholder="Seç..."
                />
                {errors.musteri && <span className={styles.error}>{errors.musteri}</span>}
              </div>

              <div className={styles.field}>
                <label>Düzenleme Tarihi</label>
                <DatePicker
                  selected={values.duzenlemeTarihi}
                  onChange={(tarih: Date | null) => setFieldValue('duzenlemeTarihi', tarih)}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Seç..."
                />
                {errors.duzenlemeTarihi && <span className={styles.error}>{String(errors.duzenlemeTarihi)}</span>}
              </div>

              <div className={styles.field}>
                <label>Vade Tarihi</label>
                <DatePicker
                  selected={values.vadeTarihi}
                  onChange={(tarih: Date | null) => setFieldValue('vadeTarihi', tarih)}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Seç..."
                />
                {errors.vadeTarihi && <span className={styles.error}>{String(errors.vadeTarihi)}</span>}
              </div>

              <div className={styles.field}>
                <label>Fatura Tipi</label>
                <Select
                  options={tipSecenekleri}
                  value={tipSecenekleri.find((s) => s.value === values.tip) ?? null}
                  onChange={(secim) => setFieldValue('tip', secim?.value ?? '')}
                  placeholder="Seç..."
                />
                {errors.tip && <span className={styles.error}>{errors.tip}</span>}
              </div>
            </div>

            <FieldArray name="kalemler">
              {({ push, remove }) => (
                <div className={styles.kalemler}>
                  <div className={styles.kalemBaslik}>
                    <span>Açıklama</span>
                    <span>Miktar</span>
                    <span>Birim Fiyat</span>
                    <span>Tutar</span>
                    <span></span>
                  </div>

                  {values.kalemler.map((kalem, index) => (
                    <div className={styles.kalemSatiri} key={kalem.id}>
                      <input
                        type="text"
                        placeholder="Ürün / hizmet açıklaması"
                        value={kalem.aciklama}
                        onChange={(e) => setFieldValue(`kalemler.${index}.aciklama`, e.target.value)}
                      />
                      <input
                        type="number"
                        min={1}
                        value={kalem.miktar}
                        onChange={(e) => setFieldValue(`kalemler.${index}.miktar`, Number(e.target.value))}
                      />
                      <input
                        type="number"
                        min={0}
                        value={kalem.birimFiyat}
                        onChange={(e) => setFieldValue(`kalemler.${index}.birimFiyat`, Number(e.target.value))}
                      />
                      <span className={styles.satirTutari}>
                        {paraFormatla(kalem.miktar * kalem.birimFiyat)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={values.kalemler.length === 1}
                      >
                        Sil
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className={styles.satirEkleButon}
                    onClick={() => push(bosKalem(yeniKalemId()))}
                  >
                    + Satır Ekle
                  </button>

                  {typeof errors.kalemler === 'string' && (
                    <div className={styles.error}>{errors.kalemler}</div>
                  )}
                </div>
              )}
            </FieldArray>

            <div className={styles.genelToplam}>
              <span>Genel Toplam</span>
              <span className={styles.genelToplamTutar}>
                {paraFormatla(genelToplamHesapla(values.kalemler))}
              </span>
            </div>

            <button type="submit" className={styles.kaydetButon} disabled={isSubmitting}>
              {isSubmitting ? 'Kaydediliyor...' : 'Faturayı Kaydet'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default YeniFaturaSayfasi