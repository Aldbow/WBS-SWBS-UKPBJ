# **Product Requirements Document (PRD)**

# **Sistem Whistleblowing (SWBS) & Deklarasi Benturan Kepentingan**

# **UKPBJ Kementerian Ketenagakerjaan**

| Versi | Tanggal | Penulis | Status |
| :---- | :---- | :---- | :---- |
| 1.5 | 30 Oktober 2025 | \[Nama Anda/Analis\] | Diperbarui |

## **1\. Pendahuluan**

### **1.1. Latar Belakang**

Pengadaan Barang/Jasa (PBJ) pemerintah adalah sektor yang krusial dan rentan terhadap risiko pelanggaran seperti korupsi, kolusi, nepotisme (KKN), dan benturan kepentingan (*conflict of interest*). Untuk meningkatkan transparansi, akuntabilitas, dan integritas di lingkungan Unit Kerja Pengadaan Barang/Jasa (UKPBJ) Kementerian Ketenagakerjaan, diperlukan sebuah sistem pelaporan pelanggaran (Whistleblowing System \- WBS) yang aman, anonim, dan terkelola dengan baik.

Sistem ini, "SWBS Conflict of Interest PBJ", bertujuan ganda:

1. Menyediakan sarana pelaporan yang aman dan **anonim** bagi siapa saja (internal maupun eksternal) untuk melaporkan dugaan pelanggaran dalam proses PBJ.  
2. Menyediakan sarana **teridentifikasi** bagi pegawai internal untuk secara proaktif mendeklarasikan potensi benturan kepentingan yang mungkin mereka miliki.

### **1.2. Tujuan Dokumen**

Dokumen ini menguraikan persyaratan fungsional dan non-fungsional untuk pengembangan dan implementasi website SWBS. Ini akan menjadi sumber kebenaran tunggal (*single source of truth*) bagi tim proyek untuk proses desain, pengembangan, pengujian, dan peluncuran.

### **1.3. Ruang Lingkup**

**Termasuk (In-Scope):**

* Pembuatan website publik (Landing Page, Form Laporan, Form Deklarasi).  
* Pembuatan halaman dashboard admin yang dilindungi kata sandi.  
* Integrasi *backend* menggunakan Google Cloud (Google Sheets API & Google Drive API) untuk:  
  * Menyimpan data kiriman (Laporan & Deklarasi) ke Google Sheets.  
  * Mengunggah file bukti ke Google Drive.  
* Menampilkan data dari Google Sheets pada dashboard admin.  
* **Pembuatan dokumentasi teknis (Setup Guide) yang merinci langkah-langkah *deployment*** ***frontend*** **(Vercel), *backend* (API), konfigurasi Google Service Account, dan pengaturan *environment variables* (termasuk SHEET\_ID dan kredensial *service account*).**

**Tidak Termasuk (Out-of-Scope):**

* Sistem investigasi atau manajemen kasus (tindak lanjut laporan). Sistem ini hanya berfokus pada **penerimaan** dan **pencatatan** laporan.  
* Sistem komunikasi dua arah (chat) antara pelopor anonim dan admin.  
* Sistem pelacakan status laporan untuk pelopor publik.  
* Layanan Single Sign-On (SSO) internal (untuk rilis awal, admin login menggunakan username/password standar).

### **1.4. Audiens & Persona Target**

1. **Pelapor Anonim (Publik/Internal):** Siapa saja yang memiliki informasi tentang pelanggaran.  
   * **Kebutuhan:** Melaporkan secara rahasia, aman, dan anonim tanpa takut identitasnya terungkap.  
2. **Pegawai UKPBJ (Internal):** Pegawai/pejabat di lingkungan UKPBJ Kemnaker.  
   * **Kebutuhan:** Memenuhi kewajiban untuk mendeklarasikan potensi benturan kepentingan secara transparan dan tercatat.  
3. **Admin WBS (Internal & Terbatas):** Tim/petugas yang ditunjuk (misal: Inspektorat Jenderal) untuk menerima dan meninjau laporan masuk.  
   * **Kebutuhan:** Melihat semua laporan dan deklarasi yang masuk di satu tempat yang aman, terpusat, dan mudah diakses.

