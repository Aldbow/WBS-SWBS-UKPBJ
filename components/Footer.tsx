import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20 pt-16 pb-8 border-t-4 border-primary-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-12 max-w-5xl mx-auto">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/laporan" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Buat Laporan
                </Link>
              </li>
              <li>
                <Link href="/deklarasi" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Buat Deklarasi
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Kontak Kami</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-white mb-1">Unit Kerja Pengadaan Barang/Jasa</p>
                  <p className="text-sm">Kementerian Ketenagakerjaan RI</p>
                  <p className="text-sm mt-1 leading-relaxed">Gedung B Lantai 3, Jl. Jenderal Gatot Subroto Kav. 51, Jakarta Selatan 12950</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:ukpbj@kemnaker.go.id" className="text-sm hover:text-primary-400 transition-colors">
                  ukpbj@kemnaker.go.id
                </a>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-800">
                <a href="https://www.kemnaker.go.id" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Web Kemnaker
                </a>
                <span className="text-gray-700">•</span>
                <a href="https://ukpbj.kemnaker.go.id" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Web UKPBJ
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} UKPBJ Kementerian Ketenagakerjaan RI. Hak Cipta Dilindungi.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Syarat & Ketentuan</span>
            <span className="hover:text-gray-300 transition-colors cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
