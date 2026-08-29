import { createContext, useContext } from 'react'

export interface ToastContextDegeri {
  bildirGoster: (mesaj: string, tur?: 'basari' | 'hata') => void
}

export const ToastContext = createContext<ToastContextDegeri | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast, ToastProvider içinde kullanılmalı')
  }
  return context
}