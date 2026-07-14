import { http } from '../http'
import type { Invoice } from '../../models/invoice'

export async function faturalariGetir(): Promise<Invoice[]> {
  const yanit = await http.get<Invoice[]>('/invoices')
  return yanit.data
}