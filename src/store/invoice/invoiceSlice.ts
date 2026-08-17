import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Invoice } from '../../models/invoice'
import { faturalariGetir, faturaOlustur, faturaGuncelle, faturaSil } from '../../api/resources/invoice'

interface InvoiceState {
  liste: Invoice[]
  yukleniyor: boolean
  hata: string | null
}

const baslangicState: InvoiceState = {
  liste: [],
  yukleniyor: false,
  hata: null,
}

export const faturalariYukle = createAsyncThunk('invoice/faturalariYukle', async () => {
  const veri = await faturalariGetir()
  return veri
})

export const faturaEkle = createAsyncThunk('invoice/faturaEkle', async (fatura: Invoice) => {
  const eklenenFatura = await faturaOlustur(fatura)
  return eklenenFatura
})

export const faturaDuzenle = createAsyncThunk('invoice/faturaDuzenle', async (fatura: Invoice) => {
  const guncellenenFatura = await faturaGuncelle(fatura)
  return guncellenenFatura
})

export const faturaKaldir = createAsyncThunk('invoice/faturaKaldir', async (id: string) => {
  await faturaSil(id)
  return id
})

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: baslangicState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(faturalariYukle.pending, (state) => {
        state.yukleniyor = true
        state.hata = null
      })
      .addCase(faturalariYukle.fulfilled, (state, action) => {
        state.yukleniyor = false
        state.liste = action.payload
      })
      .addCase(faturalariYukle.rejected, (state) => {
        state.yukleniyor = false
        state.hata = 'Faturalar yüklenirken bir hata oluştu. json-server çalışıyor mu?'
      })
      .addCase(faturaEkle.fulfilled, (state, action) => {
        state.liste.unshift(action.payload)
      })
      .addCase(faturaDuzenle.fulfilled, (state, action) => {
        const index = state.liste.findIndex((f) => f.id === action.payload.id)
        if (index !== -1) {
          state.liste[index] = action.payload
        }
      })
      .addCase(faturaKaldir.fulfilled, (state, action) => {
        state.liste = state.liste.filter((f) => f.id !== action.payload)
      })
  },
})

export default invoiceSlice.reducer