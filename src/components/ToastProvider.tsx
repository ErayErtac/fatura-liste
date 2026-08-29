import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './useToast'
import styles from './ToastProvider.module.scss'

interface Toast {
  id: number
  mesaj: string
  tur: 'basari' | 'hata'
}

let sayac = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastlar, setToastlar] = useState<Toast[]>([])

  const bildirGoster = useCallback((mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    sayac += 1
    const id = sayac
    setToastlar((onceki) => [...onceki, { id, mesaj, tur }])

    setTimeout(() => {
      setToastlar((onceki) => onceki.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ bildirGoster }}>
      {children}
      <div className={styles.toastKapsayici}>
        {toastlar.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.tur]}`}>
            {toast.mesaj}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}