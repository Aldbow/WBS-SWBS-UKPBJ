import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedText from '@/components/AnimatedText';
import AnimatedCard from '@/components/AnimatedCard';
import StaggerContainer from '@/components/StaggerContainer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedText>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Jaga Integritas Pengadaan:<br />
                <span className="text-primary-600">Laporkan Pelanggaran</span>
              </h1>
            </AnimatedText>
            <AnimatedText delay={0.2}>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Deklarasi Benturan Kepentingan untuk meningkatkan transparansi dan akuntabilitas di lingkungan UKPBJ Kementerian Ketenagakerjaan.
              </p>
            </AnimatedText>
            <AnimatedSection animation="scaleUp" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/laporan" className="btn-primary text-center">
                  📢 Buat Laporan (Anonim)
                </Link>
                <Link href="/deklarasi" className="btn-secondary text-center">
                  📝 Buat Deklarasi Benturan Kepentingan
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* What is WBS Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center leading-tight">
                  Sistem Deklarasi COI <br className="hidden md:block" />
                  <span className="text-primary-600 block mt-2 text-2xl md:text-3xl font-medium">(Conflict of Interest)</span>
                </h2>
              </AnimatedSection>
              <div className="space-y-6 text-center md:text-justify max-w-3xl mx-auto">
                <AnimatedSection animation="fadeIn" delay={0.2}>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Untuk mewujudkan lingkungan kerja yang bersih, aplikasi ini didedikasikan untuk mencegah terjadinya benturan kepentingan. Anda dapat mendeklarasikan potensi konflik secara mudah dan akuntabel demi melindungi reputasi serta profesionalisme instansi.
                  </p>
                </AnimatedSection>
                <AnimatedSection animation="fadeIn" delay={0.4}>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Sistem ini merupakan bentuk komitmen jajaran pegawai UKPBJ dalam menjaga integritas instansi. Melalui transparansi yang proaktif, kami berupaya mewujudkan pengadaan barang/jasa yang objektif, adil, dan akuntabel.
                  </p>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* What Can Be Reported Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <AnimatedSection animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
                  Apa yang Bisa Dilaporkan?
                </h2>
              </AnimatedSection>
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15}>
                <AnimatedCard className="card">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Korupsi</h3>
                  <p className="text-gray-600">Penyalahgunaan wewenang atau penyelewengan dana dalam proses PBJ.</p>
                </AnimatedCard>
                <AnimatedCard className="card">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Kolusi</h3>
                  <p className="text-gray-600">Persekongkolan tender atau pengaturan pemenang lelang.</p>
                </AnimatedCard>
                <AnimatedCard className="card">
                  <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nepotisme</h3>
                  <p className="text-gray-600">Pemberian keuntungan kepada keluarga atau kerabat dekat.</p>
                </AnimatedCard>
                <AnimatedCard className="card">
                  <div className="text-4xl mb-4">🎁</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gratifikasi</h3>
                  <p className="text-gray-600">Pemberian hadiah atau imbalan yang tidak sesuai ketentuan.</p>
                </AnimatedCard>
                <AnimatedCard className="card">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Benturan Kepentingan</h3>
                  <p className="text-gray-600">Konflik antara kepentingan pribadi dan tugas dalam PBJ.</p>
                </AnimatedCard>
                <AnimatedCard className="card">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pelanggaran Prosedur</h3>
                  <p className="text-gray-600">Penyimpangan dari prosedur standar pengadaan yang berlaku.</p>
                </AnimatedCard>
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Confidentiality Guarantee Section */}
        <section className="bg-primary-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection animation="zoomIn">
                <div className="text-6xl mb-6">🔒</div>
              </AnimatedSection>
              <AnimatedText delay={0.2}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Jaminan Kerahasiaan 100%
                </h2>
              </AnimatedText>
              <AnimatedText delay={0.3}>
                <p className="text-lg md:text-xl mb-8 opacity-90">
                  Sistem kami <strong>tidak mencatat</strong> alamat IP, lokasi, atau data pribadi apapun dari pelapor anonim.
                  Identitas Anda dijamin <strong>terlindungi sepenuhnya</strong>.
                </p>
              </AnimatedText>
              <StaggerContainer className="grid md:grid-cols-3 gap-6 text-center" staggerDelay={0.2}>
                <AnimatedCard className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl mb-2">🔐</div>
                  <h3 className="font-bold mb-2">Enkripsi SSL</h3>
                  <p className="text-sm opacity-80">Data terenkripsi dengan protokol HTTPS</p>
                </AnimatedCard>
                <AnimatedCard className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl mb-2">🚫</div>
                  <h3 className="font-bold mb-2">Tanpa Tracking</h3>
                  <p className="text-sm opacity-80">Tidak ada pencatatan IP atau metadata</p>
                </AnimatedCard>
                <AnimatedCard className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl mb-2">👤</div>
                  <h3 className="font-bold mb-2">100% Anonim</h3>
                  <p className="text-sm opacity-80">Identitas pelapor tidak pernah diminta</p>
                </AnimatedCard>
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <AnimatedSection animation="slideUp">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Mulai Sekarang
                </h2>
              </AnimatedSection>
              <AnimatedText delay={0.2}>
                <p className="text-lg text-gray-600 mb-8">
                  Pilih tindakan yang ingin Anda lakukan:
                </p>
              </AnimatedText>
              <StaggerContainer className="grid md:grid-cols-2 gap-6" staggerDelay={0.2}>
                <AnimatedCard className="card group">
                  <Link href="/laporan">
                    <div className="text-5xl mb-4">📢</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      Laporkan Pelanggaran
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Sampaikan dugaan pelanggaran secara anonim dan aman.
                    </p>
                    <span className="text-primary-600 font-semibold group-hover:underline">
                      Buat Laporan →
                    </span>
                  </Link>
                </AnimatedCard>
                <AnimatedCard className="card group">
                  <Link href="/deklarasi">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      Deklarasi Benturan Kepentingan
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Laporkan potensi konflik kepentingan secara transparan.
                    </p>
                    <span className="text-primary-600 font-semibold group-hover:underline">
                      Buat Deklarasi →
                    </span>
                  </Link>
                </AnimatedCard>
              </StaggerContainer>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
