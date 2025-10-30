'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LaporanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    kategori: '',
    waktuKejadian: '',
    subjek: '',
    isiLaporan: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('kategori', formData.kategori);
      formDataToSend.append('waktuKejadian', formData.waktuKejadian);
      formDataToSend.append('subjek', formData.subjek);
      formDataToSend.append('isiLaporan', formData.isiLaporan);
      
      if (files) {
        Array.from(files).forEach((file) => {
          formDataToSend.append('files', file);
        });
      }

      const response = await fetch('/api/submit-laporan', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ kategori: '', waktuKejadian: '', subjek: '', isiLaporan: '' });
        setFiles(null);
      } else {
        alert('Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center py-16">
          <div className="max-w-2xl mx-auto px-4 text-center animate-fade-in">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Laporan Terkirim</h1>
            <p className="text-lg text-gray-600 mb-8">
              Terima kasih atas partisipasi Anda dalam menjaga integritas UKPBJ. 
              Laporan Anda telah diterima dan akan ditinjau oleh tim yang berwenang.
            </p>
            <button onClick={() => router.push('/')} className="btn-primary">
              Kembali ke Beranda
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Alert */}
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded-r-lg">
              <div className="flex items-start">
                <div className="text-3xl mr-4">🔒</div>
                <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-2">
                    Pelaporan Anda Bersifat ANONIM
                  </h3>
                  <p className="text-primary-800">
                    Kami tidak mencatat identitas atau data pribadi Anda. Sistem ini dirancang 
                    untuk menjamin kerahasiaan 100%.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Formulir Laporan Pelanggaran</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pelapor (Read-only) */}
                <div>
                  <label className="form-label">Pelapor</label>
                  <input
                    type="text"
                    value="Anonim"
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Waktu Pelaporan (Auto-filled) */}
                <div>
                  <label className="form-label">Waktu Pelaporan</label>
                  <input
                    type="text"
                    value={new Date().toLocaleString('id-ID')}
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Kategori Pelanggaran */}
                <div>
                  <label className="form-label">
                    Kategori Pelanggaran <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="input-field"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    <option value="Gratifikasi">Gratifikasi</option>
                    <option value="Kolusi / Persekongkolan Tender">Kolusi / Persekongkolan Tender</option>
                    <option value="Nepotisme">Nepotisme</option>
                    <option value="Benturan Kepentingan (Conflict of Interest)">Benturan Kepentingan (Conflict of Interest)</option>
                    <option value="Penyuapan / Pemerasan">Penyuapan / Pemerasan</option>
                    <option value="Pelanggaran Prosedur PBJ">Pelanggaran Prosedur PBJ</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Waktu Kejadian */}
                <div>
                  <label className="form-label">
                    Waktu Kejadian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.waktuKejadian}
                    onChange={(e) => setFormData({ ...formData, waktuKejadian: e.target.value })}
                    className="input-field"
                  />
                </div>

                {/* Subjek Pelaporan */}
                <div>
                  <label className="form-label">
                    Subjek Pelaporan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={255}
                    placeholder="Contoh: Dugaan Kolusi dalam Tender Pengadaan Komputer"
                    value={formData.subjek}
                    onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.subjek.length}/255 karakter</p>
                </div>

                {/* Isi Laporan */}
                <div>
                  <label className="form-label">
                    Isi Laporan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    maxLength={5000}
                    rows={8}
                    placeholder="Jelaskan secara detail: apa yang terjadi, siapa yang terlibat, kapan dan di mana kejadian berlangsung, serta bukti atau informasi pendukung lainnya."
                    value={formData.isiLaporan}
                    onChange={(e) => setFormData({ ...formData, isiLaporan: e.target.value })}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.isiLaporan.length}/5000 karakter</p>
                </div>

                {/* Bukti Laporan */}
                <div>
                  <label className="form-label">
                    Bukti Laporan (Opsional, disarankan)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.mp3,.mp4"
                    onChange={(e) => setFiles(e.target.files)}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format yang didukung: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, MP3, MP4. Maks 25MB total.
                  </p>
                  {files && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-gray-700">File terpilih:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {Array.from(files).map((file, idx) => (
                          <li key={idx}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner mr-2"></span>
                        Sedang Mengirim...
                      </>
                    ) : (
                      'Kirim Laporan'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="btn-secondary"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