## **2\. Fitur & Fungsionalitas (Persyaratan Fungsional)**

Sistem akan terdiri dari 4 fitur utama seperti yang diminta.

### **F1: Landing Page (Halaman Utama)**

Halaman utama yang dapat diakses publik dan berfungsi sebagai gerbang informasi.

* **Tujuan:** Memberikan informasi kepada pengguna tentang apa itu WBS, pentingnya, jaminan kerahasiaan, dan memberikan akses mudah ke fitur pelaporan atau deklarasi.  
* **Komponen Wajib:**  
  1. **Navigasi Header:**  
     * Logo (Kemnaker/UKPBJ)  
     * Menu: Beranda, Buat Laporan Pelanggaran, Buat Deklarasi, Login Admin  
  2. **Hero Section:**  
     * Judul Utama: Misal: "Jaga Integritas Pengadaan: Laporkan Pelanggaran, Deklarasikan Kepentingan."  
     * Sub-Judul: Penjelasan singkat mengenai SWBS.  
     * Tombol *Call-to-Action* (CTA) utama:  
       * \[ Buat Laporan (Anonim) \] (Mengarah ke F2)  
       * \[ Buat Deklarasi Benturan Kepentingan \] (Mengarah ke F3)  
  3. **Bagian Informasi:**  
     * **Apa itu WBS?** Penjelasan tentang sistem pelaporan pelanggaran.  
     * **Apa yang Bisa Dilaporkan?** (Contoh: Korupsi, Kolusi, Nepotisme, Gratifikasi, Benturan Kepentingan yang tidak diungkap, dll.)  
     * **Jaminan Kerahasiaan:** Pernyataan tegas bahwa pelaporan pelanggaran dijamin **anonim 100%** dan sistem tidak mencatat data pribadi pelopor (IP, lokasi, dll).  
  4. **Footer:**  
     * Informasi kontak (non-WBS, misal: alamat kantor, email humas).  
     * Tautan terkait (misal: website Kemnaker, website UKPBJ).

### **F2: Halaman Laporan Pelanggaran (Form Anonim)**

Halaman formulir untuk publik mengirimkan laporan pelanggaran.

* **Tujuan:** Mengumpulkan data laporan pelanggaran secara detail dan anonim.  
* **Persyaratan Utama:**  
  * **Anonimitas:** Halaman ini *wajib* menampilkan pesan yang jelas di bagian atas: "Pelaporan Anda bersifat ANONIM. Kami tidak mencatat identitas atau data pribadi Anda."  
  * Formulir tidak boleh meminta data diri pelapor.  
* **Data Fields (Formulir):**  
  1. Pelapor: *Field* ini harus ada, namun *disabled* (read-only) dan otomatis terisi dengan nilai **"Anonim"**.  
  2. Waktu Pelaporan: *Field* ini *disabled* (read-only) dan diisi otomatis dengan tanggal & waktu saat ini (menggunakan JavaScript *client-side* atau diisi oleh server saat data diterima).  
  3. Kategori Pelanggaran: (Wajib) *Dropdown*. Pilihan harus mencakup:  
     * Gratifikasi  
     * Kolusi / Persekongkolan Tender  
     * Nepotisme  
     * Benturan Kepentingan (Conflict of Interest)  
     * Penyuapan / Pemerasan  
     * Pelanggaran Prosedur PBJ  
     * Lainnya  
  4. Waktu Kejadian: (Wajib) *Date/Time Picker*. Pengguna harus bisa memilih perkiraan tanggal dan jam kejadian.  
  5. Subjek Pelaporan: (Wajib) *Text Input* (Maks 255 karakter). Judul singkat laporan.  
  6. Isi Laporan: (Wajib) *Textarea* (Maks 5000 karakter). Uraian detail kejadian, siapa yang terlibat, lokasi, dan kronologi.  
  7. Bukti Laporan: (Opsional, tapi sangat disarankan) *File Upload*.  
     * Harus mendukung multi-file.  
     * Tipe file yang diizinkan: .pdf, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .mp3, .mp4.  
     * Batas ukuran file total: 25MB per pengiriman.  
