export interface LaporanData {
  id: string;
  waktuPelaporan: string;
  kategori: string;
  subjek: string;
  waktuKejadian: string;
  isiLaporan: string;
  linkBukti: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}

export interface DeklarasiData {
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

export interface SubmitDeklarasiRequest {
  namaLengkap?: string;
  nipNik?: string;
  jabatan?: string;
  peranKegiatan?: string;
  satuanKerja?: string;
  namaKegiatan?: string;
  pihakTerkait?: string;
  bentukHubungan?: string;
  uraianDetail?: string;
  keluarga?: boolean;
  keuangan?: boolean;
  hadiah?: boolean;
  pekerjaan?: boolean;
  kepentingan?: boolean;
  lainnya?: boolean;
  lainnyaLainnya?: string;
}