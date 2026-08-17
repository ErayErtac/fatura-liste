import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Musteri } from '../../models/customer'
import {
  musterileriGetir,
  musteriOlustur,
  musteriGuncelle,
  musteriSil,
} from '../../api/resources/customer'

interface CustomerState {
  liste: Musteri[]
  yukleniyor: boolean
  hata: string | null
}

const baslangicState: CustomerState = {
  liste: [],
  yukleniyor: false,
  hata: null,
}

export const musterileriYukle = createAsyncThunk('customer/musterileriYukle', async () => {
  return await musterileriGetir()
})

export const musteriEkle = createAsyncThunk('customer/musteriEkle', async (musteri: Musteri) => {
  return await musteriOlustur(musteri)
})

export const musteriDuzenle = createAsyncThunk('customer/musteriDuzenle', async (musteri: Musteri) => {
  return await musteriGuncelle(musteri)
})

export const musteriKaldir = createAsyncThunk('customer/musteriKaldir', async (id: string) => {
  await musteriSil(id)
  return id
})

const customerSlice = createSlice({
  name: 'customer',
  initialState: baslangicState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(musterileriYukle.pending, (state) => {
        state.yukleniyor = true
        state.hata = null
      })
      .addCase(musterileriYukle.fulfilled, (state, action) => {
        state.yukleniyor = false
        state.liste = action.payload
      })
      .addCase(musterileriYukle.rejected, (state) => {
        state.yukleniyor = false
        state.hata = 'Müşteriler yüklenirken bir hata oluştu.'
      })
      .addCase(musteriEkle.fulfilled, (state, action) => {
        state.liste.unshift(action.payload)
      })
      .addCase(musteriDuzenle.fulfilled, (state, action) => {
        const index = state.liste.findIndex((m) => m.id === action.payload.id)
        if (index !== -1) state.liste[index] = action.payload
      })
      .addCase(musteriKaldir.fulfilled, (state, action) => {
        state.liste = state.liste.filter((m) => m.id !== action.payload)
      })
  },
})

export default customerSlice.reducer