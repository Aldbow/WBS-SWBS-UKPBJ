export interface DeklarasiFormData {
  namaLengkap: string;
  nipNik: string;
  jabatan: string;
  peranKegiatan: string;
  satuanKerja: string;
  namaKegiatan: string;
  pihakTerkait: string;
  bentukHubungan: string;
  uraianDetail: string;
}

export interface DeklarasiAdditionalFields {
  keluarga?: string;
  keuangan?: string;
  hadiah?: string;
  pekerjaan?: string;
  kepentingan?: string;
  lainnya?: string;
  lainnyaLainnya?: string;
}

export interface DeklarasiData extends DeklarasiFormData, DeklarasiAdditionalFields {
  id: string;
  waktuKirim: string;
}

export interface SubmitDeklarasiRequest extends DeklarasiFormData, DeklarasiAdditionalFields {}