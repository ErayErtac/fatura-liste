import { http } from '../http'
import type { Invoice } from '../../models/invoice'

export async function faturalariGetir(): Promise<Invoice[]> {
  const yanit = await http.get<Invoice[]>('/invoices')
  return yanit.data
}

export async function faturaOlustur(fatura: Invoice): Promise<Invoice> {
  const yanit = await http.post<Invoice>('/invoices', fatura)
  return yanit.data
}

export async function faturaGuncelle(fatura: Invoice): Promise<Invoice> {
  const yanit = await http.put<Invoice>(`/invoices/${fatura.id}`, fatura)
  return yanit.data
}

export async function faturaSil(id: string): Promise<void> {
  await http.delete(`/invoices/${id}`)
}