'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LaporanData {
  id: string;
  waktuPelaporan: string;
  kategori: string;
  subjek: string;
  waktuKejadian: string;
  isiLaporan: string;
  linkBukti: string;
  status: string;
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // for filtering reports by status

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      
      const [laporanRes, deklarasiRes] = await Promise.all([
        fetch('/api/admin/get-laporan', { headers: { 'Authorization': `Bearer ${token}` }}),
        fetch('/api/admin/get-deklarasi', { headers: { 'Authorization': `Bearer ${token}` }})
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
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch('/api/admin/update-laporan-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reportId, newStatus })
      });

      if (response.ok) {
        // Update the status in the local state
        setLaporanData(prevData => 
          prevData.map(report => 
            report.id === reportId ? { ...report, status: newStatus } : report
          )
        );
        alert('Status laporan berhasil diperbarui!');
      } else {
        const errorData = await response.json();
        alert(`Gagal memperbarui status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Terjadi kesalahan saat memperbarui status laporan.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredLaporan = laporanData.filter(item =>
    (item.subjek?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );

  const filteredDeklarasi = deklarasiData.filter(item =>
    item.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaKegiatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin WBS</h1>
            <p className="text-sm text-gray-600">UKPBJ Kementerian Ketenagakerjaan</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Total Laporan Pelanggaran</p>
                <p className="text-4xl font-bold mt-2">{laporanData.length}</p>
              </div>
              <div className="text-6xl opacity-20">📢</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Deklarasi Benturan Kepentingan</p>
                <p className="text-4xl font-bold mt-2">{deklarasiData.length}</p>
              </div>
              <div className="text-6xl opacity-20">📝</div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        {activeTab === 'laporan' && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Status Laporan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 font-medium">Baru</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {laporanData.filter(item => item.status === 'Baru').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 font-medium">Diproses</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {laporanData.filter(item => item.status === 'Diproses').length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800 font-medium">Selesai</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {laporanData.filter(item => item.status === 'Selesai').length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('laporan')}
                className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'laporan'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Laporan Pelanggaran ({laporanData.length})
              </button>
              <button
                onClick={() => setActiveTab('deklarasi')}
                className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${
                  activeTab === 'deklarasi'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Deklarasi Benturan Kepentingan ({deklarasiData.length})
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-grow"
            />
            {activeTab === 'laporan' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">Semua Status</option>
                <option value="Baru">Baru</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
            )}
            <div className="text-sm text-gray-600 flex items-center">
              {activeTab === 'laporan' && `Laporan ditampilkan: ${filteredLaporan.length}`}
              {activeTab === 'deklarasi' && `Deklarasi ditampilkan: ${filteredDeklarasi.length}`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto"></div>
              <p className="text-gray-600 mt-4">Memuat data...</p>
            </div>
          ) : (
            <>
              {/* Laporan Table */}
              {activeTab === 'laporan' && (
                <div className="overflow-x-auto">
                  {filteredLaporan.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Belum ada data laporan.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjek</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kejadian</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLaporan.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.waktuPelaporan}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                                {item.kategori}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.subjek}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.waktuKejadian}</td>
                            <td className="px-4 py-3 text-sm">
                              <select
                                value={item.status}
                                onChange={(e) => updateReportStatus(item.id, e.target.value)}
                                disabled={isUpdatingStatus}
                                className={`px-2 py-1 rounded-full text-xs ${
                                  item.status === 'Baru' ? 'bg-red-100 text-red-800' :
                                  item.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                                  item.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                                <option value="Baru">Baru</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="text-primary-600 hover:text-primary-800 font-medium"
                              >
                                Lihat Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Deklarasi Table */}
              {activeTab === 'deklarasi' && (
                <div className="overflow-x-auto">
                  {filteredDeklarasi.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Belum ada data deklarasi.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP/NIK</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kegiatan</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDeklarasi.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{item.waktuKirim}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.namaLengkap}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.nipNik}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.namaKegiatan}</td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="text-primary-600 hover:text-primary-800 font-medium"
                              >
                                Lihat Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Detail</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {'kategori' in selectedItem ? (
                /* Laporan Detail */
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">ID Laporan</label>
                    <p className="text-gray-900 mt-1">{selectedItem.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Waktu Pelaporan</label>
                    <p className="text-gray-900 mt-1">{selectedItem.waktuPelaporan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Kategori Pelanggaran</label>
                    <p className="text-gray-900 mt-1">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                        {selectedItem.kategori}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Waktu Kejadian</label>
                    <p className="text-gray-900 mt-1">{selectedItem.waktuKejadian}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Subjek Pelaporan</label>
                    <p className="text-gray-900 mt-1">{selectedItem.subjek}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Isi Laporan</label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedItem.isiLaporan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        selectedItem.status === 'Baru' ? 'bg-red-100 text-red-800' :
                        selectedItem.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                        selectedItem.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedItem.status}
                      </span>
                    </p>
                  </div>
                  {selectedItem.linkBukti && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Bukti Laporan</label>
                      <div className="mt-2 space-y-2">
                        {selectedItem.linkBukti.split(',').map((link, i) => (
                          <a
                            key={i}
                            href={link.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary-600 hover:underline"
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
                <div className="space-y-4">
                  <div className="border-l-4 border-primary-500 pl-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Data Diri</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">ID Deklarasi</label>
                        <p className="text-gray-900 mt-1">{selectedItem.id}</p>
                      </div>
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
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Detail Benturan Kepentingan</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Nama Kegiatan/Paket</label>
                        <p className="text-gray-900 mt-1">{selectedItem.namaKegiatan}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Pihak Terkait</label>
                        <p className="text-gray-900 mt-1">{selectedItem.pihakTerkait}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Bentuk Hubungan</label>
                        <p className="text-gray-900 mt-1">{selectedItem.bentukHubungan}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Uraian Detail</label>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedItem.uraianDetail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Waktu Pengiriman</label>
                        <p className="text-gray-900 mt-1">{selectedItem.waktuKirim}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t p-6 flex justify-end">
              <button onClick={() => setSelectedItem(null)} className="btn-primary">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
