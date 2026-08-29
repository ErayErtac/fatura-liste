import { useMemo } from 'react'
import { useAppSelector } from '../store/hook'
import styles from './VadeUyarisi.module.scss'

function gunFarkiHesapla(tarih: string): number {
  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)
  const hedefTarih = new Date(tarih)
  const farkMs = hedefTarih.getTime() - bugun.getTime()
  return Math.round(farkMs / (1000 * 60 * 60 * 24))
}

function VadeUyarisi() {
  const faturalar = useAppSelector((state) => state.invoice.liste)

  const { gecikenler, yaklasanlar } = useMemo(() => {
    const bekleyenler = faturalar.filter((f) => f.durum === 'Bekliyor' || f.durum === 'Gecikmiş')

    const gecikenler = bekleyenler.filter((f) => gunFarkiHesapla(f.vadeTarihi) < 0)
    const yaklasanlar = bekleyenler.filter((f) => {
      const fark = gunFarkiHesapla(f.vadeTarihi)
      return fark >= 0 && fark <= 7
    })

    return { gecikenler, yaklasanlar }
  }, [faturalar])

  if (gecikenler.length === 0 && yaklasanlar.length === 0) {
    return null
  }

  return (
    <div className={styles.uyariKutusu}>
      {gecikenler.length > 0 && (
        <div className={`${styles.satir} ${styles.gecikenSatir}`}>
          ⚠ {gecikenler.length} faturanın vadesi geçmiş.
        </div>
      )}
      {yaklasanlar.length > 0 && (
        <div className={`${styles.satir} ${styles.yaklasanSatir}`}>
          ⏰ {yaklasanlar.length} faturanın vadesi önümüzdeki 7 gün içinde doluyor.
        </div>
      )}
    </div>
  )
}

export default VadeUyarisi