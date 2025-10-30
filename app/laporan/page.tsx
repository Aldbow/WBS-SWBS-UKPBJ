'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

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
        <main className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto px-4 text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-200/50"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-6"
            >
              ✅
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4"
            >
              Laporan Terkirim
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 mb-8"
            >
              Terima kasih atas partisipasi Anda dalam menjaga integritas UKPBJ. 
              Laporan Anda telah diterima dan akan ditinjau oleh tim yang berwenang.
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Kembali ke Beranda
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Modern Alert Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-lg"
            >
              <div className="flex items-start">
                <div className="text-4xl mr-4">🔒</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Pelaporan Anda Bersifat ANONIM
                  </h3>
                  <p className="text-blue-100">
                    Kami tidak mencatat identitas atau data pribadi Anda. Sistem ini dirancang 
                    untuk menjamin kerahasiaan 100%.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Modern Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Formulir Laporan Pelanggaran
                </span>
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Pelapor (Read-only) */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Pelapor
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value="Anonim"
                      disabled
                      className="w-full px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 rounded-xl border border-blue-200/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Waktu Pelaporan (Auto-filled) */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Waktu Pelaporan
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={new Date().toLocaleString('id-ID')}
                      disabled
                      className="w-full px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 rounded-xl border border-blue-200/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Kategori Pelanggaran */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Kategori Pelanggaran <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      <option value="">-- Pilih Kategori --</option>
                      <option value="Gratifikasi">Gratifikasi</option>
                      <option value="Kolusi / Persekongkolan Tender">
                        Kolusi / Persekongkolan Tender
                      </option>
                      <option value="Nepotisme">Nepotisme</option>
                      <option value="Benturan Kepentingan (Conflict of Interest)">
                        Benturan Kepentingan (Conflict of Interest)
                      </option>
                      <option value="Penyuapan / Pemerasan">Penyuapan / Pemerasan</option>
                      <option value="Pelanggaran Prosedur PBJ">
                        Pelanggaran Prosedur PBJ
                      </option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Waktu Kejadian */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Waktu Kejadian <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      required
                      value={formData.waktuKejadian}
                      onChange={(e) => setFormData({ ...formData, waktuKejadian: e.target.value })}
                      className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Subjek Pelaporan */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subjek Pelaporan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={255}
                      placeholder="Contoh: Dugaan Kolusi dalam Tender Pengadaan Komputer"
                      value={formData.subjek}
                      onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                      className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {formData.subjek.length}/255 karakter
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 ml-4 flex-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${(formData.subjek.length / 255) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Isi Laporan */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Isi Laporan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      maxLength={5000}
                      rows={8}
                      placeholder="Jelaskan secara detail: apa yang terjadi, siapa yang terlibat, kapan dan di mana kejadian berlangsung, serta bukti atau informasi pendukung lainnya."
                      value={formData.isiLaporan}
                      onChange={(e) => setFormData({ ...formData, isiLaporan: e.target.value })}
                      className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {formData.isiLaporan.length}/5000 karakter
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 ml-4 flex-1">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${(formData.isiLaporan.length / 5000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bukti Laporan */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Bukti Laporan (Opsional, disarankan)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.mp3,.mp4"
                      onChange={(e) => setFiles(e.target.files)}
                      className="w-full px-4 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Format yang didukung: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, MP3, MP4. Maks 25MB total.
                    </p>
                    {files && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm font-semibold text-blue-700 mb-2">
                          File terpilih:
                        </p>
                        <ul className="space-y-2">
                          {Array.from(files).map((file, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg">
                              <div className="flex items-center">
                                <span className="text-gray-600 mr-2">📄</span>
                                <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sedang Mengirim...
                      </>
                    ) : (
                      'Kirim Laporan'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="px-6 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold shadow hover:shadow-md transition-all duration-300"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