* **Proses Pengiriman:**  
  * Saat pengguna menekan tombol \[ Kirim Laporan \]:  
    1. Validasi *frontend* dilakukan (memastikan *field* wajib diisi).  
    2. Tampilkan *loading spinner* / pesan "Sedang Mengirim...".  
    3. Data formulir (JSON) dan file (jika ada) dikirim ke API *backend* (Lihat F5).  
  4. Setelah API merespons sukses (HTTP 200):  
     \* Formulir disembunyikan/direset.  
     \* Tampilkan pesan sukses: "Laporan Terkirim. Terima kasih atas partisipasi Anda dalam menjaga integritas UKPBJ."

### **F3: Halaman Deklarasi Benturan Kepentingan (Form Teridentifikasi)**

Halaman formulir untuk pegawai internal mendeklarasikan potensi benturan kepentingan.

* **Tujuan:** Mengumpulkan data deklarasi secara formal dan tercatat (teridentifikasi).  
* **Persyaratan Utama:**  
  * Halaman ini *wajib* menampilkan pesan yang jelas: "Formulir ini digunakan untuk deklarasi formal. Data diri Anda akan dicatat."  
* **Data Fields (Formulir):**  
  1. **Bagian A: Data Diri Pegawai**  
     * Nama Lengkap: (Wajib) *Text Input*.  
     * NIP / NIK: (Wajib) *Text Input*.  
     * Jabatan: (Wajib) *Text Input*.  
     * Satuan Kerja: (Wajib) *Text Input* (atau *Dropdown* jika daftarnya pasti). Diisi "UKPBJ Kementerian Ketenagakerjaan".  
  2. **Bagian B: Detail Potensi Benturan Kepentingan**  
     * Nama Kegiatan / Paket Pengadaan Terkait: (Wajib) *Text Input*. (Contoh: "Pengadaan Komputer TA 2026").  
     * Pihak yang Terkait (Memiliki Hubungan): (Wajib) *Text Input*. (Contoh: "PT. Maju Mundur" atau "Bapak Budi Hartono, Direktur PT. X").  
     * Bentuk Hubungan dengan Pihak Terkait: (Wajib) *Dropdown* / *Radio Button*.  
       * Hubungan Keluarga (Suami/Istri, Anak, Saudara Kandung, Orang Tua, Mertua)  
       * Hubungan Bisnis / Finansial (Kepemilikan Saham, Posisi Direksi/Komisaris)  
       * Hubungan Pekerjaan (Pernah bekerja di perusahaan tsb dalam 1 tahun terakhir)  
       * Hubungan Pertemanan Dekat / Relasi Sosial Kuat  
       * Lainnya  
     * Uraian Detail Hubungan & Potensi Benturan: (Wajib) *Textarea*. Jelaskan mengapa situasi ini dianggap berpotensi menimbulkan benturan kepentingan.  
  3. **Bagian C: Pernyataan**  
     * Checkbox: (Wajib) "Saya menyatakan bahwa data yang saya isikan adalah benar dan saya bersedia menerima konsekuensi jika data ini tidak benar."  
* **Proses Pengiriman:**  
  * Saat pengguna menekan tombol \[ Kirim Deklarasi \] (tombol aktif setelah *checkbox* pernyataan dicentang):  
    1. Validasi *frontend*.  
    2. Tampilkan *loading spinner*.  
    3. Data formulir (JSON) dikirim ke API *backend* (Lihat F5).  
  4. Setelah API merespons sukses (HTTP 200):  
     \* Tampilkan pesan sukses: "Deklarasi Anda telah berhasil dicatat dan dikirimkan."

### **F4: Halaman Dashboard Admin (Akses Terbatas)**

Halaman *backend* untuk Admin WBS mengelola dan melihat data yang masuk.

