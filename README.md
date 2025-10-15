# Studi Kasus Interview — Frontend Developer

Dokumen ini menjawab studi kasus frontend: membangun komponen yang reusable, responsif, aksesibel, terdokumentasi, dan performant. Contoh implementasi tersedia di folder `src/` (React + Vite).

Ringkasan solusi
- Framework: React + Vite
- Fokus implementasi: Data Table (reusable, virtualized) dan Chart (Recharts)
- Pendekatan: komponen kecil, props-driven, dan teruji

1. Kontrak & Reusabilitas komponen
-------------------------------------------------
- DataTable (src/components/DataTable.jsx)
  - Props: columns (array {key,label,width?,render?}), data (array), rowHeight, height, onRowClick, sortable, sortState, onSortChange
  - Output: menampilkan baris secara virtualized (react-window) untuk performa pada dataset besar
  - Kontrak singkat:
    - Input: columns + data (JS objects)
    - Output: UI table dengan header sortable, row keyboard accessible, onRowClick callback
  - Alasan desain: props-driven membuat komponen mudah dipakai ulang di halaman lain (cukup ubah columns/data)

- Filters (src/components/Filters.jsx)
  - Props: search, onSearch, statusOptions, kabOptions, filters, onChange
  - Komponen dumb; semua state bisnis ditangani oleh parent (DataPage)

- Pagination (src/components/Pagination.jsx)
  - Komponen kecil yang hanya mengeluarkan event ketika page/perPage berubah

2. Responsivitas
-------------------------------------------------
- Desktop: tampilan tabel penuh, kolom dengan lebar yang ditentukan; tabel virtualized untuk performa.
- Mobile: dua mode yang diimplementasikan:
  - Horizontal-scroll mode: tabel menjaga layout kolom desktop dan dapat digeser ke kiri/kanan (untuk layar sedang)
  - Card view mode (untuk layar sempit): setiap baris dirender sebagai kartu vertikal berisi pasangan label:value sehingga teks terbaca dan mudah discroll
- Breakpoint dan perilaku ditetapkan di CSS (`@media (max-width: 640px)`) dan ada mekanisme deteksi ukuran di `DataTable` untuk memilih render non-virtualized pada layar kecil.

3. Aksesibilitas (A11y)
-------------------------------------------------
- Role semantics: `role="table"`, `role="row"`, `role="cell"`, `role="columnheader"` di DataTable.
- Keyboard: baris bisa difokus (tabIndex=0) dan dapat di-activate dengan tombol Enter.
- Sorting: header yang dapat disortir menggunakan `<button>` sehingga fokus dan screen reader friendly; `aria-sort` memberi status urutan.
- Forms: input dan select memiliki `aria-label` atau label visual untuk mendukung screen reader.

4. Dokumentasi & contoh penggunaan
-------------------------------------------------
- Jalankan:
  - npm install
  - npm run dev
  - Buka http://localhost:5173
- Contoh ringkas pemakaian `DataTable`:

```jsx
import DataTable from './components/DataTable'
const columns = [ { key: 'kode', label: 'Kode', width: 140 }, { key: 'nama', label: 'Nama', width: 220 } ]
<DataTable columns={columns} data={rows} height={400} rowHeight={48} onRowClick={(r)=>console.log(r)} />
```

5. Performa
-------------------------------------------------
- Virtualization: `react-window` untuk render baris secara virtual sehingga UI tetap lancar pada ribuan baris.
- Memoization: penggunaan `useMemo` di halaman untuk menghitung filter/aggregasi sehingga render tidak dilakukan berulang.
- Event-handling: kontrol sorting/filter diproses di parent (DataPage) untuk menjaga komponen presentasional tetap sederhana.

6. Trade-offs & catatan teknis
-------------------------------------------------
- Virtualisasi vs. Readability pada mobile: pada layar sangat kecil virtualisasi dengan baris ber-tinggi tetap menyebabkan teks terpotong. Solusi: render non-virtualized (list biasa) dengan tampilan kartu pada breakpoint mobile. Trade-off: mengurangi performa pada dataset yang sangat besar di mobile.
- Dropdown native: pada beberapa browser, native select bisa terpotong oleh overflow. Jika diperlukan, ganti dengan custom select yang merender popup via portal ke `document.body`.

7. Testing & quality gates
-------------------------------------------------
- Unit test sample: ada test sederhana untuk DataTable (Vitest + Testing Library). Idealnya tambahkan tests untuk:
  - Sorting behavior
  - Filter logic (search + selects)
  - Keyboard activation and accessibility attributes

8. Deployment & operasional
-------------------------------------------------
- Build: `npm run build` (Vite)
- Tips: gunakan code-splitting pada halaman besar, tambahkan monitoring/perf tracing (web vitals) di production.

9. Lampiran — daftar file penting
-------------------------------------------------
- `src/components/DataTable.jsx` — komponen tabel utama (virtualized + card mode)
- `src/components/Filters.jsx` — filter input/select
- `src/pages/DataPage.jsx` — halaman yang menggabungkan tabel, filter, pagination, export
- `src/pages/ChartPage.jsx` — halaman chart (Recharts)
- `src/components/table.css` & `src/components/filters.css` — styling responsif

Penutup
-------------------------------------------------
Jawaban ini menekankan pendekatan engineering: komponen yang kecil dan dapat diuji, pemisahan tanggung jawab (presentational vs container), perhatian pada aksesibilitas, dan optimasi performa untuk dataset besar. Jika Anda mau, saya bisa melengkapi README ini dengan contoh unit tests, atau mengubah komponen select menjadi versi portal-based untuk mengeliminasi masalah clipping di mobile.
