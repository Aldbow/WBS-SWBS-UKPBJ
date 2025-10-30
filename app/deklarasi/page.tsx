'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function DeklarasiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nipNik: '',
    jabatan: '',
    satuanKerja: 'UKPBJ Kementerian Ketenagakerjaan',
    namaKegiatan: '',
    pihakTerkait: '',
    bentukHubungan: '',
    uraianDetail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Anda harus menyetujui pernyataan terlebih dahulu.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/submit-deklarasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          namaLengkap: '',
          nipNik: '',
          jabatan: '',
          satuanKerja: 'UKPBJ Kementerian Ketenagakerjaan',
          namaKegiatan: '',
          pihakTerkait: '',
          bentukHubungan: '',
          uraianDetail: '',
        });
        setAgreed(false);
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
        <main className="min-h-screen flex items-center justify-center py-16 bg-gradient-to-br from-green-50 to-emerald-100">
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
              className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-4"
            >
              Deklarasi Terkirim
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 mb-8"
            >
              Deklarasi Anda telah berhasil dicatat dan dikirimkan. Terima kasih atas 
              transparansi dan komitmen Anda dalam menjaga integritas proses pengadaan.
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
      <main className="min-h-screen py-16 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Modern Alert Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-8 mb-8 shadow-lg"
            >
              <div className="flex items-start">
                <div className="text-4xl mr-4">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Formulir Deklarasi Formal
                  </h3>
                  <p className="text-amber-100">
                    Formulir ini digunakan untuk deklarasi formal. Data diri Anda akan dicatat 
                    dan menjadi bagian dari dokumentasi resmi.
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
                <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  Formulir Deklarasi Benturan Kepentingan
                </span>
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Bagian A: Data Diri Pegawai */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">A</div>
                    <h2 className="text-xl font-bold text-gray-800">Data Diri Pegawai</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nama lengkap sesuai identitas"
                        value={formData.namaLengkap}
                        onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                        className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        NIP / NIK <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nomor Induk Pegawai atau NIK"
                        value={formData.nipNik}
                        onChange={(e) => setFormData({ ...formData, nipNik: e.target.value })}
                        className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Jabatan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Jabatan/Posisi saat ini"
                          value={formData.jabatan}
                          onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                          className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Satuan Kerja <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.satuanKerja}
                          onChange={(e) => setFormData({ ...formData, satuanKerja: e.target.value })}
                          className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bagian B: Detail Potensi Benturan Kepentingan */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold mr-3">B</div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Detail Potensi Benturan Kepentingan
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Nama Kegiatan / Paket Pengadaan Terkait <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Pengadaan Komputer TA 2026"
                        value={formData.namaKegiatan}
                        onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                        className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Pihak yang Terkait (Memiliki Hubungan) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: PT. Maju Mundur atau Bapak Budi Hartono, Direktur PT. X"
                        value={formData.pihakTerkait}
                        onChange={(e) => setFormData({ ...formData, pihakTerkait: e.target.value })}
                        className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Bentuk Hubungan dengan Pihak Terkait <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.bentukHubungan}
                          onChange={(e) => setFormData({ ...formData, bentukHubungan: e.target.value })}
                          className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none"
                        >
                          <option value="">-- Pilih Bentuk Hubungan --</option>
                          <option value="Hubungan Keluarga (Suami/Istri, Anak, Saudara Kandung, Orang Tua, Mertua)">
                            Hubungan Keluarga (Suami/Istri, Anak, Saudara Kandung, Orang Tua, Mertua)
                          </option>
                          <option value="Hubungan Bisnis / Finansial (Kepemilikan Saham, Posisi Direksi/Komisaris)">
                            Hubungan Bisnis / Finansial (Kepemilikan Saham, Posisi Direksi/Komisaris)
                          </option>
                          <option value="Hubungan Pekerjaan (Pernah bekerja di perusahaan tsb dalam 1 tahun terakhir)">
                            Hubungan Pekerjaan (Pernah bekerja di perusahaan tsb dalam 1 tahun terakhir)
                          </option>
                          <option value="Hubungan Pertemanan Dekat / Relasi Sosial Kuat">
                            Hubungan Pertemanan Dekat / Relasi Sosial Kuat
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

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Uraian Detail Hubungan & Potensi Benturan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Jelaskan secara detail mengapa situasi ini dianggap berpotensi menimbulkan benturan kepentingan."
                        value={formData.uraianDetail}
                        onChange={(e) => setFormData({ ...formData, uraianDetail: e.target.value })}
                        className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian C: Pernyataan */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200/50">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold mr-3">C</div>
                    <h2 className="text-xl font-bold text-gray-800">Pernyataan</h2>
                  </div>
                  
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 mr-3 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        Saya menyatakan bahwa data yang saya isikan adalah <strong>benar</strong> dan 
                        saya bersedia menerima konsekuensi jika data ini tidak benar.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading || !agreed}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                      'Kirim Deklarasi'
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
