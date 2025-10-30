# SWBS - Sistem Whistleblowing & Deklarasi Benturan Kepentingan
## UKPBJ Kementerian Ketenagakerjaan

Sistem pelaporan pelanggaran (Whistleblowing) yang aman dan anonim serta sarana deklarasi benturan kepentingan untuk UKPBJ Kemnaker.

## 🚀 Fitur Utama

### 1. **Landing Page**
- Informasi tentang sistem whistleblowing
- Jaminan kerahasiaan 100%
- Panduan pelaporan

### 2. **Laporan Pelanggaran (Anonim)**
- Pelaporan sepenuhnya anonim
- Upload bukti (PDF, gambar, dokumen, audio, video)
- Berbagai kategori pelanggaran (korupsi, kolusi, nepotisme, dll)

### 3. **Deklarasi Benturan Kepentingan (Teridentifikasi)**
- Formulir deklarasi formal untuk pegawai internal
- Data tercatat secara transparan

### 4. **Dashboard Admin**
- Login aman untuk admin
- Tabel laporan dan deklarasi dengan pencarian
- Detail view untuk setiap submission

## 📋 Persyaratan Sistem

- Node.js 18+ 
- NPM atau Yarn
- Google Cloud Platform Account (untuk Sheets & Drive API)
- Vercel Account (untuk deployment)

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd SWBS-COI-PBJ
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Google Cloud

#### a. Buat Project di Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan API berikut:
   - Google Sheets API
   - Google Drive API

#### b. Buat Service Account
1. Navigasi ke **IAM & Admin → Service Accounts**
2. Klik **Create Service Account**
3. Beri nama (misal: "swbs-service-account")
4. Klik **Create and Continue**
5. Grant role: **Editor**
6. Klik **Done**

#### c. Generate Key untuk Service Account
1. Klik pada service account yang baru dibuat
2. Ke tab **Keys**
3. Klik **Add Key → Create New Key**
4. Pilih format **JSON**
5. File JSON akan terdownload otomatis

#### d. Buat Google Sheets
1. Buat 2 Google Sheets baru:
   - **Sheet 1: SWBS-Laporan-Pelanggaran**
     - Kolom: ID, WaktuPelaporan, Kategori, WaktuKejadian, Subjek, IsiLaporan, LinkBukti
   - **Sheet 2: SWBS-Deklarasi-Benturan-Kepentingan**
     - Kolom: ID, WaktuKirim, NamaLengkap, NIP/NIK, Jabatan, SatuanKerja, NamaKegiatan, PihakTerkait, BentukHubungan, UraianDetail

2. Bagikan kedua sheets dengan service account email (dari file JSON)
   - Buka sheet → Klik **Share**
   - Tambahkan email service account
   - Berikan akses **Editor**

#### e. Buat Google Drive Folder
1. Buat folder baru di Google Drive: "SWBS-Bukti-Laporan"
2. **Penting**: Set folder ke **Restricted** (hanya dibagikan dengan service account)
3. Share folder dengan service account email (permission: Editor)
4. Copy **Folder ID** dari URL (contoh: `https://drive.google.com/drive/folders/[FOLDER_ID]`)

### 4. Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```env
# Google Service Account Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"

# Google Sheets IDs
SHEET_ID_LAPORAN=your-laporan-sheet-id
SHEET_ID_DEKLARASI=your-deklarasi-sheet-id

# Google Drive Folder ID
DRIVE_FOLDER_ID=your-drive-folder-id

# Admin Credentials (Generate hash menggunakan bcrypt)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$yourBcryptHashHere

# JWT Secret
JWT_SECRET=your-very-secret-jwt-key-at-least-32-characters

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Generate Password Hash untuk Admin

