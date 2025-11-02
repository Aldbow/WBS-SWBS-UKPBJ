'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DeklarasiFormData } from '@/types/deklarasi';

export default function DeklarasiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<DeklarasiFormData & {
    keluarga?: string;
    keuangan?: string;
    hadiah?: string;
    pekerjaan?: string;
    kepentingan?: string;
    lainnya?: string;
    lainnyaLainnya?: string;
  }>({
    namaLengkap: '',
    nipNik: '',
    jabatan: '',
    peranKegiatan: '',
    satuanKerja: '',
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
    
    // Validation for "lainnyaLainnya" when "lainnya" is "ya"
    if (formData.lainnya === 'ya' && !formData.lainnyaLainnya.trim()) {
      alert('Mohon isi keterangan untuk "Lainnya (Sebutkan)" jika Anda memilih "Ya" pada opsi tersebut.');
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
          peranKegiatan: '',
          satuanKerja: 'UKPBJ Kementerian Ketenagakerjaan',
          namaKegiatan: '',
          pihakTerkait: '',
          bentukHubungan: '',
          uraianDetail: '',
          keluarga: undefined,
          keuangan: undefined,
          hadiah: undefined,
          pekerjaan: undefined,
          kepentingan: undefined,
          lainnya: undefined,
          lainnyaLainnya: '',
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
        <main className="min-h-screen flex items-center justify-center py-16">
          <div className="max-w-2xl mx-auto px-4 text-center animate-fade-in">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Deklarasi Terkirim</h1>
            <p className="text-lg text-gray-600 mb-8">
              Deklarasi Anda telah berhasil dicatat dan dikirimkan. Terima kasih atas 
              transparansi dan komitmen Anda dalam menjaga integritas proses pengadaan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button onClick={() => router.push('/')} className="btn-primary">
                Kembali ke Beranda
              </button>
              <button
                onClick={() => {
                  // Prepare the temporary deklarasi data for PDF generation
                  const tempDeklarasi = {
                    ...formData,
                    id: `PENDING-${Date.now()}`, // Use a temporary ID since we don't have the real one yet
                    waktuKirim: new Date().toLocaleString('id-ID'),
                    status: 'Baru',
                    priority: 'Normal',
                    assignedTo: ''
                  };
                  
                  // Import the PDF generator dynamically to avoid SSR issues
                  import('@/lib/pdfGenerator').then((module) => {
                    module.generateDeklarasiPDF(tempDeklarasi);
                  });
                }}
                className="btn-secondary flex items-center justify-center"
              >
                <span className="mr-2">📥</span>
                Unduh PDF Deklarasi
              </button>
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
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-8 rounded-r-lg">
              <div className="flex items-start">
                <div className="text-3xl mr-4">⚠️</div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">
                    Formulir Deklarasi Formal
                  </h3>
                  <p className="text-yellow-800">
                    Formulir ini digunakan untuk deklarasi formal. Data diri Anda akan dicatat 
                    dan menjadi bagian dari dokumentasi resmi.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Formulir Deklarasi Benturan Kepentingan
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Bagian A: Data Diri Pegawai */}
                <div className="border-l-4 border-primary-500 pl-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Bagian A: Data Diri Pegawai</h2>
                  
                  <div className="space-y-4">
                    {/* Nama Lengkap */}
                    <div>
                      <label className="form-label">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nama lengkap sesuai identitas"
                        value={formData.namaLengkap}
                        onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* NIP/NIK */}
                    <div>
                      <label className="form-label">
                        NIP / NIK <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nomor Induk Pegawai atau NIK"
                        value={formData.nipNik}
                        onChange={(e) => setFormData({ ...formData, nipNik: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* Jabatan */}
                    <div>
                      <label className="form-label">
                        Jabatan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jabatan/Posisi saat ini"
                        value={formData.jabatan}
                        onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* Satuan Kerja */}
                    <div>
                      <label className="form-label">
                        Satuan Kerja <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: UKPBJ Kementerian Ketenagakerjaan"
                        value={formData.satuanKerja}
                        onChange={(e) => setFormData({ ...formData, satuanKerja: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* Peran dalam Kegiatan / Proses */}
                    <div>
                      <label className="form-label">
                        Peran dalam Kegiatan / Proses <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Pengadaan, Evaluasi, Pemeriksaan, dll."
                        value={formData.peranKegiatan}
                        onChange={(e) => setFormData({ ...formData, peranKegiatan: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian B: Detail Potensi Benturan Kepentingan */}
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Bagian B: Detail Potensi Benturan Kepentingan
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Nama Kegiatan / Paket Pengadaan */}
                    <div>
                      <label className="form-label">
                        Nama Kegiatan / Paket Pengadaan Terkait <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Pengadaan Komputer TA 2026"
                        value={formData.namaKegiatan}
                        onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* Pihak yang Terkait */}
                    <div>
                      <label className="form-label">
                        Pihak yang Terkait (Memiliki Hubungan) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: PT. JAYA, Direktur PT. X"
                        value={formData.pihakTerkait}
                        onChange={(e) => setFormData({ ...formData, pihakTerkait: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* Bentuk Hubungan */}
                    <div>
                      <label className="form-label">
                        Bentuk Hubungan dengan Pihak Terkait <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.bentukHubungan}
                        onChange={(e) => setFormData({ ...formData, bentukHubungan: e.target.value })}
                        className="input-field"
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
                    </div>

                    {/* Uraian Detail */}
                    <div>
                      <label className="form-label">
                        Uraian Detail Hubungan & Potensi Benturan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Jelaskan secara detail mengapa situasi ini dianggap berpotensi menimbulkan benturan kepentingan."
                        value={formData.uraianDetail}
                        onChange={(e) => setFormData({ ...formData, uraianDetail: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian B2: Situasi Potensial Benturan Kepentingan */}
                <div className="border-l-4 border-yellow-600 pl-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Bagian C: Situasi Potensial Benturan Kepentingan
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                              No
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Situasi Potensial Benturan Kepentingan
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                              Ya
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                              Tidak
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Row 2 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1</td>
                            <td className="px-6 py-4 text-sm text-gray-900">Memiliki hubungan keuangan atau kepemilikan bisnis dengan pihak yang terlibat</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="keuangan"
                                  value="ya"
                                  checked={formData.keuangan === 'ya'}
                                  onChange={() => setFormData({ ...formData, keuangan: 'ya' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="keuangan"
                                  value="tidak"
                                  checked={formData.keuangan === 'tidak'}
                                  onChange={() => setFormData({ ...formData, keuangan: 'tidak' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                          </tr>
                          {/* Row 3 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                            <td className="px-6 py-4 text-sm text-gray-900">Menerima hadiah, fasilitas, atau imbalan dari pihak yang berkepentingan</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="hadiah"
                                  value="ya"
                                  checked={formData.hadiah === 'ya'}
                                  onChange={() => setFormData({ ...formData, hadiah: 'ya' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="hadiah"
                                  value="tidak"
                                  checked={formData.hadiah === 'tidak'}
                                  onChange={() => setFormData({ ...formData, hadiah: 'tidak' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                          </tr>
                          {/* Row 4 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                            <td className="px-6 py-4 text-sm text-gray-900">Pernah bekerja di pihak penyedia barang/jasa terkait</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="pekerjaan"
                                  value="ya"
                                  checked={formData.pekerjaan === 'ya'}
                                  onChange={() => setFormData({ ...formData, pekerjaan: 'ya' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="pekerjaan"
                                  value="tidak"
                                  checked={formData.pekerjaan === 'tidak'}
                                  onChange={() => setFormData({ ...formData, pekerjaan: 'tidak' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                          </tr>
                          {/* Row 5 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                            <td className="px-6 py-4 text-sm text-gray-900">Memiliki kepentingan pribadi yang mempengaruhi objektivitas</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="kepentingan"
                                  value="ya"
                                  checked={formData.kepentingan === 'ya'}
                                  onChange={() => setFormData({ ...formData, kepentingan: 'ya' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="kepentingan"
                                  value="tidak"
                                  checked={formData.kepentingan === 'tidak'}
                                  onChange={() => setFormData({ ...formData, kepentingan: 'tidak' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                          </tr>
                          {/* Row 6 */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                            <td className="px-6 py-4 text-sm text-gray-900">Lainnya (Sebutkan)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="lainnya"
                                  value="ya"
                                  checked={formData.lainnya === 'ya'}
                                  onChange={() => setFormData({ ...formData, lainnya: 'ya' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="lainnya"
                                  value="tidak"
                                  checked={formData.lainnya === 'tidak'}
                                  onChange={() => setFormData({ ...formData, lainnya: 'tidak' })}
                                  className="form-radio h-4 w-4 text-primary-600"
                                />
                              </label>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Input field for "Lainnya (Sebutkan)" when "Ya" is selected */}
                    {formData.lainnya === 'ya' && (
                      <div className="mt-4">
                        <label className="form-label">
                          Sebutkan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Jelaskan situasi lain yang berpotensi menimbulkan benturan kepentingan"
                          value={formData.lainnyaLainnya}
                          onChange={(e) => setFormData({ ...formData, lainnyaLainnya: e.target.value })}
                          className="input-field"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bagian C: Pernyataan */}
                <div className="border-l-4 border-red-500 pl-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Bagian D: Pernyataan</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 mr-3 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Saya menyatakan bahwa data yang saya isikan adalah <strong>benar</strong> dan 
                        saya bersedia menerima konsekuensi jika data ini tidak benar.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading || !agreed}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner mr-2"></span>
                        Sedang Mengirim...
                      </>
                    ) : (
                      'Kirim Deklarasi'
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
