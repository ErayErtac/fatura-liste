import { configureStore } from '@reduxjs/toolkit'
import invoiceReducer from './invoice/invoiceSlice'
import customerReducer from './customer/customerSlice'

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
    customer: customerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch