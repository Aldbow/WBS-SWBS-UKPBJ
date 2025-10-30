# 🔐 Setup Admin - Quick Guide

## Cara Cepat Membuat Admin

### 1. Generate Password Hash

```bash
# Edit password di generate-admin-hash.js (line 4)
# Lalu jalankan:
node generate-admin-hash.js
```

### 2. Copy Hash ke .env.local

Buka `.env.local` dan isi:

```env
# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT Secret (32+ characters random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-and-random
```

### 3. Restart Server

```bash
npm run dev
```

### 4. Login

- **URL**: http://localhost:3001/admin
- **Username**: `admin` (atau sesuai ADMIN_USERNAME di .env.local)
- **Password**: Password yang Anda set di generate-admin-hash.js

---

## 📋 Checklist Setup Admin

- [ ] Generate password hash dengan `node generate-admin-hash.js`
- [ ] Copy hash ke `.env.local` → `ADMIN_PASSWORD_HASH`
- [ ] Set username di `.env.local` → `ADMIN_USERNAME`
- [ ] Set JWT secret di `.env.local` → `JWT_SECRET`
- [ ] Restart development server
- [ ] Test login di http://localhost:3001/admin
- [ ] Verifikasi bisa akses dashboard

---

## 🔧 Generate JWT Secret

**Menggunakan Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Atau online:**
https://generate-secret.vercel.app/32

**Contoh hasil:**
```
a7f3c9d2e8b4f1a6c3d7e9b2f4a8c1d3e7f9b2a4c6d8e1f3a5b7c9d2e4f6a8b1
```

---

## 🎯 Multiple Admin (Future)

Saat ini sistem hanya support 1 admin (hardcoded credentials).

Jika butuh multiple admin di masa depan:
1. Migrate ke database (PostgreSQL/MySQL)
2. Create admin table dengan encrypted passwords
3. Implement admin management UI

---

## 🚨 Troubleshooting

### Login Gagal "Invalid credentials"

**Penyebab:**
- Password hash tidak sesuai
- Username salah
- JWT_SECRET belum diset
- Server belum di-restart setelah update .env.local

**Solusi:**
1. Generate ulang hash: `node generate-admin-hash.js`
2. Copy hash yang baru ke `.env.local`
3. Pastikan ADMIN_USERNAME sesuai
4. Pastikan JWT_SECRET terisi (min 32 karakter)
5. Restart server: `npm run dev`

### Token Invalid/Expired

**Penyebab:**
- JWT_SECRET berubah
- Token expired (8 jam)

**Solusi:**
- Login ulang untuk dapat token baru

### Dashboard Redirect ke Login

**Penyebab:**
- Token tidak tersimpan di localStorage
- Token expired/invalid

**Solusi:**
- Clear localStorage browser
- Login ulang

---

## 📞 Support

Jika masih ada masalah:
1. Check console browser (F12 → Console)
2. Check terminal untuk error logs
3. Pastikan semua environment variables terisi dengan benar

---

**Created**: October 2025  
**Last Updated**: October 2025  
**Security Level**: Production-ready