* **Tujuan:** Menyediakan antarmuka terpusat bagi Admin WBS untuk meninjau semua laporan dan deklarasi.  
* **Persyaratan Fungsional:**  
  **4.1. Halaman Login Admin**  
  * Lokasi: /login atau /admin.  
  * Formulir sederhana: Username dan Password.  
  * Otentikasi: Menggunakan *hardcoded* *credentials* atau sistem otentikasi sederhana (Bukan SSO untuk v1).  
  * Akses: Hanya yang berhasil login yang dapat mengakses F4.2.

  **4.2. Halaman Dashboard Utama**

  * Akses: Wajib login (F4.1).  
  * **Komponen Statistik Sederhana (Opsional, tapi disarankan):**  
    * Kotak: "Total Laporan Pelanggaran Masuk" (Angka)  
    * Kotak: "Total Deklarasi Masuk" (Angka)  
  * **Sistem Navigasi/Tab:**  
    * Tab 1: Daftar Laporan Pelanggaran (Tampilan *default*)  
    * Tab 2: Daftar Deklarasi Benturan Kepentingan  
    * Tombol Logout

  **4.3. Fitur: Daftar Laporan Pelanggaran (Tab 1\)**

  * Menampilkan data dari Google Sheet "Laporan" dalam bentuk tabel.  
  * **Kolom Tabel:** Waktu Pelaporan, Kategori Pelanggaran, Subjek Pelaporan, Waktu Kejadian, Aksi.  
  * **Fitur Tabel:** Pencarian (*search*), Pengurutan (*sorting*) per kolom.  
  * **Tombol Aksi \-\> \[ Lihat Detail \]:**  
    * Membuka *modal* (popup) atau halaman baru.  
    * Menampilkan **SEMUA** data dari baris tersebut:  
      * Pelapor: "Anonim"  
      * Waktu Laporan: (Data)  
      * Kategori: (Data)  
      * Waktu Kejadian: (Data)  
      * Subjek: (Data)  
      * Isi Laporan: (Data lengkap)  
      * Bukti Laporan: Menampilkan daftar *link* yang dapat diklik. Setiap *link* mengarah langsung ke file di Google Drive. (Lihat F5).

  **4.4. Fitur: Daftar Deklarasi Benturan Kepentingan (Tab 2\)**

  * Menampilkan data dari Google Sheet "Deklarasi" dalam bentuk tabel.  
  * **Kolom Tabel:** Waktu Pengiriman (diisi oleh API), Nama Pegawai, NIP, Satuan Kerja, Nama Kegiatan Terkait, Aksi.  
  * **Fitur Tabel:** Pencarian, Pengurutan.  
  * **Tombol Aksi \-\> \[ Lihat Detail \]:**  
    * Membuka *modal*.  
    * Menampilkan **SEMUA** data dari formulir F3 (Data Diri, Detail Potensi Benturan, dll).

### **F5: Arsitektur Teknis & Integrasi (Google API)**

Ini adalah *backend* dari sistem, yang menjembatani *frontend* (F2, F3, F4) dengan *database* (Google Sheets & Drive).

* **Teknologi:**  
  * **Frontend:** Dibangun menggunakan **Next.js** (React Framework) dan **JavaScript**. Styling akan menggunakan **Tailwind CSS**. *Deployment* akan dilakukan ke **Vercel**.  
  * **Backend (API):** Dibangun menggunakan **Node.js** dan memanfaatkan *library* seperti **google-sheets**. *Deployment* API disarankan sebagai **Vercel Serverless Functions** (terintegrasi dalam *project* Next.js) untuk kemudahan *deployment*.  
* **Otorisasi:** API *backend* harus menggunakan **Service Account** (Akun Layanan) dari Google Cloud Console.  
  * Kredensial *Service Account* (file JSON) harus dikonfigurasi sebagai *environment variables* (misal: GOOGLE\_SERVICE\_ACCOUNT\_EMAIL, GOOGLE\_PRIVATE\_KEY, dan GOOGLE\_SHEET\_ID) di Vercel.  
  * *Library* google-sheets akan menggunakan *environment variables* ini untuk otentikasi.  
  * Akun Layanan ini harus diberikan izin (IAM roles) untuk:  
    * Google Sheets API (scope: spreadsheets.readwrite)  
    * Google Drive API (scope: drive.file atau drive.appdata)  
