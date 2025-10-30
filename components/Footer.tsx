export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-slate-800 text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Tentang SWBS
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              Sistem Whistleblowing & Deklarasi Benturan Kepentingan untuk 
              meningkatkan transparansi dan akuntabilitas di lingkungan UKPBJ 
              Kementerian Ketenagakerjaan.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Kontak
            </h3>
            <div className="space-y-3 text-gray-300 text-base">
              <p>Unit Kerja Pengadaan Barang/Jasa</p>
              <p>Kementerian Ketenagakerjaan RI</p>
              <p>Email: <a href="mailto:ukpbj@kemnaker.go.id" className="text-blue-300 hover:text-blue-200 transition-colors">ukpbj@kemnaker.go.id</a></p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Tautan Terkait
            </h3>
            <div className="space-y-3 text-gray-300 text-base">
              <a href="https://www.kemnaker.go.id" target="_blank" rel="noopener noreferrer" className="block hover:text-blue-300 transition-colors duration-200">
                Website Kemnaker
              </a>
              <a href="https://ukpbj.kemnaker.go.id" target="_blank" rel="noopener noreferrer" className="block hover:text-blue-300 transition-colors duration-200">
                Website UKPBJ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-12 pt-8 text-center text-gray-400 text-base">
          <p>&copy; {new Date().getFullYear()} UKPBJ Kementerian Ketenagakerjaan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
