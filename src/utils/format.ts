export function paraFormatla(tutar: number): string {
  const sayi = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(tutar)
  return `${sayi} ₺`
}

export function tarihFormatla(isoTarih: string): string {
  const tarih = new Date(isoTarih)
  return new Intl.DateTimeFormat('tr-TR').format(tarih)
}