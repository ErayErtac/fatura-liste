import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { FaturaKalemi, FaturaTipi, Invoice } from '../models/invoice'
import { paraFormatla } from '../utils/format'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { faturaEkle, faturaDuzenle } from '../store/invoice/invoiceSlice'
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
  const { id } = useParams<{ id: string }>()
  const duzenlemeModu = Boolean(id)

  const faturalar = useAppSelector((state) => state.invoice.liste)
  const duzenlenenFatura = duzenlemeModu ? faturalar.find((f) => f.id === id) : undefined

  const kalemSayaci = useRef(0)

  function yeniKalemId() {
    kalemSayaci.current += 1
    return `kalem-${kalemSayaci.current}`
  }

  const musteriler = Array.from(new Set(faturalar.map((f) => f.musteri))).sort()
  const musteriSecenekleri = musteriler.map((m) => ({ value: m, label: m }))
  const tipSecenekleri = [
    { value: 'Satış', label: 'Satış' },
    { value: 'Alış', label: 'Alış' },
  ]

  // Düzenleme modundaysak ve fatura bulunduysa, formu onunla doldur.
  // Eski (kalemsiz) faturalarda tek bir "Genel" kalem oluşturup mevcut tutarı koruyoruz.
  const baslangicDegerleri: YeniFaturaFormValues = duzenlenenFatura
    ? {
        musteri: duzenlenenFatura.musteri,
        duzenlemeTarihi: new Date(duzenlenenFatura.duzenlemeTarihi),
        vadeTarihi: new Date(duzenlenenFatura.vadeTarihi),
        tip: duzenlenenFatura.tip,
        kalemler:
          duzenlenenFatura.kalemler && duzenlenenFatura.kalemler.length > 0
            ? duzenlenenFatura.kalemler
            : [{ id: 'kalem-0', aciklama: 'Genel', miktar: 1, birimFiyat: duzenlenenFatura.tutar }],
      }
    : {
        musteri: '',
        duzenlemeTarihi: null,
        vadeTarihi: null,
        tip: '',
        kalemler: [bosKalem('kalem-0')],
      }

  if (duzenlemeModu && !duzenlenenFatura) {
    return (
      <div>
        <h1>Fatura Bulunamadı</h1>
        <p>Düzenlemek istediğiniz fatura bulunamadı. Liste yüklenmemiş ya da fatura silinmiş olabilir.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>{duzenlemeModu ? `Fatura Düzenle — ${duzenlenenFatura!.faturaNo}` : 'Yeni Fatura'}</h1>

      <Formik
        enableReinitialize
        initialValues={baslangicDegerleri}
        validationSchema={dogrulamaSemasi}
        onSubmit={async (degerler, { setSubmitting }) => {
          const guncelFatura: Invoice = {
            id: duzenlemeModu ? duzenlenenFatura!.id : `inv-${Date.now()}`,
            faturaNo: duzenlemeModu ? duzenlenenFatura!.faturaNo : `FTR2026${String(faturalar.length + 1).padStart(4, '0')}`,
            musteri: degerler.musteri,
            duzenlemeTarihi: degerler.duzenlemeTarihi!.toISOString().slice(0, 10),
            vadeTarihi: degerler.vadeTarihi!.toISOString().slice(0, 10),
            tutar: genelToplamHesapla(degerler.kalemler),
            tip: degerler.tip as FaturaTipi,
            durum: duzenlemeModu ? duzenlenenFatura!.durum : 'Bekliyor',
            kalemler: degerler.kalemler,
          }

          try {
            if (duzenlemeModu) {
              await dispatch(faturaDuzenle(guncelFatura)).unwrap()
            } else {
              await dispatch(faturaEkle(guncelFatura)).unwrap()
            }
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
                  className={styles.dateInput}
                  wrapperClassName={styles.dateWrapper}
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
                  className={styles.dateInput}
                  wrapperClassName={styles.dateWrapper}
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
                        onChange={(e) => {
                          const temiz = e.target.value.replace(/^0+(?=\d)/, '')
                          setFieldValue(`kalemler.${index}.miktar`, temiz === '' ? 0 : Number(temiz))
                        }}
                      />
                      <input
                        type="number"
                        min={0}
                        value={kalem.birimFiyat}
                        onChange={(e) => {
                          const temiz = e.target.value.replace(/^0+(?=\d)/, '')
                          setFieldValue(`kalemler.${index}.birimFiyat`, temiz === '' ? 0 : Number(temiz))
                        }}
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
              {isSubmitting ? 'Kaydediliyor...' : duzenlemeModu ? 'Değişiklikleri Kaydet' : 'Faturayı Kaydet'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default YeniFaturaSayfasi