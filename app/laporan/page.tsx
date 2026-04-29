'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DatePicker from '@/components/DatePicker';
import FileUpload from '@/components/FileUpload';

export default function LaporanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    kategori: '',
    waktuKejadian: '',
    subjek: '',
    isiLaporan: '',
    kategoriLainnya: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.kategori === 'Lainnya' && (!formData.kategoriLainnya || !formData.kategoriLainnya.trim())) {
      alert('Mohon sebutkan kategori lainnya.');
      return;
    }

    setLoading(true);

    try {
      // Create a FormData object to send both form data and files
      const formDataToSend = new FormData();
      
      const finalKategori = formData.kategori === 'Lainnya' 
        ? `Lainnya - ${formData.kategoriLainnya}` 
        : formData.kategori;

      // Add form fields to FormData
      formDataToSend.append('kategori', finalKategori);
      formDataToSend.append('waktuKejadian', formData.waktuKejadian);
      formDataToSend.append('subjek', formData.subjek);
      formDataToSend.append('isiLaporan', formData.isiLaporan);
      
      // Add files to FormData
      selectedFiles.forEach((file, index) => {
        formDataToSend.append(`files`, file);
      });

      // Submit the report form with files
      const response = await fetch('/api/submit-laporan', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const responseData = await response.json();
        setTicketId(responseData.id);
        setSuccess(true);
        setFormData({ kategori: '', waktuKejadian: '', subjek: '', isiLaporan: '', kategoriLainnya: '' });
        setSelectedFiles([]); // Clear selected files after successful submission
      } else {
        const errorData = await response.json();
        alert(`Terjadi kesalahan: ${errorData.error || 'Silakan coba lagi.'}`);
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
        <main className="min-h-screen flex items-center justify-center py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 w-full animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Terkirim!</h1>
              <p className="text-gray-600 mb-8">
                Terima kasih atas partisipasi Anda dalam menjaga integritas. Laporan Anda telah diterima dengan aman dan anonim.
              </p>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-2">Nomor Tiket Anda</h3>
                <div className="flex items-center justify-between bg-white border border-primary-300 rounded p-4 shadow-sm">
                  <code className="text-2xl font-mono font-bold text-primary-700">{ticketId}</code>
                  <button 
                    onClick={() => {
                      if (ticketId) {
                        navigator.clipboard.writeText(ticketId);
                        alert('Nomor tiket berhasil disalin!');
                      }
                    }}
                    className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded transition-colors"
                    title="Salin Nomor Tiket"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                </div>
                <p className="text-sm text-primary-700 mt-3 flex items-start">
                  <svg className="w-5 h-5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Simpan nomor tiket ini dengan baik! Anda dapat menggunakannya untuk mengecek status tindak lanjut laporan Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => router.push(`/cek-tiket?id=${ticketId}`)} className="btn-primary">
                  Cek Status Laporan
                </button>
                <button onClick={() => router.push('/')} className="btn-secondary">
                  Kembali ke Beranda
                </button>
              </div>
            </div>
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
                    <option value="" disabled hidden>-- Pilih Kategori --</option>
                    <option value="Gratifikasi">Gratifikasi</option>
                    <option value="Kolusi / Persekongkolan Tender">Kolusi / Persekongkolan Tender</option>
                    <option value="Nepotisme">Nepotisme</option>
                    <option value="Benturan Kepentingan (Conflict of Interest)">Benturan Kepentingan (Conflict of Interest)</option>
                    <option value="Penyuapan / Pemerasan">Penyuapan / Pemerasan</option>
                    <option value="Pelanggaran Prosedur PBJ">Pelanggaran Prosedur PBJ</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Input field for "Lainnya" in Kategori */}
                {formData.kategori === 'Lainnya' && (
                  <div>
                    <label className="form-label">
                      Sebutkan Kategori Lainnya <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jelaskan kategori pelanggaran lainnya"
                      value={formData.kategoriLainnya || ''}
                      onChange={(e) => setFormData({ ...formData, kategoriLainnya: e.target.value })}
                      className="input-field"
                    />
                  </div>
                )}

                {/* Waktu Kejadian */}
                <div>
                  <DatePicker
                    label="Waktu Kejadian"
                    required={true}
                    value={formData.waktuKejadian}
                    onChange={(date) => setFormData({ ...formData, waktuKejadian: date })}
                    placeholder="Pilih tanggal kejadian..."
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

                {/* File Upload */}
                <div>
                  <label className="form-label">Lampiran Bukti</label>
                  <FileUpload
                    onFilesSelected={setSelectedFiles}
                    maxFileSize={10}
                    maxFiles={5}
                    allowedTypes={[
                      'image/jpeg',
                      'image/jpg', 
                      'image/png',
                      'application/pdf',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ]}
                  />
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
