# SWBS - Setup Guide Lengkap

## 📋 Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Setup Google Cloud](#setup-google-cloud)
3. [Konfigurasi Proyek](#konfigurasi-proyek)
4. [Generate Password Admin](#generate-password-admin)
5. [Install & Run](#install--run)
6. [Deployment ke Vercel](#deployment-ke-vercel)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 1. Persiapan Awal

### Software yang Dibutuhkan
- **Node.js** versi 18 atau lebih baru
- **NPM** (terinstall bersama Node.js)
- **Git** (optional, untuk version control)
- **Text Editor** (VS Code, Sublime, dll)

### Akun yang Dibutuhkan
- Google Account (untuk Google Cloud)
- Vercel Account (untuk deployment)

---

## 2. Setup Google Cloud

### A. Buat Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **Select a Project** → **New Project**
3. Isi nama project: `SWBS-UKPBJ-Kemnaker`
4. Klik **Create**
5. Tunggu beberapa detik, lalu pilih project tersebut

### B. Aktifkan API

1. Di sidebar kiri, pilih **APIs & Services** → **Library**
2. Cari dan aktifkan:
   - **Google Sheets API**
     - Klik API → Klik **Enable**
   - **Google Drive API**
     - Klik API → Klik **Enable**

### C. Buat Service Account

1. Di sidebar, pilih **APIs & Services** → **Credentials**
2. Klik **+ CREATE CREDENTIALS** → **Service Account**
3. Isi detail:
   - **Service account name**: `swbs-service-account`
   - **Service account ID**: (auto-filled)
   - **Description**: `Service account untuk SWBS`
4. Klik **CREATE AND CONTINUE**
5. Di **Grant this service account access to project**:
   - **Role**: Pilih **Editor**
6. Klik **CONTINUE** → **DONE**

### D. Generate Service Account Key

1. Klik pada service account yang baru dibuat
2. Ke tab **KEYS**
3. Klik **ADD KEY** → **Create new key**
4. Pilih **JSON**
5. Klik **CREATE**
6. File JSON akan terdownload otomatis
7. **PENTING**: Simpan file ini dengan aman, jangan bagikan ke siapapun

### E. Buat Google Sheets

#### Sheet 1: Laporan Pelanggaran

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat sheet baru, beri nama: `SWBS-Laporan-Pelanggaran`
3. Di baris pertama (header), isi kolom:
   ```
   A1: ID
   B1: WaktuPelaporan
   C1: Kategori
   D1: WaktuKejadian
   E1: Subjek
   F1: IsiLaporan
   G1: LinkBukti
   H1: Status
   ```

#### Sheet 2: Deklarasi Benturan Kepentingan

1. Buat sheet baru, beri nama: `SWBS-Deklarasi-Benturan-Kepentingan`
2. Di baris pertama (header), isi kolom:
   ```
   A1: ID
   B1: WaktuKirim
   C1: NamaLengkap
   D1: NIP/NIK
   E1: Jabatan
   F1: SatuanKerja
   G1: NamaKegiatan
   H1: PihakTerkait
   I1: BentukHubungan
   J1: UraianDetail
   ```

#### Share Sheets dengan Service Account

Untuk kedua sheets:
1. Klik tombol **Share** (pojok kanan atas)
2. Copy email service account dari file JSON (`client_email`)
3. Paste ke kolom "Add people and groups"
4. Set permission ke **Editor**
5. **UNCHECK** "Notify people"
6. Klik **Share**

#### Ambil Sheet ID

Untuk kedua sheets, copy ID dari URL:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID_INI]/edit
```

### F. Buat Google Drive Folder

1. Buka [Google Drive](https://drive.google.com)
2. Klik **+ New** → **Folder**
3. Beri nama: `SWBS-Bukti-Laporan`
4. Klik kanan folder → **Share**
5. Paste email service account
6. Set permission ke **Editor**
7. **UNCHECK** "Notify people"
8. Klik **Share**
9. Buka folder, copy ID dari URL:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID_INI]
   ```

**PENTING - Konfigurasi Google Shared Drive (Diperlukan untuk Upload File)**:
Karena service account tidak memiliki kuota penyimpanan pribadi, Anda perlu membuat Google Shared Drive agar upload file dapat berfungsi dengan benar. Ikuti langkah-langkah berikut jika Anda mengalami error seperti "Service Accounts do not have storage quota":

1. Buka [Google Admin Console](https://admin.google.com)
2. Pergi ke **Apps** → **Google Workspace** → **Drive and Docs** → **Shared drives**
3. Klik **Create a shared drive**
4. Beri nama: `SWBS-Shared-Drive` (atau nama pilihan Anda)
5. Klik **Create**

6. Setelah dibuat, klik kanan pada shared drive tersebut, pilih **Manage members**
7. Tambahkan service account email sebagai member dengan role **Manager** (untuk akses penuh)
8. Salin **Shared Drive ID** dari URL saat membuka shared drive tersebut:
   ```
   https://drive.google.com/drive/folders/[SHARED_DRIVE_ID_INI]#/folders/[FOLDER_ID_INI]
   ```

9. Update file `.env.local` untuk menggunakan Shared Drive ID daripada folder biasa:
   ```env
   # Ganti DRIVE_FOLDER_ID dengan Shared Drive ID
   DRIVE_FOLDER_ID=[SHARED_DRIVE_ID_INI]
   ```

Catatan: Fitur Shared Drive hanya tersedia untuk Google Workspace (G Suite) yang merupakan bagian dari Google Workspace for Business/Education. Jika organisasi Anda tidak memiliki Google Workspace, alternatifnya adalah menggunakan akun OAuth dengan kuota penyimpanan pribadi.

---

## 3. Konfigurasi Proyek

### A. Clone/Download Project

Jika menggunakan Git:
```bash
cd c:\Users\User\Documents\Aldiva\App\SWBS-COI-PBJ
```

### B. Install Dependencies

```bash
npm install
```

### C. Buat File .env.local

1. Copy file `.env.local.example` menjadi `.env.local`
   ```bash
   copy .env.local.example .env.local
   ```

2. Buka `.env.local` dengan text editor

3. Isi konfigurasi berdasarkan data yang sudah dikumpulkan:

```env
# Google Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"

# Google Sheets IDs
SHEET_ID_LAPORAN=1abc...xyz
SHEET_ID_DEKLARASI=1def...uvw

# Google Drive Folder ID
DRIVE_FOLDER_ID=1ghi...rst

# Admin Credentials (akan diisi setelah generate hash)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=

# JWT Secret (generate random string minimal 32 karakter)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Cara Mengisi GOOGLE_PRIVATE_KEY

1. Buka file JSON service account
2. Copy value dari field `private_key`
3. Paste ke `.env.local`
4. **PENTING**: Pastikan menggunakan `\n` untuk newline, bukan real newline

Contoh yang BENAR:
```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## 4. Generate Password Admin

### Opsi 1: Menggunakan Node.js Script

1. Buat file temporary `generate-hash.js`:

```javascript
const bcrypt = require('bcryptjs');

// Ganti dengan password yang diinginkan
const password = 'admin123'; // GANTI INI!

const hash = bcrypt.hashSync(password, 10);
console.log('Password Hash:', hash);
console.log('\nCopy hash di atas ke .env.local sebagai ADMIN_PASSWORD_HASH');
```

2. Jalankan:
```bash
node generate-hash.js
```

3. Copy hash yang dihasilkan
4. Paste ke `.env.local` di `ADMIN_PASSWORD_HASH`

### Opsi 2: Menggunakan Online Tool

1. Buka [bcrypt-generator.com](https://bcrypt-generator.com/)
2. Masukkan password yang diinginkan
3. Set rounds ke `10`
4. Klik **Generate**
5. Copy hash yang dihasilkan
6. Paste ke `.env.local`

**Contoh:**
```env
ADMIN_PASSWORD_HASH=$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

---

## 5. Install & Run

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Testing Local

1. Buka browser ke `http://localhost:3000`
2. Test fitur:
   - Landing page
   - Form laporan (anonim)
   - Form deklarasi
   - Login admin di `/admin`
   - Dashboard admin

---

## 6. Deployment ke Vercel

### A. Install Vercel CLI

```bash
npm install -g vercel
```

### B. Login ke Vercel

```bash
vercel login
```

Ikuti instruksi login (biasanya via email atau GitHub)

### C. Deploy Project

Di root folder project:

```bash
vercel
```

Jawab pertanyaan:
- Set up and deploy? **Y**
- Which scope? (pilih akun Anda)
- Link to existing project? **N**
- What's your project's name? `swbs-ukpbj-kemnaker`
- In which directory is your code located? `./`
- Want to modify settings? **N**

### D. Set Environment Variables di Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project `swbs-ukpbj-kemnaker`
3. Go to **Settings** → **Environment Variables**
4. Tambahkan SEMUA variable dari `.env.local`:

Untuk setiap variable:
- **Name**: Nama variable (misal: `GOOGLE_SERVICE_ACCOUNT_EMAIL`)
- **Value**: Value dari `.env.local`
- **Environment**: Pilih **Production**, **Preview**, dan **Development**
- Klik **Save**

**PENTING untuk GOOGLE_PRIVATE_KEY**:
- Value harus dalam satu baris
- Gunakan `\n` untuk newline
- Gunakan double quotes
- Contoh: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"`

### E. Deploy ke Production

```bash
vercel --prod
```

Vercel akan memberikan URL production, misal: `https://swbs-ukpbj-kemnaker.vercel.app`

### F. Update .env.local untuk Production

Update variable:
```env
NEXT_PUBLIC_APP_URL=https://swbs-ukpbj-kemnaker.vercel.app
```

Deploy ulang:
```bash
vercel --prod
```

---

## 7. Testing

### A. Test Frontend

- [ ] Landing page load dengan baik
- [ ] Navigation menu berfungsi
- [ ] Form laporan dapat disubmit
- [ ] Form deklarasi dapat disubmit
- [ ] Success message muncul setelah submit

### B. Test Backend

- [ ] Data laporan masuk ke Google Sheets
- [ ] Data deklarasi masuk ke Google Sheets
- [ ] File bukti terupload ke Google Drive
- [ ] Link file bukti berfungsi

### C. Test Admin

- [ ] Login berhasil dengan credentials yang benar
- [ ] Login gagal dengan credentials yang salah
- [ ] Dashboard menampilkan data dari sheets
- [ ] Search berfungsi
- [ ] Detail modal menampilkan data lengkap
- [ ] Link file bukti dapat diklik dan membuka file
- [ ] Logout berfungsi

---

## 8. Troubleshooting

### Error: "Invalid credentials" atau "Insufficient permissions"

**Penyebab:**
- Service account belum di-share ke Sheets/Drive
- Credential salah di `.env.local`

**Solusi:**
1. Pastikan service account email sudah di-share ke:
   - Kedua Google Sheets (dengan permission Editor)
   - Google Drive folder (dengan permission Editor)
2. Pastikan `GOOGLE_SERVICE_ACCOUNT_EMAIL` dan `GOOGLE_PRIVATE_KEY` benar
3. Pastikan format `GOOGLE_PRIVATE_KEY` menggunakan `\n` untuk newline

### Error: "Sheet not found"

**Penyebab:**
- Sheet ID salah

**Solusi:**
1. Buka Google Sheet
2. Copy ID dari URL (antara `/d/` dan `/edit`)
3. Update `SHEET_ID_LAPORAN` dan `SHEET_ID_DEKLARASI` di `.env.local`

### Error: "Cannot upload file" atau "Service Accounts do not have storage quota"

**Penyebab:**
- Folder ID salah
- Service account belum punya akses ke folder
- Service account tidak memiliki kuota penyimpanan (karena bukan akun personal)

**Solusi:**
1. Pastikan `DRIVE_FOLDER_ID` benar
2. Share folder dengan service account email
3. Pastikan permission adalah Editor
4. **Untuk mengatasi masalah kuota penyimpanan**, Anda harus menggunakan Google Shared Drive:
   - Pastikan organisasi Anda memiliki Google Workspace (G Suite)
   - Buat Shared Drive di Google Admin Console
   - Tambahkan service account sebagai member dengan role Manager
   - Gunakan Shared Drive ID sebagai `DRIVE_FOLDER_ID` di `.env.local`

**Catatan:** Service account tidak memiliki kuota penyimpanan pribadi seperti akun Google biasa. Dengan menggunakan Shared Drive, file akan disimpan di kuota organisasi, bukan kuota pribadi service account.

### Error: "Login failed" atau "Invalid token" atau "Admin login server configuration error"

**Penyebab:**
- Password hash salah
- JWT secret tidak diset
- Admin credentials tidak dikonfigurasi dengan benar
- Environment variables tidak lengkap atau salah

**Solusi:**
1. **Pastikan semua environment variables telah dikonfigurasi dengan benar:**
   ```env
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH=$2a$10$26qOxp6kcNMfa49bpoEI1OPkbygqJhCvdczxptZQiqNRp8ZgQmpvS
   JWT_SECRET=swbs-ukpbj-kemnaker-secret-jwt-key-2025-change-this-to-random-string
   ```

2. **Generate password hash baru:**
   - Gunakan Node.js script atau online tool seperti sebelumnya
   - Pastikan password hash diisi dengan benar di `.env.local`

3. **Periksa format JWT_SECRET:**
   - Pastikan JWT_SECRET adalah string acak yang panjangnya minimal 32 karakter
   - Jangan gunakan contoh default dari `.env.local.example`

4. **Restart server setelah perubahan:**
   ```bash
   # Hentikan server (jika sedang berjalan)
   # Ctrl+C untuk stop proses
   
   # Restart server
   npm run dev
   ```

5. **Pastikan tidak ada karakter khusus yang salah di .env.local:**
   - Hindari menggunakan karakter seperti `#` di password atau secret
   - Pastikan tidak ada spasi di awal/akhir value
   - Pastikan tidak ada karakter spesial yang tidak di-escape dengan benar

### File Upload Gagal (size terlalu besar)

**Penyebab:**
- File melebihi 25MB

**Solusi:**
1. Compress file terlebih dahulu
2. Atau update max file size di `app/laporan/page.tsx`

### Error saat npm install

**Solusi:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Delete package-lock.json
rm package-lock.json

# Install ulang
npm install
```

### Vercel Build Failed

**Penyebab:**
- Environment variables belum diset
- TypeScript errors

**Solusi:**
1. Pastikan SEMUA env variables sudah diset di Vercel
2. Check build logs untuk error spesifik
3. Test build local: `npm run build`

---

## 📞 Support

Jika masih ada masalah, silakan hubungi tim IT UKPBJ Kemnaker dengan informasi berikut:
- Screenshot error
- File log (jika ada)
- Langkah-langkah yang sudah dicoba

---

**Created by**: Tim IT UKPBJ Kemnaker  
**Version**: 1.0.0  
**Last Updated**: Oktober 2025
