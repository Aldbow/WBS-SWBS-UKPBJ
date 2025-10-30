'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface LaporanData {
  id: string;
  waktuPelaporan: string;
  kategori: string;
  subjek: string;
  waktuKejadian: string;
  isiLaporan: string;
  linkBukti: string;
}

interface DeklarasiData {
  id: string;
  waktuKirim: string;
  namaLengkap: string;
  nipNik: string;
  jabatan: string;
  satuanKerja: string;
  namaKegiatan: string;
  pihakTerkait: string;
  bentukHubungan: string;
  uraianDetail: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'laporan' | 'deklarasi'>('laporan');
  const [laporanData, setLaporanData] = useState<LaporanData[]>([]);
  const [deklarasiData, setDeklarasiData] = useState<DeklarasiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<LaporanData | DeklarasiData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (isLoggedIn !== 'true') {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Make requests without JWT token since we're using simple auth
      const [laporanRes, deklarasiRes] = await Promise.all([
        fetch('/api/admin/get-laporan'),
        fetch('/api/admin/get-deklarasi')
      ]);

      if (laporanRes.ok) {
        const data = await laporanRes.json();
        setLaporanData(data.data || []);
      }

      if (deklarasiRes.ok) {
        const data = await deklarasiRes.json();
        setDeklarasiData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    router.push('/admin');
  };

  const filteredLaporan = laporanData.filter(item =>
    item.subjek?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeklarasi = deklarasiData.filter(item =>
    item.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaKegiatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">WBS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Dashboard Admin WBS
              </h1>
              <p className="text-sm text-gray-600">UKPBJ Kementerian Ketenagakerjaan</p>
            </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-medium shadow hover:shadow-md transition-all duration-200"
          >
            Logout
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Laporan Pelanggaran</p>
                <p className="text-4xl font-bold mt-2">{laporanData.length}</p>
              </div>
              <div className="text-5xl opacity-30">📢</div>
            </div>
            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${Math.min(100, laporanData.length * 5)}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Total Deklarasi Benturan Kepentingan</p>
                <p className="text-4xl font-bold mt-2">{deklarasiData.length}</p>
              </div>
              <div className="text-5xl opacity-30">📝</div>
            </div>
            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${Math.min(100, deklarasiData.length * 5)}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Tabs and Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200/50">
            <div className="flex px-6">
              <button
                onClick={() => setActiveTab('laporan')}
                className={`py-4 px-1 font-semibold border-b-2 transition-all duration-300 ${
                  activeTab === 'laporan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>Laporan Pelanggaran</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                    activeTab === 'laporan' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {laporanData.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('deklarasi')}
                className={`py-4 px-1 font-semibold border-b-2 transition-all duration-300 ${
                  activeTab === 'deklarasi'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>Deklarasi Benturan Kepentingan</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                    activeTab === 'deklarasi' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {deklarasiData.length}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'laporan' && (
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjek</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kejadian</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredLaporan.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Belum ada data laporan.
                        </td>
                      </tr>
                    ) : (
                      filteredLaporan.map((item, idx) => (
                        <motion.tr 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.6)" }}
                          className="transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.waktuPelaporan}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {item.kategori}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.subjek}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.waktuKejadian}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Baru
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="text-blue-600 hover:text-blue-900 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'deklarasi' && (
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">NIP/NIK</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kegiatan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredDeklarasi.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          Belum ada data deklarasi.
                        </td>
                      </tr>
                    ) : (
                      filteredDeklarasi.map((item, idx) => (
                        <motion.tr 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.6)" }}
                          className="transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.waktuKirim}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.namaLengkap}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nipNik}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.namaKegiatan}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Terverifikasi
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="text-blue-600 hover:text-blue-900 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center rounded-t-2xl">
                <h3 className="text-2xl font-bold text-gray-900">Detail</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {'kategori' in selectedItem ? (
                  /* Laporan Detail */
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Pelapor</label>
                          <p className="text-gray-900 mt-1 font-medium">Anonim</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Waktu Pelaporan</label>
                          <p className="text-gray-900 mt-1">{selectedItem.waktuPelaporan}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Kategori Pelanggaran</label>
                          <p className="mt-1">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {selectedItem.kategori}
                            </span>
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Waktu Kejadian</label>
                          <p className="text-gray-900 mt-1">{selectedItem.waktuKejadian}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="text-sm font-semibold text-gray-700">Subjek Pelaporan</label>
                      <p className="text-gray-900 mt-2 font-medium">{selectedItem.subjek}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="text-sm font-semibold text-gray-700">Isi Laporan</label>
                      <p className="text-gray-900 mt-2 whitespace-pre-wrap">{selectedItem.isiLaporan}</p>
                    </div>
                    
                    {selectedItem.linkBukti && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-sm font-semibold text-gray-700">Bukti Laporan</label>
                        <div className="mt-3 space-y-2">
                          {selectedItem.linkBukti.split(',').map((link, i) => (
                            <a
                              key={i}
                              href={link.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 bg-white border border-gray-300 rounded-lg text-blue-600 hover:text-blue-800 hover:border-blue-400 transition-colors"
                            >
                              📎 File Bukti {i + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Deklarasi Detail */
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg">Data Diri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                          <p className="text-gray-900 mt-1">{selectedItem.namaLengkap}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">NIP/NIK</label>
                          <p className="text-gray-900 mt-1">{selectedItem.nipNik}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Jabatan</label>
                          <p className="text-gray-900 mt-1">{selectedItem.jabatan}</p>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Satuan Kerja</label>
                          <p className="text-gray-900 mt-1">{selectedItem.satuanKerja}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg">Detail Benturan Kepentingan</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-700">Nama Kegiatan/Paket</label>
                          <p className="text-gray-900 mt-1">{selectedItem.namaKegiatan}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-700">Pihak Terkait</label>
                          <p className="text-gray-900 mt-1">{selectedItem.pihakTerkait}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-700">Bentuk Hubungan</label>
                          <p className="text-gray-900 mt-1">{selectedItem.bentukHubungan}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-700">Uraian Detail</label>
                          <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedItem.uraianDetail}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-semibold text-gray-700">Waktu Pengiriman</label>
                        <p className="text-gray-900 mt-1">{selectedItem.waktuKirim}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-white border-t p-6 rounded-b-2xl flex justify-end">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium shadow hover:shadow-md transition-all duration-200"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
