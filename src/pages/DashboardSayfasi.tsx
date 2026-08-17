import { useEffect, useMemo } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { faturalariYukle } from '../store/invoice/invoiceSlice'
import { paraFormatla } from '../utils/format'
import styles from './DashboardSayfasi.module.scss'

const AY_ISIMLERI = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
]

const DURUM_RENKLERI: Record<string, string> = {
  Ödendi: '#4caf50',
  Bekliyor: '#f0ad4e',
  Gecikmiş: '#d9534f',
}

function DashboardSayfasi() {
  const dispatch = useAppDispatch()
  const faturalar = useAppSelector((state) => state.invoice.liste)

  useEffect(() => {
    dispatch(faturalariYukle())
  }, [dispatch])

  const aylikVeri = useMemo(() => {
    const gruplar: Record<string, { ay: string; satis: number; alis: number }> = {}

    faturalar.forEach((fatura) => {
      const ayIndex = new Date(fatura.duzenlemeTarihi).getMonth()
      const anahtar = AY_ISIMLERI[ayIndex]

      if (!gruplar[anahtar]) {
        gruplar[anahtar] = { ay: anahtar, satis: 0, alis: 0 }
      }

      if (fatura.tip === 'Satış') {
        gruplar[anahtar].satis += fatura.tutar
      } else {
        gruplar[anahtar].alis += fatura.tutar
      }
    })

    return AY_ISIMLERI
      .map((ay) => gruplar[ay])
      .filter((grup) => grup !== undefined)
  }, [faturalar])

  const durumVerisi = useMemo(() => {
    const sayaclar: Record<string, number> = { Ödendi: 0, Bekliyor: 0, Gecikmiş: 0 }
    faturalar.forEach((fatura) => {
      sayaclar[fatura.durum] += 1
    })
    return Object.entries(sayaclar).map(([durum, adet]) => ({ durum, adet }))
  }, [faturalar])

  return (
    <div>
      <h1>Dashboard</h1>

      <div className={styles.gridAlan}>
        <div className={styles.kart}>
          <h2 className={styles.kartBaslik}>Aylara Göre Satış / Alış</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={aylikVeri}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E1B1" />
              <XAxis dataKey="ay" />
              <YAxis tickFormatter={(deger) => `${(Number(deger) / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(deger) => paraFormatla(Number(deger))} />
              <Legend />
              <Bar dataKey="satis" name="Satış" fill="#306D29" radius={[4, 4, 0, 0]} />
              <Bar dataKey="alis" name="Alış" fill="#E7E1B1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.kart}>
          <h2 className={styles.kartBaslik}>Durum Dağılımı</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={durumVerisi}
                dataKey="adet"
                nameKey="durum"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, value }) => `${name}: ${value}`}
            >
                {durumVerisi.map((girdi) => (
                  <Cell key={girdi.durum} fill={DURUM_RENKLERI[girdi.durum]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardSayfasi