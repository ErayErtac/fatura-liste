import { useEffect } from 'react'
import { List } from 'react-window'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { faturalariYukle } from '../store/invoice/invoiceSlice'
import { paraFormatla, tarihFormatla } from '../utils/format'
import type { Invoice } from '../models/invoice'
import styles from './TumFaturalarSayfasi.module.scss'

interface SatirProps {
  index?: number
  style?: React.CSSProperties
  faturalar: Invoice[]
}

function Satir({ index, style, faturalar }: SatirProps) {
  const fatura = faturalar[index ?? 0]
  return (
    <div className={styles.satir} style={style}>
      <span>{fatura.faturaNo}</span>
      <span>{fatura.musteri}</span>
      <span>{tarihFormatla(fatura.duzenlemeTarihi)}</span>
      <span>{paraFormatla(fatura.tutar)}</span>
      <span>{fatura.durum}</span>
    </div>
  )
}

function TumFaturalarSayfasi() {
  const dispatch = useAppDispatch()
  const faturalar = useAppSelector((state) => state.invoice.liste)

  useEffect(() => {
    dispatch(faturalariYukle())
  }, [dispatch])

  return (
    <div>
      <h1>Tüm Faturalar ({faturalar.length} kayıt)</h1>

      <div className={styles.listeKapsayici}>
        <div className={styles.baslikSatiri}>
          <span>Fatura No</span>
          <span>Müşteri</span>
          <span>Düzenleme Tarihi</span>
          <span>Tutar</span>
          <span>Durum</span>
        </div>

        <List
          rowComponent={Satir}
          rowCount={faturalar.length}
          rowHeight={44}
          rowProps={{ faturalar }}
          style={{ height: 500, width: '100%' }}
        />
      </div>
    </div>
  )
}

export default TumFaturalarSayfasi