Jalankan script berikut di Node.js untuk generate password hash:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-admin-password'; // Ganti dengan password yang diinginkan
const hash = bcrypt.hashSync(password, 10);
console.log('Password Hash:', hash);
// Copy hash dan paste ke .env.local sebagai ADMIN_PASSWORD_HASH
```

Atau gunakan online tool: [bcrypt-generator.com](https://bcrypt-generator.com/)

## 🚦 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Buka browser di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment ke Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login ke Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

### 4. Set Environment Variables di Vercel

Di Vercel Dashboard:
1. Pilih project Anda
2. Go to **Settings → Environment Variables**
3. Tambahkan semua variable dari `.env.local`
4. **Penting**: Untuk `GOOGLE_PRIVATE_KEY`, pastikan format benar dengan `\n` untuk line breaks

### 5. Deploy Production

```bash
vercel --prod
```

## 📁 Struktur Project

```
SWBS-COI-PBJ/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Dashboard admin
│   │   └── page.tsx           # Login admin
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── route.ts   # API login admin
│   │   │   ├── get-laporan/
│   │   │   │   └── route.ts   # API get laporan
│   │   │   └── get-deklarasi/
│   │   │       └── route.ts   # API get deklarasi
│   │   ├── submit-laporan/
│   │   │   └── route.ts       # API submit laporan
│   │   └── submit-deklarasi/
│   │       └── route.ts       # API submit deklarasi
│   ├── deklarasi/
│   │   └── page.tsx           # Form deklarasi
│   ├── laporan/
│   │   └── page.tsx           # Form laporan
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── Header.tsx             # Header component
│   └── Footer.tsx             # Footer component
├── lib/
│   ├── googleSheets.ts        # Google Sheets utility
│   └── googleDrive.ts         # Google Drive utility
├── .env.local.example         # Environment variable template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔒 Keamanan

- **Anonimitas**: Sistem tidak mencatat IP address atau metadata pelapor anonim
- **HTTPS**: Wajib menggunakan SSL/TLS (otomatis di Vercel)
- **Authentication**: JWT-based authentication untuk admin
- **Authorization**: API endpoints dilindungi dengan token verification
- **Google Sheets & Drive**: Hanya service account dan admin yang memiliki akses

## 🔐 Default Admin Credentials (Setelah Setup)

**Username**: (sesuai ADMIN_USERNAME di .env)  
**Password**: (sesuai yang Anda hash)

⚠️ **PENTING**: Ganti password default setelah login pertama!

## 📝 Cara Menggunakan

### Untuk Pelapor (Publik)
1. Akses website
2. Klik "Buat Laporan (Anonim)"
3. Isi formulir
4. Upload bukti (opsional)
5. Submit - identitas Anda terjamin anonim

### Untuk Pegawai Internal (Deklarasi)
1. Akses website  
2. Klik "Buat Deklarasi Benturan Kepentingan"
3. Isi data diri dan detail benturan kepentingan
4. Centang pernyataan
5. Submit - data akan tercatat secara formal

### Untuk Admin
1. Login di `/admin`
2. View dashboard dengan 2 tab:
   - Laporan Pelanggaran
   - Deklarasi Benturan Kepentingan
3. Klik "Lihat Detail" untuk melihat data lengkap
4. File bukti dapat diakses langsung dari Google Drive

## 🛠️ Troubleshooting

### Error: "Invalid credentials"
- Pastikan `GOOGLE_SERVICE_ACCOUNT_EMAIL` dan `GOOGLE_PRIVATE_KEY` benar
- Pastikan format private key menggunakan `\n` untuk line breaks
- Cek bahwa service account sudah di-share dengan Google Sheets & Drive

### Error: "Insufficient permissions"
- Pastikan Google Sheets API dan Google Drive API sudah diaktifkan
- Pastikan service account memiliki akses Editor ke sheets dan folder drive

### Error: "Sheet not found"
- Pastikan `SHEET_ID_LAPORAN` dan `SHEET_ID_DEKLARASI` benar
- Sheet ID dapat ditemukan di URL Google Sheets

### Error: "Cannot upload file"
- Pastikan `DRIVE_FOLDER_ID` benar
- Pastikan service account memiliki akses ke folder
- Cek quota Google Drive

## 📞 Support

Untuk pertanyaan atau issues, silakan contact tim IT UKPBJ Kemnaker.

## 📄 License

© 2025 UKPBJ Kementerian Ketenagakerjaan. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: Oktober 2025
