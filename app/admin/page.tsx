'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        // Provide more specific error messages
        let errorMessage = data.error || 'Login gagal. Silakan periksa username dan password Anda.';
        if (data.error && data.error.includes('Server configuration error')) {
          errorMessage = 'Konfigurasi server bermasalah. Silakan periksa apakah environment variable sudah diatur dengan benar.';
        } else if (data.error === 'Invalid credentials') {
          errorMessage = 'Username atau password salah. Silakan coba lagi.';
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan koneksi. Silakan periksa koneksi internet Anda dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img
              src="/img/Logo_Kementerian_Ketenagakerjaan_(2016).png"
              alt="Logo Kementerian Ketenagakerjaan"
              className="h-16 w-auto object-contain"
            />
            <div className="w-px h-12 bg-gray-300"></div>
            <img
              src="/img/UKPBJ_logo.png"
              alt="Logo UKPBJ"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Selamat Datang</h2>
          <p className="mt-2 text-gray-600">Sistem Deklarasi Keterpaksaan Benturan Kepentingan UKPBJ Kemnaker</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="input-field"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="input-field"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="loading-spinner mr-2"></span>
                  Memproses...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-primary-600 hover:underline">
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
