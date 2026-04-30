'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardAnalytics from '@/components/analytics/DashboardAnalytics';

interface LaporanData {
  id: string;
  waktuPelaporan: string;
  kategori: string;
  subjek: string;
  waktuKejadian: string;
  isiLaporan: string;
  linkBukti: string;
  status?: string;
  priority?: string;
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
  keluarga?: string;
  keuangan?: string;
  hadiah?: string;
  pekerjaan?: string;
  kepentingan?: string;
  lainnya?: string;
  lainnyaLainnya?: string;
  status?: string;
  priority?: string;
}

interface EvidenceFile {
  name: string;
  size?: number;
  type?: string;
}

// Evidence Files Section Component
const EvidenceFilesSection = ({ reportDir }: { reportDir: string }) => {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvidenceFiles = async () => {
      if (!reportDir) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/admin/list-evidence?reportDir=${encodeURIComponent(reportDir)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch evidence files');
        }

        const data = await response.json();
        setFiles(data.files.map((name: string) => ({ name }))); // Add more file info if needed
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching evidence files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidenceFiles();
  }, [reportDir]);

  if (!reportDir) return <p className="text-gray-500 mt-1">Tidak ada bukti yang diunggah</p>;
  if (loading) return <p className="text-gray-500 mt-1">Memuat bukti...</p>;
  if (error) return <p className="text-red-500 mt-1">Error: {error}</p>;
  if (files.length === 0) return <p className="text-gray-500 mt-1">Tidak ada bukti yang diunggah</p>;

  return (
    <div className="mt-4 grid grid-cols-1 gap-6">
      {files.map((file, index) => {
        const fileUrl = `/api/admin/view-file?fileName=${encodeURIComponent(file.name)}&reportDir=${encodeURIComponent(reportDir)}`;
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
        const isPdf = /\.pdf$/i.test(file.name);

        return (
          <div key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-3 overflow-hidden">
              <div className="flex items-center text-gray-800 text-sm font-semibold truncate max-w-[60%]">
                <span className="mr-2 flex-shrink-0 text-lg">📎</span>
                <span className="truncate">{file.name}</span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-700 hover:text-primary-900 bg-primary-100 hover:bg-primary-200 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  title="Lihat Penuh di Tab Baru"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                  Full View
                </a>
                <a
                  href={fileUrl}
                  download={file.name}
                  className="flex items-center text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  title="Download File"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Download
                </a>
              </div>
            </div>

            {isImage ? (
              <div className="mt-2 rounded-lg overflow-hidden bg-white border border-gray-200 flex justify-center items-center shadow-inner">
                <img
                  src={fileUrl}
                  alt={file.name}
                  className="w-full max-h-[600px] object-contain"
                  loading="lazy"
                />
              </div>
            ) : isPdf ? (
              <div className="mt-2 h-[600px] rounded-lg overflow-hidden border border-gray-200 bg-white shadow-inner">
                <iframe
                  src={`${fileUrl}#toolbar=0`}
                  className="w-full h-full"
                  title={file.name}
                ></iframe>
              </div>
            ) : (
              <div className="mt-2 h-48 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 shadow-inner">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <span className="text-sm font-medium">Pratinjau tidak tersedia</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'laporan' | 'deklarasi'>('deklarasi');
  const [laporanData, setLaporanData] = useState<LaporanData[]>([]);
  const [deklarasiData, setDeklarasiData] = useState<DeklarasiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<LaporanData | DeklarasiData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null); // for displaying errors
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [draftStatus, setDraftStatus] = useState<string>('');
  const [draftPriority, setDraftPriority] = useState<string>('');

  useEffect(() => {
    if (selectedItem) {
      setDraftStatus(selectedItem.status || 'Baru');
      setDraftPriority(selectedItem.priority || 'Normal');
    }
  }, [selectedItem]);

  const getStatusBadgeColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'baru': return 'bg-red-100 text-red-800';
      case 'ditinjau': return 'bg-yellow-100 text-yellow-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'kritis': return 'bg-red-600 text-white';
      case 'tinggi': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'rendah': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, newPriority: string, sheetType: 'laporan' | 'deklarasi') => {
    setUpdatingStatus(true);
    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, newStatus, newPriority, sheetType }),
      });
      if (response.ok) {
        // Optimistic UI Update
        if (sheetType === 'laporan') {
          setLaporanData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, priority: newPriority } : item));
        } else {
          setDeklarasiData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, priority: newPriority } : item));
        }
        setSelectedItem(prev => prev ? { ...prev, status: newStatus, priority: newPriority } : null);
      } else {
        const err = await response.json();
        alert('Gagal update: ' + err.error);
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan koneksi saat update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string, sheetType: 'laporan' | 'deklarasi', linkBukti?: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini secara permanen? Data dan file lampiran akan dihapus sepenuhnya.")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch('/api/admin/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sheetType, linkBukti }),
      });
      if (response.ok) {
        // Optimistic UI Update: Remove from local state
        if (sheetType === 'laporan') {
          setLaporanData(prev => prev.filter(item => item.id !== id));
        } else {
          setDeklarasiData(prev => prev.filter(item => item.id !== id));
        }
      } else {
        const err = await response.json();
        alert('Gagal menghapus: ' + err.error);
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan koneksi saat menghapus data.');
    } finally {
      setDeletingId(null);
    }
  };



  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      // Always fetch fresh data from Google Spreadsheet (no cache)
      console.log('Fetching fresh data from Google Spreadsheet...');

      // If no cache, fetch from APIs
      const [laporanRes, deklarasiRes] = await Promise.all([
        fetch('/api/admin/get-laporan'),
        fetch('/api/admin/get-deklarasi')
      ]);

      if (!laporanRes.ok) {
        if (laporanRes.status === 401) {
          router.push('/admin');
          return;
        }
        const laporanError = await laporanRes.json();
        console.error('Laporan API error:', laporanError);
        throw new Error(laporanError.error || 'Gagal memuat data laporan');
      }

      if (!deklarasiRes.ok) {
        if (deklarasiRes.status === 401) {
          router.push('/admin');
          return;
        }
        const deklarasiError = await deklarasiRes.json();
        console.error('Deklarasi API error:', deklarasiError);
        throw new Error(deklarasiError.error || 'Gagal memuat data deklarasi');
      }

      const laporanData = await laporanRes.json();
      const deklarasiData = await deklarasiRes.json();

      console.log('Laporan data received:', laporanData.data?.length || 0, 'records');
      console.log('Deklarasi data received:', deklarasiData.data?.length || 0, 'records');

      setLaporanData(laporanData.data || []);
      setDeklarasiData(deklarasiData.data || []);

      // No caching - always fetch fresh data from Google Spreadsheet
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    router.push('/admin');
  };



  const filteredLaporan = laporanData.filter(item =>
  (item.subjek?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori?.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Top Management</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
            <button
              onClick={() => { setError(null); fetchData(); }}
              className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Muat Ulang Data
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Deklarasi</p>
                <p className="text-4xl font-bold mt-2">{deklarasiData.length}</p>
              </div>
              <div className="text-6xl opacity-20">📝</div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Total Laporan</p>
                <p className="text-4xl font-bold mt-2">{laporanData.length}</p>
              </div>
              <div className="text-6xl opacity-20">📢</div>
            </div>
          </div>
        </div>

        {/* Analytics Section - Only show if there's data */}
        {laporanData.length > 0 || deklarasiData.length > 0 ? (
          <div className="mb-8">
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">Analisis dan Laporan</h2> */}
            <DashboardAnalytics laporanData={laporanData} deklarasiData={deklarasiData} />
          </div>
        ) : null}



        {/* Tabs */}
        <div className="card">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('deklarasi')}
                className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${activeTab === 'deklarasi'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Deklarasi ({deklarasiData.length})
              </button>
              <button
                onClick={() => setActiveTab('laporan')}
                className={`pb-4 px-2 font-semibold border-b-2 transition-colors ${activeTab === 'laporan'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Laporan ({laporanData.length})
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

            <button
              onClick={() => {
                fetchData();
              }}
              className="btn-secondary flex items-center active:scale-95 transition-transform duration-150"
            >
              <span>🔄</span>
              <span className="ml-2">Refresh</span>
            </button>
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
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Tiket</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjek</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kejadian</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioritas</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLaporan.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.waktuPelaporan}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                                {item.kategori}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.subjek}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.waktuKejadian}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                                {item.status || 'Baru'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(item.priority)}`}>
                                {item.priority || 'Normal'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => { setIsEditMode(false); setSelectedItem(item); }}
                                  className="text-blue-600 hover:text-blue-800 active:scale-90 transition-transform duration-150 ease-in-out p-1 hover:bg-blue-50 rounded-full"
                                  title="Lihat Detail"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                </button>
                                <button
                                  onClick={() => { setIsEditMode(true); setSelectedItem(item); }}
                                  className="text-yellow-600 hover:text-yellow-800 active:scale-90 transition-transform duration-150 ease-in-out p-1 hover:bg-yellow-50 rounded-full"
                                  title="Edit Status/Prioritas"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id, 'laporan', item.linkBukti)}
                                  disabled={deletingId === item.id}
                                  className={`active:scale-90 transition-all duration-150 ease-in-out p-1 rounded-full ${deletingId === item.id ? 'text-gray-400' : 'text-red-600 hover:text-red-800 hover:bg-red-50'}`}
                                  title="Hapus Data"
                                >
                                  {deletingId === item.id ? (
                                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                  )}
                                </button>
                              </div>
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
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Tiket</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIP/NIK</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kegiatan</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioritas</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDeklarasi.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.waktuKirim}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.namaLengkap}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.nipNik}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.namaKegiatan}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                                {item.status || 'Baru'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(item.priority)}`}>
                                {item.priority || 'Normal'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => { setIsEditMode(false); setSelectedItem(item); }}
                                  className="text-blue-600 hover:text-blue-800 active:scale-90 transition-transform duration-150 ease-in-out p-1 hover:bg-blue-50 rounded-full"
                                  title="Lihat Detail"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                </button>
                                <button
                                  onClick={() => { setIsEditMode(true); setSelectedItem(item); }}
                                  className="text-yellow-600 hover:text-yellow-800 active:scale-90 transition-transform duration-150 ease-in-out p-1 hover:bg-yellow-50 rounded-full"
                                  title="Edit Status/Prioritas"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id, 'deklarasi')}
                                  disabled={deletingId === item.id}
                                  className={`active:scale-90 transition-all duration-150 ease-in-out p-1 rounded-full ${deletingId === item.id ? 'text-gray-400' : 'text-red-600 hover:text-red-800 hover:bg-red-50'}`}
                                  title="Hapus Data"
                                >
                                  {deletingId === item.id ? (
                                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                  )}
                                </button>
                              </div>
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
              <h3 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Status & Prioritas' : 'Detail'}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            {!isEditMode && (
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

                    {selectedItem.linkBukti && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Bukti Laporan</label>
                        <EvidenceFilesSection reportDir={selectedItem.linkBukti} />
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
                    <div className="border-l-4 border-yellow-500 pl-4 mb-6">
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

                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Situasi Potensial Benturan Kepentingan (Bagian C)</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Hubungan Keuangan</span>
                            <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selectedItem.keuangan || '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Menerima Hadiah</span>
                            <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selectedItem.hadiah || '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Pernah Bekerja</span>
                            <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selectedItem.pekerjaan || '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Kepentingan Pribadi</span>
                            <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selectedItem.kepentingan || '-'}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Lainnya</span>
                            <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{selectedItem.lainnya || '-'}</p>
                          </div>
                        </div>
                        {selectedItem.lainnya === 'ya' && selectedItem.lainnyaLainnya && (
                          <div className="mt-3">
                            <label className="text-sm font-semibold text-gray-700">Keterangan Lainnya</label>
                            <p className="text-sm text-gray-900 mt-1 bg-yellow-50 p-3 border border-yellow-200 rounded">{selectedItem.lainnyaLainnya}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className={`p-6 bg-gray-50 flex justify-end ${isEditMode ? 'rounded-b-lg' : 'border-t'}`}>
              {isEditMode ? (
                <div className="flex flex-col md:flex-row justify-between items-center w-full space-y-4 md:space-y-0">
                  <div className="flex space-x-4 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                      <select
                        value={draftStatus}
                        onChange={(e) => setDraftStatus(e.target.value)}
                        disabled={updatingStatus}
                        className="border rounded p-2 text-sm bg-white min-w-[120px]"
                      >
                        <option value="Baru">Baru</option>
                        <option value="Ditinjau">Ditinjau</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Prioritas</label>
                      <select
                        value={draftPriority}
                        onChange={(e) => setDraftPriority(e.target.value)}
                        disabled={updatingStatus}
                        className="border rounded p-2 text-sm bg-white min-w-[120px]"
                      >
                        <option value="Rendah">Rendah</option>
                        <option value="Normal">Normal</option>
                        <option value="Tinggi">Tinggi</option>
                        <option value="Kritis">Kritis</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(selectedItem.id, draftStatus, draftPriority, 'kategori' in selectedItem ? 'laporan' : 'deklarasi')}
                      disabled={updatingStatus || (draftStatus === (selectedItem.status || 'Baru') && draftPriority === (selectedItem.priority || 'Normal'))}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-transform duration-150 active:scale-95"
                    >
                      {updatingStatus ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="btn-primary shrink-0 active:scale-95 transition-transform duration-150">
                    Tutup
                  </button>
                </div>
              ) : (
                <button onClick={() => setSelectedItem(null)} className="btn-primary shrink-0 active:scale-95 transition-transform duration-150">
                  Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
