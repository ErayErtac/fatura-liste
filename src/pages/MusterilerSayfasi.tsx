import { useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import MusteriFormModal from '../components/MusteriFormModal'
import type { Musteri } from '../models/customer'
import { useAppDispatch, useAppSelector } from '../store/hook'
import {
  musterileriYukle,
  musteriEkle,
  musteriDuzenle,
  musteriKaldir,
} from '../store/customer/customerSlice'
import styles from './MusterilerSayfasi.module.scss'

function MusterilerSayfasi() {
  const dispatch = useAppDispatch()
  const musteriler = useAppSelector((state) => state.customer.liste)
  const yukleniyor = useAppSelector((state) => state.customer.yukleniyor)
  const hata = useAppSelector((state) => state.customer.hata)

  const [formAcikMi, setFormAcikMi] = useState(false)
  const [duzenlenenMusteri, setDuzenlenenMusteri] = useState<Musteri | null>(null)
  const [silinecekMusteri, setSilinecekMusteri] = useState<Musteri | null>(null)

  useEffect(() => {
    dispatch(musterileriYukle())
  }, [dispatch])

  function yeniMusteriEkle() {
    setDuzenlenenMusteri(null)
    setFormAcikMi(true)
  }

  function musteriyiDuzenle(musteri: Musteri) {
    setDuzenlenenMusteri(musteri)
    setFormAcikMi(true)
  }

  function formuKaydet(degerler: Omit<Musteri, 'id'> & { id?: string }) {
    if (degerler.id) {
      dispatch(musteriDuzenle(degerler as Musteri))
    } else {
      dispatch(musteriEkle({ ...degerler, id: `musteri-${Date.now()}` }))
    }
    setFormAcikMi(false)
  }

  async function silmeyiOnayla() {
    if (!silinecekMusteri) return
    await dispatch(musteriKaldir(silinecekMusteri.id))
    setSilinecekMusteri(null)
  }

  if (yukleniyor) {
    return <div className={styles.durumMesaji}>Yükleniyor...</div>
  }

  if (hata) {
    return <div className={styles.durumMesaji}>{hata}</div>
  }

  return (
    <div>
      <div className={styles.baslikSatiri}>
        <h1>Müşteriler</h1>
        <button type="button" className={styles.yeniButon} onClick={yeniMusteriEkle}>
          + Yeni Müşteri
        </button>
      </div>

      {musteriler.length === 0 ? (
        <p className={styles.durumMesaji}>Henüz müşteri eklenmemiş.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Müşteri Adı</th>
                <th>E-posta</th>
                <th>Telefon</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {musteriler.map((musteri) => (
                <tr key={musteri.id}>
                  <td>{musteri.ad}</td>
                  <td>{musteri.email}</td>
                  <td>{musteri.telefon}</td>
                  <td className={styles.islemHucresi}>
                    <button type="button" onClick={() => musteriyiDuzenle(musteri)}>
                      ✎ Düzenle
                    </button>
                    <button type="button" onClick={() => setSilinecekMusteri(musteri)}>
                      🗑 Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MusteriFormModal
        acikMi={formAcikMi}
        duzenlenenMusteri={duzenlenenMusteri}
        onKaydet={formuKaydet}
        onKapat={() => setFormAcikMi(false)}
      />

      <ConfirmDialog
        acikMi={silinecekMusteri !== null}
        baslik="Müşteriyi Sil"
        mesaj={silinecekMusteri ? `"${silinecekMusteri.ad}" adlı müşteriyi silmek istediğinize emin misiniz?` : ''}
        onOnayla={silmeyiOnayla}
        onVazgec={() => setSilinecekMusteri(null)}
      />
    </div>
  )
}

export default MusterilerSayfasi