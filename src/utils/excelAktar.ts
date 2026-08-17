import * as XLSX from 'xlsx'
import type { Invoice } from '../models/invoice'

export function faturalariExceleAktar(faturalar: Invoice[]) {
  const veri = faturalar.map((fatura) => ({
    'Fatura No': fatura.faturaNo,
    'Müşteri': fatura.musteri,
    'Düzenleme Tarihi': fatura.duzenlemeTarihi,
    'Vade Tarihi': fatura.vadeTarihi,
    'Tutar': fatura.tutar,
    'Tip': fatura.tip,
    'Durum': fatura.durum,
  }))

  const calismaSayfasi = XLSX.utils.json_to_sheet(veri)
  const calismaKitabi = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(calismaKitabi, calismaSayfasi, 'Faturalar')

  const tarihEtiketi = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(calismaKitabi, `fatura-listesi-${tarihEtiketi}.xlsx`)
}