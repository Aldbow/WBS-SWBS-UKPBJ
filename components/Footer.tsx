export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tentang SWBS</h3>
            <p className="text-gray-400 text-sm">
              Sistem Whistleblowing & Deklarasi Benturan Kepentingan untuk 
              meningkatkan transparansi dan akuntabilitas di lingkungan UKPBJ 
              Kementerian Ketenagakerjaan.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kontak</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Unit Kerja Pengadaan Barang/Jasa</p>
              <p>Kementerian Ketenagakerjaan RI</p>
              <p>Email: ukpbj@kemnaker.go.id</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tautan Terkait</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <a href="https://www.kemnaker.go.id" target="_blank" rel="noopener noreferrer" className="block hover:text-primary-400 transition-colors">
                Website Kemnaker
              </a>
              <a href="https://ukpbj.kemnaker.go.id" target="_blank" rel="noopener noreferrer" className="block hover:text-primary-400 transition-colors">
                Website UKPBJ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} UKPBJ Kementerian Ketenagakerjaan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