* **Strategi Optimasi Kinerja (Next.js):**  
  1. **Rendering Halaman:**  
     * Halaman publik yang kontennya sebagian besar statis (F1, F2, F3, F4.1) *wajib* di-render menggunakan **Static Site Generation (SSG)** (getStaticProps) untuk waktu muat yang instan melalui CDN Vercel.  
     * Halaman dashboard admin (F4.2) yang memerlukan data dinamis pasca-login akan di-render menggunakan **Client-Side Rendering (CSR)** (misal: menggunakan useEffect untuk *fetch* data).  
  2. **Pemuatan Komponen:**  
     * Komponen yang berat dan tidak terlihat di *viewport* awal (misal: *Modal* "Lihat Detail" di F4.3 dan F4.4, atau *library* *date-picker* yang berat) *wajib* dimuat menggunakan **Dynamic Imports** (next/dynamic) untuk mengurangi ukuran *bundle JavaScript* awal.  
  3. **Optimasi Aset:**  
     * Semua aset gambar (seperti logo di F1) *wajib* menggunakan komponen \<Image\> dari next/image untuk optimasi otomatis, *lazy loading*, dan format modern (WebP).  
     * *Font* kustom (jika ada, misal: Inter) *wajib* dimuat menggunakan next/font untuk menghilangkan *layout shift* (CLS) dan mengoptimalkan pengiriman *font*.  
* **Target Google Workspace:**  
  1. **Google Sheet 1: \[SWBS-Laporan-Pelanggaran\]**  
     * Kolom: ID, WaktuPelaporan, Kategori, WaktuKejadian, Subjek, IsiLaporan, LinkBukti (bisa berisi beberapa link dipisah koma), Status (Kolom manual untuk admin: Baru, Ditinjau, Selesai).  
  2. **Google Sheet 2: \[SWBS-Deklarasi-Benturan-Kepentingan\]**  
     * Kolom: Sesuai dengan semua *field* di F3 (Nama, NIP, Jabatan, Satker, NamaKegiatan, PihakTerkait, BentukHubungan, Uraian, WaktuKirim).  
  3. **Google Drive Folder: \[SWBS-Bukti-Laporan\]**  
     * Folder ini harus **Restricted/Private**. Hanya Service Account dan Admin WBS yang boleh mengakses.  
* **Alur Kerja API (Endpoint):**  
  * *Catatan: Endpoint ini akan dibuat sebagai API Routes di Next.js (misal: /pages/api/submit-laporan.js)*

  **1\. POST /api/submit-laporan (Untuk F2)**

  * Menerima data JSON (dari form) dan file (dari upload, kemungkinan besar sebagai *multipart/form-data*).  
  * **Proses:**  
    1. Jika ada file: Unggah setiap file ke folder GDrive \[SWBS-Bukti-Laporan\].  
    2. Ambil *link shareable* (atau ID file) dari file yang baru diunggah.  
    3. Gabungkan semua *link* menjadi satu string (dipisah koma).  
    4. Tambahkan satu baris baru (appendRow) ke GSheet \[SWBS-Laporan-Pelanggaran\] (menggunakan google-sheets) berisi data JSON \+ *link* GDrive.  
    5. Kirim balasan HTTP 200 OK ke *frontend*.

  **2\. POST /api/submit-deklarasi (Untuk F3)**

  * Menerima data JSON dari form.  
  * **Proses:**  
    1. Tambahkan satu baris baru (appendRow) ke GSheet \[SWBS-Deklarasi-Benturan-Kepentingan\] (menggunakan google-sheets).  
    2. Kirim balasan HTTP 200 OK ke *frontend*.

  **3\. GET /api/get-laporan (Untuk F4, Wajib Aman)**

  * Endpoint ini harus dilindungi (misal: *API Key* atau token otentikasi admin).  
  * **Proses:**  
    1. Baca seluruh data (getValues) dari GSheet \[SWBS-Laporan-Pelanggaran\] (menggunakan google-sheets).  
    2. Kirim balasan HTTP 200 OK dengan data (dalam format JSON) ke *frontend* admin.

  **4\. GET /api/get-deklarasi (Untuk F4, Wajib Aman)**

  * Endpoint ini harus dilindungi.  
  * **Proses:**  
    1. Baca seluruh data (getValues) dari GSheet \[SWBS-Deklarasi-Benturan-Kepentingan\] (menggunakan google-sheets).  
    2. Kirim balasan HTTP 200 OK dengan data (JSON) ke *frontend* admin.

