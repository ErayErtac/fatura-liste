# Fatura Listesi — Stajyer Oryantasyon Projesi

PreAccounting Client projesindeki teknoloji yığınını ve kod kalıplarını öğrenmek amacıyla sıfırdan geliştirilen bir fatura liste ekranı. Mock veri + sahte API (json-server) ile çalışır.

## Teknoloji Yığını

- **Dil / Derleyici:** TypeScript 5 + Vite 5
- **UI:** React 18 (fonksiyonel bileşen + hook)
- **State:** Redux Toolkit + typed hooks
- **Stil:** SCSS Modules
- **Form:** Formik + Yup
- **UI bileşenleri:** react-select, react-datepicker, react-modal
- **HTTP:** axios (sarmalayıcı ile)
- **Sahte API:** json-server
- **Kalite:** ESLint

## Özellikler

- Filtre paneli: tarih aralığı, müşteri, durum, tip, serbest metin arama
- Kolon başlığına tıklayınca artan/azalan sıralama
- Sayfalama (10 / 25 / 50 kayıt seçenekli)
- Fatura detay modalı
- Özet kartları: toplam fatura adedi, toplam tutar, geciken tutar
- TR para/tarih formatı
- Yükleniyor, hata ve boş liste durumları
- Yeni fatura oluşturma: kalem bazlı (ürün/hizmet satırları), otomatik toplam hesaplama, Yup doğrulama, API'ye kayıt
- React Router ile iki sayfa arası gezinme (Fatura Listesi / Yeni Fatura)

## Kurulum

npm install

## Mock Veriyi Oluşturma

`db.json` dosyası projeye dahil değilse (ya da yeniden oluşturmak istersen):

node src/data/generateDb.cjs

## Çalıştırma

Hem sahte API'yi (json-server, port 3001) hem Vite dev server'ını (port 5173) aynı anda başlatır:

npm run dev:all

Sadece frontend'i çalıştırmak için:

npm run dev

Sadece sahte API'yi çalıştırmak için:

npm run api

## Klasör Yapısı

    src/
      api/
        http.ts               axios sarmalayıcısı
        resources/invoice.ts  fatura API çağrıları
      components/
        InvoiceRow.tsx / .module.scss
        InvoiceDetailModal.tsx / .module.scss
        FilterForm.tsx / .module.scss
        SummaryCards.tsx / .module.scss
        filterDefaults.ts
      data/
        mockInvoices.ts        mock veri üretimi (uygulama içi kullanım)
        generateDb.cjs         db.json üretim script'i (json-server için)
      models/
        invoice.ts              Invoice tipi ve union tipler
      store/
        store.ts / hook.ts
        invoice/invoiceSlice.ts
      utils/
        format.ts               TR para/tarih formatlama
      App.tsx / App.module.scss / App.css

## Notlar

- Filtre/sıralama/sayfalama state'i bileşen içinde (`useState`) tutulur; sunucudan gelen fatura listesi Redux store'da tutulur.
- Mock veri 120 kayıt içerir, `db.json` üzerinden json-server ile servis edilir.