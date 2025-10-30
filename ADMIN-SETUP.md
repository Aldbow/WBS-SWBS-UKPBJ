# 🔐 Setup Admin - Quick Guide

## Cara Cepat Membuat Admin

### 1. Set Admin Credentials

Edit `.env.local` and set:

```env
# Admin Credentials (Plain text for development)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password-here

# JWT Secret is no longer needed
```

### 3. Restart Server

```bash
npm run dev
```

### 4. Login

- **URL**: http://localhost:3001/admin
- **Username**: `admin` (atau sesuai ADMIN_USERNAME di .env.local)
- **Password**: Password yang Anda set di .env.local

---

## 📋 Checklist Setup Admin

- [ ] Set username di `.env.local` → `ADMIN_USERNAME`
- [ ] Set password di `.env.local` → `ADMIN_PASSWORD`
- [ ] Restart development server
- [ ] Test login di http://localhost:3001/admin
- [ ] Verifikasi bisa akses dashboard

---

## 🎯 Multiple Admin (Future)

Saat ini sistem hanya support 1 admin (hardcoded credentials).

Jika butuh multiple admin di masa depan:
1. Migrate ke database (PostgreSQL/MySQL)
2. Create admin table with proper authentication
3. Implement admin management UI

---

## 🚨 Troubleshooting

### Login Gagal "Invalid credentials"

**Penyebab:**
- Password tidak sesuai
- Username salah
- Server belum di-restart setelah update .env.local

**Solusi:**
1. Pastikan ADMIN_USERNAME dan ADMIN_PASSWORD sesuai di `.env.local`
2. Restart server: `npm run dev`

### Dashboard Redirect ke Login

**Penyebab:**
- Session tidak tersimpan di localStorage
- Session expired/invalid

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
**Security Level**: Development-only (use plain text authentication)
