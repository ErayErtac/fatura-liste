import { http } from '../http'
import type { Musteri } from '../../models/customer'

export async function musterileriGetir(): Promise<Musteri[]> {
  const yanit = await http.get<Musteri[]>('/musteriler')
  return yanit.data
}

export async function musteriOlustur(musteri: Musteri): Promise<Musteri> {
  const yanit = await http.post<Musteri>('/musteriler', musteri)
  return yanit.data
}

export async function musteriGuncelle(musteri: Musteri): Promise<Musteri> {
  const yanit = await http.put<Musteri>(`/musteriler/${musteri.id}`, musteri)
  return yanit.data
}

export async function musteriSil(id: string): Promise<void> {
  await http.delete(`/musteriler/${id}`)
}