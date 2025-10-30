'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedCard from '@/components/AnimatedCard';
import StaggerContainer from '@/components/StaggerContainer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section with Modern Gradient */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 opacity-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-transparent via-blue-50/10 to-indigo-100/20" />
          
          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-5xl mx-auto text-center">
              <AnimatedSection animation="slideUp" delay={0.1}>
                <div className="inline-block px-4 py-1 mb-4 bg-blue-100/30 backdrop-blur-sm rounded-full border border-blue-200/30">
                  <span className="text-blue-600 text-sm font-medium">UKPBJ Kementerian Ketenagakerjaan</span>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slideUp" delay={0.2}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
                  Jaga Integritas Pengadaan
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="slideUp" delay={0.3}>
                <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                  Sistem Whistleblowing &amp; Deklarasi Benturan Kepentingan untuk meningkatkan 
                  transparansi dan akuntabilitas di lingkungan UKPBJ Kementerian Ketenagakerjaan.
                </p>
              </AnimatedSection>
              
              <AnimatedSection animation="slideUp" delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link 
                    href="/laporan" 
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-lg">📢</span>
                      <span>Buat Laporan (Anonim)</span>
                    </span>
                    <div className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-hover:bg-white/10" />
                  </Link>
                  
                  <Link 
                    href="/deklarasi" 
                    className="group relative px-8 py-4 bg-white text-indigo-700 border-2 border-indigo-200 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-lg">📝</span>
                      <span>Buat Deklarasi Benturan Kepentingan</span>
                    </span>
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-50 to-blue-50 transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
                  </Link>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slideUp" delay={0.5}>
                <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span>100% Anonim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span>Terkoneksi ke Google Drive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                    <span>Data Terekam Aman</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* What is WBS Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection animation="slideUp" className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Apa itu <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Whistleblowing System</span>?
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <AnimatedSection animation="slideRight" delay={0.2}>
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">1</span>
                          Keamanan &amp; Anonimitas
                        </h3>
                        <p className="text-gray-700">
                          Sistem kami menjamin kerahasiaan pelapor sepenuhnya tanpa mencatat 
                          alamat IP atau data pribadi lainnya.
                        </p>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">2</span>
                          Transparansi &amp; Akuntabilitas
                        </h3>
                        <p className="text-gray-700">
                          Setiap laporan yang masuk akan diproses secara transparan oleh 
                          tim yang berwenang.
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                  
                  <AnimatedSection animation="slideLeft" delay={0.3}>
                    <div className="relative group">
                      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl">
                        {/* Icon with Premium Glow Effect */}
                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-25"></div>
                            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                              <span className="text-2xl text-white drop-shadow-md">🛡️</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content with Elegant Typography */}
                        <div className="text-center space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900 tracking-tight bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
                            Jaminan Perlindungan
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-sm px-2">
                            Identitas pelapor sepenuhnya dilindungi dan tidak akan terungkap.
                          </p>
                        </div>
                        
                        {/* Subtle Accent Divider */}
                        <div className="mt-6 pt-4 border-t border-gray-200/30">
                          <div className="flex justify-center">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Premium Hover Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur"></div>
                      </div>
                      
                      {/* Sophisticated Corner Details */}
                      <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-20"></div>
                      <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-20"></div>
                    </div>
                  </AnimatedSection>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fadeIn" delay={0.4}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 mt-16">
                  <p className="text-lg text-gray-700 leading-relaxed text-center">
                    Sistem ini juga menyediakan sarana bagi pegawai UKPBJ untuk mendeklarasikan potensi 
                    <span className="font-semibold text-indigo-700"> benturan kepentingan</span> secara 
                    <span className="font-semibold text-indigo-700"> transparan dan formal</span>, 
                    guna menjaga integritas proses pengadaan.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* What Can Be Reported Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,_rgba(120,119,198,0.3),_transparent_50%)]" />
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <AnimatedSection animation="slideUp" className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Apa yang Bisa <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Dilaporkan</span>?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Berikut adalah jenis-jenis pelanggaran yang dapat Anda laporkan melalui sistem ini
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto rounded-full mt-4" />
              </AnimatedSection>
              
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
                {[
                  { emoji: '💰', title: 'Korupsi', desc: 'Penyalahgunaan wewenang atau penyelewengan dana dalam proses PBJ.' },
                  { emoji: '🤝', title: 'Kolusi', desc: 'Persekongkolan tender atau pengaturan pemenang lelang.' },
                  { emoji: '👨‍👩‍👧‍👦', title: 'Nepotisme', desc: 'Pemberian keuntungan kepada keluarga atau kerabat dekat.' },
                  { emoji: '🎁', title: 'Gratifikasi', desc: 'Pemberian hadiah atau imbalan yang tidak sesuai ketentuan.' },
                  { emoji: '⚖️', title: 'Benturan Kepentingan', desc: 'Konflik antara kepentingan pribadi dan tugas dalam PBJ.' },
                  { emoji: '📋', title: 'Pelanggaran Prosedur', desc: 'Penyimpangan dari prosedur standar pengadaan yang berlaku.' }
                ].map((item, index) => (
                  <AnimatedCard key={index} className="group">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">{item.emoji}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200/50">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-indigo-600 font-medium">Detail</span>
                          <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <span className="text-indigo-600 text-sm">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Confidentiality Guarantee Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <AnimatedSection animation="zoomIn" className="mb-12">
                <div className="inline-block p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 mb-8">
                  <div className="text-6xl text-white">🔒</div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="slideUp" delay={0.2}>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Jaminan <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Kerahasiaan</span> 100%
                </h2>
              </AnimatedSection>
              
              <AnimatedSection animation="slideUp" delay={0.3}>
                <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Sistem kami <strong>tidak mencatat</strong> alamat IP, lokasi, atau data pribadi apapun dari pelapor anonim.
                  Identitas Anda dijamin <strong>terlindungi sepenuhnya</strong>.
                </p>
              </AnimatedSection>
              
              <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto" staggerDelay={0.2}>
                {[
                  { emoji: '🔐', title: 'Enkripsi SSL', desc: 'Data terenkripsi dengan protokol HTTPS' },
                  { emoji: '🚫', title: 'Tanpa Tracking', desc: 'Tidak ada pencatatan IP atau metadata' },
                  { emoji: '👤', title: '100% Anonim', desc: 'Identitas pelapor tidak pernah diminta' }
                ].map((item, index) => (
                  <AnimatedCard key={index} className="group">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.emoji}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-white/80">{item.desc}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23a855f7&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection animation="slideUp" className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Siap untuk <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Berkontribusi</span>?
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Pilih tindakan yang ingin Anda lakukan untuk menjaga integritas pengadaan
                </p>
              </AnimatedSection>
              
              <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto" staggerDelay={0.2}>
                <AnimatedCard>
                  <Link href="/laporan" className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-300/50">
                    <div className="text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📢</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                        Laporkan Pelanggaran
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Sampaikan dugaan pelanggaran secara anonim dan aman.
                      </p>
                      <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                        <span>Buat Laporan</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedCard>
                
                <AnimatedCard>
                  <Link href="/deklarasi" className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-indigo-300/50">
                    <div className="text-center">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                        Deklarasi Benturan Kepentingan
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Laporkan potensi konflik kepentingan secara transparan.
                      </p>
                      <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                        <span>Buat Deklarasi</span>
                        <span>→</span>
                      </div>
                    </div>
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