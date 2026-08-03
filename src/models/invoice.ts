export type FaturaTipi = 'Satış' | 'Alış'
export type FaturaDurumu = 'Ödendi' | 'Bekliyor' | 'Gecikmiş'

export interface Invoice {
  id: string
  faturaNo: string
  musteri: string
  duzenlemeTarihi: string
  vadeTarihi: string
  tutar: number
  tip: FaturaTipi
  durum: FaturaDurumu
  kalemler?: FaturaKalemi[]
}

export interface FaturaKalemi {
  id: string
  aciklama: string
  miktar: number
  birimFiyat: number
}