## **3\. Persyaratan Non-Fungsional**

### **3.1. Keamanan (Kritis)**

* **Anonimitas Pelapor:** Sistem *tidak boleh* mencatat alamat IP, *user agent*, atau *metadata* apa pun dari pelapor anonim (F2).  
* **Enkripsi Data:** Website wajib menggunakan HTTPS (SSL) di semua halaman (otomatis ditangani oleh Vercel).  
* **Keamanan API:** Semua *endpoint* API (F5) harus diamankan (misal: CORS dikonfigurasi hanya untuk domain Vercel, *API key* disimpan sebagai *environment variable*). *Endpoint* GET (F4) harus memiliki otentikasi yang kuat.  
* **Keamanan Google Workspace:** File GSheet dan Folder GDrive *harus* diatur ke "Restricted". Hanya Service Account dan Admin WBS (melalui akun Google mereka) yang boleh memiliki akses. **Data tidak boleh bersifat publik.**

### **3.2. Kinerja**

* Waktu muat halaman (Landing Page): \< 2 detik (didukung oleh CDN Vercel dan rendering SSG).  
* Waktu proses pengiriman formulir (termasuk unggah file sederhana): \< 10 detik.  
* Waktu muat data di Dashboard Admin (untuk 1000 baris data): \< 5 detik.  
* **Waktu muat *JavaScript* awal (initial bundle) untuk halaman publik harus diminimalkan melalui *code-splitting* otomatis per halaman dan *dynamic imports* (Lihat F5).**

### **3.3. Usability & Aksesibilitas**

* Desain *website* harus **modern**, bersih, profesional, dan mencerminkan identitas Kemnaker.  
* *Website* harus **Responsive**, dapat diakses dengan baik di perangkat *mobile* (ponsel) dan *desktop*.  
* Instruksi pada formulir harus jelas, ringkas, dan mudah dipahami.  
* Menggunakan **animasi interaktif** yang halus (misal: *hover effects*, transisi *loading*, *form validation feedback*) untuk meningkatkan pengalaman pengguna tanpa mengorbankan kinerja.  
* **Sistem harus memiliki Cumulative Layout Shift (CLS) minimal (\< 0.1), terutama saat *font* dan gambar dimuat (diatasi dengan next/image dan next/font).**

### **3.4. Ketersediaan (Availability)**

* Sistem (Website dan API) diharapkan tersedia 99.9% (*uptime*).

## **4\. Asumsi dan Ketergantungan**

* **Asumsi:**  
  * Tim Admin WBS telah ditunjuk oleh manajemen UKPBJ/Kemnaker.  
  * Admin WBS memiliki akun Google yang dapat diberikan akses ke GSheet/GDrive.  
  * Definisi kategori pelanggaran (F2) dan bentuk hubungan (F3) dalam PRD ini sudah final.  
* **Ketergantungan:**  
  * Ketersediaan akun Google Cloud (GCP) untuk mengelola Service Account dan API.  
  * Ketersediaan dan konfigurasi akun **Vercel** untuk *deployment* *frontend* aplikasi dan *backend* (API Routes).

## **5\. Rilis & Rencana Masa Depan (Future Scope)**

* **Rilis 1.0 (MVP):** Mencakup semua fitur F1, F2, F3, F4, dan F5 seperti yang dijelaskan dalam dokumen ini.  
* **Rencana Masa Depan (V2.0):**  
  * **Pelacakan Laporan:** Pelopor anonim mendapatkan kode unik setelah melapor, yang dapat digunakan untuk memeriksa status laporan (Baru, Ditinjau, Selesai) dan menerima balasan satu arah dari admin.  
  * **Komunikasi Dua Arah Anonim:** Fitur *chat* aman antara admin dan pelopor (menggunakan kode unik) untuk meminta klarifikasi tanpa mengungkap identitas.  
  * **Notifikasi:** Admin WBS menerima notifikasi *email* otomatis setiap kali ada laporan atau deklarasi baru yang masuk.