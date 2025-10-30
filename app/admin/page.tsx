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

      if (response.ok) {
        // Store a simple admin session in localStorage
        localStorage.setItem('admin_logged_in', 'true');
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Login gagal. Silakan periksa username dan password Anda.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">WBS</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Login Admin</h2>
          <p className="mt-2 text-gray-600">Sistem Whistleblowing UKPBJ Kemnaker</p>
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
