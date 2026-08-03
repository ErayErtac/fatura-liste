import { useRef } from 'react'
import { Formik, Form, FieldArray } from 'formik'
import type { FaturaKalemi } from '../models/invoice'
import styles from './YeniFaturaSayfasi.module.scss'

interface YeniFaturaFormValues {
  kalemler: FaturaKalemi[]
}

function bosKalem(id: string): FaturaKalemi {
  return { id, aciklama: '', miktar: 1, birimFiyat: 0 }
}

function YeniFaturaSayfasi() {
  const kalemSayaci = useRef(0)

  function yeniKalemId() {
    kalemSayaci.current += 1
    return `kalem-${kalemSayaci.current}`
  }

  const baslangicDegerleri: YeniFaturaFormValues = {
    kalemler: [bosKalem('kalem-0')],
  }

  return (
    <div>
      <h1>Yeni Fatura</h1>

      <Formik
        initialValues={baslangicDegerleri}
        onSubmit={(degerler) => {
          console.log(degerler)
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className={styles.form}>
            <FieldArray name="kalemler">
              {({ push, remove }) => (
                <div className={styles.kalemler}>
                  <div className={styles.kalemBaslik}>
                    <span>Açıklama</span>
                    <span>Miktar</span>
                    <span>Birim Fiyat</span>
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
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default YeniFaturaSayfasi