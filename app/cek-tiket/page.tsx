'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface TicketData {
  id: string;
  waktuPengiriman: string;
  jenis: string;
  kategori: string;
  subjek: string;
  status: string;
}

function CekTiketContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialId = searchParams.get('id') || '';
  
  const [ticketIdInput, setTicketIdInput] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [searched, setSearched] = useState(false);

  // Jika ada ID dari URL saat halaman dimuat, langsung cari
  useEffect(() => {
    if (initialId && !searched) {
      handleSearch(initialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  const handleSearch = async (idToSearch: string) => {
    if (!idToSearch || !idToSearch.trim()) {
      setError('Masukkan Nomor Tiket terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setTicketData(null);

    // Update URL agar bisa dishare
    if (idToSearch !== searchParams.get('id')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('id', idToSearch);
      window.history.pushState({}, '', newUrl);
    }

    try {
      const response = await fetch(`/api/cek-tiket?id=${encodeURIComponent(idToSearch.trim())}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setTicketData(data.data);
      } else {
        throw new Error('Format data tidak valid');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Gagal mencari tiket. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'baru': return 'bg-red-100 text-red-800 border-red-200';
      case 'ditinjau': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'selesai': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cek Status Tiket</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pantau perkembangan laporan atau deklarasi Anda dengan memasukkan Nomor Tiket yang telah diberikan sebelumnya.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 border border-gray-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(ticketIdInput); }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-grow">
                <label htmlFor="ticketId" className="sr-only">Nomor Tiket</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input
                    type="text"
                    id="ticketId"
                    className="input-field pl-11 py-3 text-lg"
                    placeholder="Contoh: LP-1714392819281 atau DK-1714392819281"
                    value={ticketIdInput}
                    onChange={(e) => setTicketIdInput(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="btn-primary py-3 px-8 text-lg flex items-center justify-center shrink-0 disabled:opacity-70"
                disabled={loading || !ticketIdInput.trim()}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mencari...
                  </span>
                ) : 'Cari Tiket'}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4 flex items-start">
               <svg className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               Nomor tiket diawali dengan LP- (untuk Laporan) atau DK- (untuk Deklarasi).
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8 animate-fade-in">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {ticketData && !loading && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
              {/* Card Header with Status */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nomor Tiket</p>
                  <p className="text-xl font-mono font-bold text-gray-900">{ticketData.id}</p>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Saat Ini</p>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusBadgeColor(ticketData.status)}`}>
                    {ticketData.status}
                  </span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Jenis</h4>
                    <p className="text-gray-900 font-medium">{ticketData.jenis}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Waktu Pengiriman</h4>
                    <p className="text-gray-900 font-medium">{ticketData.waktuPengiriman}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Kategori</h4>
                    <p className="text-gray-900">
                      <span className="inline-block bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded text-sm font-medium border border-primary-100">
                        {ticketData.kategori}
                      </span>
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      {ticketData.jenis.includes('Deklarasi') ? 'Nama Kegiatan / Paket' : 'Subjek Laporan'}
                    </h4>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100 text-base leading-relaxed">
                      {ticketData.subjek}
                    </p>
                  </div>
                </div>
                
                {/* Privacy Notice */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-sm text-blue-800">
                      <strong>Informasi Privasi:</strong> Untuk menjaga kerahasiaan dan keamanan data, kami hanya menampilkan ringkasan informasi tiket ini. Rincian laporan, dokumen bukti, maupun identitas deklarator tidak dapat diakses secara publik melalui halaman pencarian tiket ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CekTiketPage() {
  return (
    <>
      <Header />
      {/* We need Suspense because useSearchParams uses client-side routing data which might suspend */}
      <Suspense fallback={<div className="min-h-screen py-16 bg-gray-50 flex justify-center"><div className="loading-spinner"></div></div>}>
        <CekTiketContent />
      </Suspense>
      <Footer />
    </>
  );
}
